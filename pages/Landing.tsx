
import React from 'react';
import { COLORS } from '../constants';

interface LandingProps {
  onNavigate: (page: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-24 px-4 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="mb-8 md:mb-12">
             <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                Food<span className="text-green-400">Bridge</span>
              </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Feed the Hungry, <br/><span className="text-orange-400">Not the Landfill.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-green-100 max-w-2xl leading-relaxed">
            Join FoodBridge. We bridge the gap between hotels with surplus food and NGOs serving the community.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => onNavigate('register')}
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/50 text-white rounded-full text-lg font-bold backdrop-blur-sm transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* About Description Section - HIGHLIGHTED */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-green-50 border-2 border-green-100 rounded-[2.5rem] p-10 md:p-16 shadow-sm relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-md">
              Our Mission
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What is FoodBridge?</h2>
              <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-medium">
                <p>
                  FoodBridge is a social impact platform that connects hotels, marriage halls, and event organizers with NGOs to reduce food waste and fight hunger.
                </p>
                <p>
                  It enables food providers to post surplus food details in real time, while NGOs can search district-wise, verify availability, and collect food efficiently.
                </p>
                <p className="text-green-700 font-bold">
                  By using technology to bridge the gap between excess food and people in need, FoodBridge promotes food safety, sustainability, and community service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="text-center group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:rotate-12 group-hover:scale-110">
              <span className="text-3xl">🏨</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">For Food Providers</h3>
            <p className="text-gray-600">List your surplus food in seconds. Let local NGOs handle the logistics while you reduce waste.</p>
          </div>
          <div className="text-center group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:-rotate-12 group-hover:scale-110">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">For NGOs</h3>
            <p className="text-gray-600">Discover fresh, high-quality food nearby. Filter by district and quantity to serve your community efficiently.</p>
          </div>
          <div className="text-center group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:rotate-12 group-hover:scale-110">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time Tracking</h3>
            <p className="text-gray-600">Automated expiry alerts and collection tracking ensures no food goes to waste.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section - IMPROVED HIGHLIGHT */}
      <section className="py-24 px-4 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-10 text-white">Ready to make a difference?</h2>
          <div className="p-12 bg-white rounded-[3rem] shadow-2xl flex flex-col items-center border-4 border-green-500/20">
            <div className="flex items-center space-x-2 mb-10">
              <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i*25}/96/96`} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="user" />
                ))}
              </div>
              <p className="text-gray-500 font-extrabold ml-6 text-lg uppercase tracking-tight">Join 500+ contributors</p>
            </div>
            <button 
               onClick={() => onNavigate('register')}
               className="bg-green-600 text-white px-20 py-6 rounded-2xl text-2xl font-black hover:bg-green-700 transition-all shadow-xl active:scale-95 transform hover:-translate-y-1"
            >
              Register Your Organization
            </button>
            <p className="mt-6 text-gray-400 font-medium">It only takes 2 minutes to get started</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
