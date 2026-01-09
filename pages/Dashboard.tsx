
import React, { useState, useEffect } from 'react';
import { User, FoodPost, UserRole, FoodType, PostStatus } from '../types';
import { apiService } from '../services/api';
import { geminiService } from '../services/gemini';
import FoodCard from '../components/FoodCard';
import { DISTRICTS } from '../constants';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({ totalMealsServed: 0, activeDonations: 0, totalDonors: 0, activeNGOs: 0 });
  const [aiInsight, setAiInsight] = useState('Loading insights...');
  const [newPost, setNewPost] = useState({
    foodItems: '',
    type: FoodType.VEG,
    quantity: 10,
    district: user.district || DISTRICTS[0],
    location: '',
    expiryTime: '',
    contactNumber: user.phone || ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const allPosts = await apiService.getAllFood();
    const currentStats = await apiService.getStats();
    
    if (user.role === UserRole.PROVIDER) {
      setPosts(allPosts.filter(p => p.providerId === user.id));
    } else {
      setPosts(allPosts.filter(p => p.ngoId === user.id));
    }
    setStats(currentStats);
    loadImpactInsight(currentStats);
  };

  const loadImpactInsight = async (s: any) => {
    const insight = await geminiService.generateImpactInsight(s.totalMealsServed, s.totalMealsServed * 0.4);
    setAiInsight(insight);
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.createPost({
      ...newPost,
      providerId: user.id,
      providerName: user.organization || user.name,
    });
    setShowAddModal(false);
    refreshData();
    // Reset form
    setNewPost({
      foodItems: '',
      type: FoodType.VEG,
      quantity: 10,
      district: user.district || DISTRICTS[0],
      location: '',
      expiryTime: '',
      contactNumber: user.phone || ''
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      await apiService.deletePost(postId);
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome & Impact Bar */}
      <div className="mb-10 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Hello, {user.name.split(' ')[0]}!</h1>
            <p className="text-green-50 text-lg opacity-90 max-w-2xl italic">
              " {aiInsight} "
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-bold">{stats.totalMealsServed}</div>
              <div className="text-xs uppercase tracking-wider opacity-75">Meals Served</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-bold">{stats.totalDonors}</div>
              <div className="text-xs uppercase tracking-wider opacity-75">Partners</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {user.role === UserRole.PROVIDER ? 'Your Active Donations' : 'Your Collection History'}
        </h2>
        {user.role === UserRole.PROVIDER && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-md transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Post Surplus Food
          </button>
        )}
        {user.role === UserRole.NGO && (
          <button 
            onClick={() => onNavigate('browse')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all"
          >
            Browse Food to Collect
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl text-gray-500 mb-6">No {user.role === UserRole.PROVIDER ? 'active posts' : 'collections'} found.</p>
          {user.role === UserRole.PROVIDER && (
             <button onClick={() => setShowAddModal(true)} className="text-green-600 font-bold border-b-2 border-green-600 pb-1">Create your first post</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <FoodCard 
              key={post.id} 
              post={post} 
              role={user.role} 
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Post Surplus Food</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleAddPost} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Items</label>
                  <input required value={newPost.foodItems} onChange={e => setNewPost({...newPost, foodItems: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Rice, Vegetable Curry, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newPost.type} onChange={e => setNewPost({...newPost, type: e.target.value as FoodType})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                    <option value={FoodType.VEG}>Veg</option>
                    <option value={FoodType.NON_VEG}>Non-Veg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Persons)</label>
                  <input type="number" required value={newPost.quantity} onChange={e => setNewPost({...newPost, quantity: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select value={newPost.district} onChange={e => setNewPost({...newPost, district: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Available Till</label>
                   <input type="datetime-local" required value={newPost.expiryTime} onChange={e => setNewPost({...newPost, expiryTime: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                  <textarea rows={2} required value={newPost.location} onChange={e => setNewPost({...newPost, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Detailed address for pickup..."></textarea>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg">Confirm Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
