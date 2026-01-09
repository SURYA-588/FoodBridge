
import React, { useState } from 'react';
import { UserRole } from '../types';
import { DISTRICTS } from '../constants';
import { apiService } from '../services/api';

interface RegisterProps {
  onRegister: () => void;
  onNavigate: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.PROVIDER,
    organization: '',
    phone: '',
    district: DISTRICTS[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiService.register(formData);
      alert('Registration successful! You are now logged in.');
      onRegister(); // Redirect to login or home as per flow
    } catch (err) {
      alert('Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Join FoodBridge</h2>
          <p className="mt-3 text-gray-600 text-lg">One account, access from any device.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-5 border border-gray-100">
          <div className="md:col-span-2 bg-green-700 p-10 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Partner Perks</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Secure 30-day login session</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Global food availability sync</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Instant logistics alerts</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 p-10">
            <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
              <div className="flex space-x-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.PROVIDER})}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all font-bold text-sm ${formData.role === UserRole.PROVIDER ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                >
                  Provider
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.NGO})}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all font-bold text-sm ${formData.role === UserRole.NGO ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                >
                  NGO
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input id="name" name="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500" placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="email" name="email" required type="email" autoComplete="username" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500" placeholder="john@example.com" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input id="password" name="password" required type="password" autoComplete="new-password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input id="phone" name="phone" required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500" placeholder="9876543210" />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select id="district" name="district" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500">
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-4 active:scale-95 disabled:bg-gray-400">
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already a member? <button onClick={() => onNavigate('login')} className="text-green-600 font-bold hover:underline">Log In</button>
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="mt-8 flex items-center justify-center w-full text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Register;
