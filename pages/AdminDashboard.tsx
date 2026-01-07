
import React, { useState, useEffect } from 'react';
import { User, FoodPost, PostStatus } from '../types';
import { mockApi } from '../services/mockApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminProps {
  user: User;
}

const AdminDashboard: React.FC<AdminProps> = ({ user }) => {
  const [stats, setStats] = useState(mockApi.getStats());
  const [posts, setPosts] = useState<FoodPost[]>([]);

  useEffect(() => {
    setPosts(mockApi.getPosts());
    setStats(mockApi.getStats());
  }, []);

  const chartData = [
    { name: 'Served', value: stats.totalMealsServed },
    { name: 'Active', value: stats.activeDonations * 20 }, // rough estimate of meals
    { name: 'Donors', value: stats.totalDonors * 10 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500">Monitoring platform health and community impact</p>
        </div>
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-bold border border-red-100">
          Admin Access
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
                <Tooltip />
                <Bar dataKey="value" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Recent Posts</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {posts.slice(0, 10).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-bold text-sm text-gray-900">{p.foodItems}</p>
                  <p className="text-xs text-gray-500">{p.providerName} • {p.district}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  p.status === PostStatus.AVAILABLE ? 'bg-green-100 text-green-700' : 
                  p.status === PostStatus.COLLECTED ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
