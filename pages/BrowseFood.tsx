
import React, { useState, useEffect } from 'react';
import { User, FoodPost, PostStatus, FoodType } from '../types';
import { mockApi } from '../services/mockApi';
import { geminiService } from '../services/gemini';
import FoodCard from '../components/FoodCard';
import { DISTRICTS } from '../constants';

interface BrowseProps {
  user: User;
  onNavigate: (page: string) => void;
}

const BrowseFood: React.FC<BrowseProps> = ({ user, onNavigate }) => {
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterType, setFilterType] = useState<FoodType | ''>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    loadData();
  }, [filterDistrict, filterType]);

  const loadData = () => {
    const data = mockApi.getPosts({ 
      district: filterDistrict || undefined, 
      type: filterType || undefined,
      status: PostStatus.AVAILABLE 
    });
    setPosts(data);
  };

  const getAiRecommendations = async () => {
    setLoadingAi(true);
    const postSummary = posts.map(p => `${p.foodItems} (${p.quantity} ppl) at ${p.district}, expires ${p.expiryTime}`).join('; ');
    const result = await geminiService.suggestCollectionPriority(postSummary);
    setRecommendations(result || '');
    setLoadingAi(false);
  };

  const handleCollect = (postId: string) => {
    if (window.confirm('Do you want to confirm collection of this batch?')) {
      mockApi.collectPost(postId, user.id, user.organization || user.name);
      loadData();
      alert('Success! Please coordinate with the provider immediately.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Food Near You</h1>
        <p className="text-gray-600 italic">Browse available surplus food batches and collect to distribute.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">District</label>
          <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500">
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Food Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value as FoodType)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Any Type</option>
            <option value={FoodType.VEG}>Veg Only</option>
            <option value={FoodType.NON_VEG}>Non-Veg Only</option>
          </select>
        </div>
        <button onClick={() => { setFilterDistrict(''); setFilterType(''); }} className="px-6 py-2.5 text-gray-500 font-bold hover:text-green-600 transition-colors">
          Clear
        </button>
      </div>

      {/* AI Logistical Advisor */}
      {posts.length > 2 && (
        <div className="mb-8 bg-green-50 border border-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🧠</span>
              <h3 className="text-lg font-bold text-green-800">AI Logistical Advisor</h3>
            </div>
            {!recommendations && (
              <button 
                onClick={getAiRecommendations} 
                disabled={loadingAi}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50"
              >
                {loadingAi ? 'Calculating...' : 'Get Best Route Recommendation'}
              </button>
            )}
          </div>
          {recommendations && (
            <div className="prose prose-green max-w-none text-green-700 whitespace-pre-line">
              {recommendations}
            </div>
          )}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No batches available right now</h3>
          <p className="text-gray-500">Try changing filters or checking back in an hour.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <FoodCard 
              key={post.id} 
              post={post} 
              role={user.role} 
              onAction={handleCollect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseFood;
