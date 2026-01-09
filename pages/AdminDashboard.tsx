
import React, { useState, useEffect } from 'react';
import { User, FoodPost, PostStatus } from '../types';
import { apiService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminProps {
  user: User;
}

const AdminDashboard: React.FC<AdminProps> = ({ user }) => {
  const [stats, setStats] = useState({ totalMealsServed: 0, activeDonations: 0, totalDonors: 0, activeNGOs: 0 });
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [allPosts, currentStats] = await Promise.all([
          apiService.getAllFood(),
          apiService.getStats()
        ]);
        setPosts(allPosts);
        setStats(currentStats);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const chartData = [
    { name: 'Served', value: stats.totalMealsServed },
    { name: 'Active', value: stats.activeDonations * 20 }, // rough estimate of meal capacity
    { name: 'Donors', value: stats.totalDonors * 5 },
    { name: 'NGOs', value: stats.activeNGOs * 10 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500">Monitoring platform health and community impact</p>
        </div>
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-bold border border-red-100 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
          Restricted Access
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Meals Served', val: stats.totalMealsServed, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Posts', val: stats.activeDonations, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Registered Providers', val: stats.totalDonors, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active NGOs', val: stats.activeNGOs, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((s, i) => (
          <div key={i} className={`${s.bg} p-6 rounded-2xl shadow-sm border border-transparent hover:border-gray-200 transition-all`}>
            <p className="text-sm font-bold text-gray-500 uppercase mb-1">{s.label}</p>
            <p className={`text-4xl font-extrabold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Impact Trajectory</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Global Post Activity</h3>
          <div className="space-y-4 flex-grow overflow-y-auto pr-2 max-h-[300px] no-scrollbar">
            {posts.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No recent activity found.</p>
            ) : (
              posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{p.foodItems}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{p.providerName} • {p.district}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                    p.status === PostStatus.AVAILABLE ? 'bg-green-100 text-green-700' : 
                    p.status === PostStatus.COLLECTED ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
