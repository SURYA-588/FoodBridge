
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ICONS, COLORS } from '../constants';

interface NavbarProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, currentPage }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              Food<span className="text-green-600">Bridge</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Authenticated Links */}
            {user && (
              <>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === 'dashboard' ? 'text-green-700 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ICONS.Home className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                
                {user.role === UserRole.NGO && (
                  <button 
                    onClick={() => onNavigate('browse')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === 'browse' ? 'text-green-700 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <ICONS.Plus className="w-5 h-5 mr-1" />
                    <span className="hidden sm:inline">Browse Food</span>
                  </button>
                )}
                <div className="border-l border-gray-200 h-6 mx-1"></div>
              </>
            )}

            {/* Always visible About Us */}
            <button 
              onClick={() => setShowAboutModal(true)}
              className="text-gray-500 hover:text-green-600 text-sm font-semibold px-3 py-2 rounded-md hover:bg-green-50 transition-colors"
            >
              About Us
            </button>

            {/* Guest Action: Sign In */}
            {!user && (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-green-600 text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-green-700 transition-all shadow-md active:scale-95"
              >
                Sign In
              </button>
            )}

            {/* Authenticated User Profile / Logout */}
            {user && (
              <div className="flex items-center ml-2">
                <div className="flex flex-col items-end mr-3 hidden md:flex">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{user.role}</span>
                  <span className="text-sm font-bold text-gray-900 leading-tight">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Sign Out"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="flex justify-center mb-6">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">
                Food<span className="text-green-600">Bridge</span>
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">About FoodBridge</h3>
            <p className="text-gray-600 leading-relaxed text-center text-lg">
              FoodBridge is a social impact platform that connects hotels, marriage halls, and event organizers with NGOs to reduce food waste and fight hunger.
            </p>
            <p className="text-gray-600 leading-relaxed text-center text-lg mt-4">
              It enables food providers to post surplus food details in real time, while NGOs can search district-wise, verify availability, and collect food efficiently.
            </p>
            <p className="text-gray-600 leading-relaxed text-center text-lg mt-4 font-medium text-green-700">
              By using technology to bridge the gap between excess food and people in need, FoodBridge promotes food safety, sustainability, and community service.
            </p>
            
            <button 
              onClick={() => setShowAboutModal(false)}
              className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
