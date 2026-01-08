import React from 'react';
import { FoodPost, FoodType, PostStatus, UserRole } from '../types';

interface FoodCardProps {
  post: FoodPost;
  role?: UserRole;
  onAction?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ post, role, onAction, onDelete }) => {
  const isExpired = new Date(post.expiryTime) < new Date();
  
  const timeRemaining = () => {
    const diff = new Date(post.expiryTime).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  // Helper to sanitize the phone number for the tel: URI
  const getDialerUri = (phone: string) => {
    if (!phone) return '#';
    return `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            post.type === FoodType.VEG ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {post.type}
          </span>
          <span className={`text-xs font-bold uppercase ${
            post.status === PostStatus.AVAILABLE ? 'text-green-600' : 
            post.status === PostStatus.COLLECTED ? 'text-blue-600' : 'text-red-500'
          }`}>
            ● {post.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{post.foodItems}</h3>
        <p className="text-sm font-medium text-gray-500 mb-4">{post.providerName}</p>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Feeds {post.quantity} people
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {post.district}
          </div>
          <div className={`flex items-center font-semibold ${isExpired ? 'text-red-500' : 'text-orange-600'}`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {post.status === PostStatus.AVAILABLE ? timeRemaining() : post.status === PostStatus.COLLECTED ? `Collected by ${post.ngoName}` : 'Expired'}
          </div>
          
          {/* Direct Call Feature */}
          {(role === UserRole.NGO || post.status === PostStatus.COLLECTED) && post.contactNumber && (
            <div className="pt-2">
              <a 
                href={getDialerUri(post.contactNumber)}
                className="flex items-center text-green-700 font-bold hover:text-green-800 transition-all group bg-green-50 px-3 py-2 rounded-lg border border-green-100 hover:border-green-300"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {post.contactNumber}
                <span className="ml-auto text-[10px] uppercase font-bold text-green-600">Call Now</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        {role === UserRole.NGO && post.status === PostStatus.AVAILABLE && !isExpired && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAction?.(post.id);
            }}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-sm active:scale-95"
          >
            Claim Collection
          </button>
        )}

        {role === UserRole.PROVIDER && post.status === PostStatus.AVAILABLE && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDelete?.(post.id);
            }}
            className="w-full bg-white border-2 border-red-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
          >
            Remove Post
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;