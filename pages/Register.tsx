
import React, { useState } from 'react';
// Fix: DISTRICTS is defined in constants.tsx, not types.ts
import { UserRole } from '../types';
import { DISTRICTS } from '../constants';
import { mockApi } from '../services/mockApi';

interface RegisterProps {
  onRegister: () => void;
  onNavigate: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.PROVIDER,
    organization: '',
    phone: '',
    district: DISTRICTS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.register(formData);
    onRegister();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-3 text-gray-600 text-lg">Choose your role and start your journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-5">
          <div className="md:col-span-2 bg-green-700 p-10 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Why Join Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Zero registration fees</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Automated logistics matching</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Impact certificates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-300">✓</span>
                <span>Community support network</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.PROVIDER})}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all font-bold text-sm ${formData.role === UserRole.PROVIDER ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                >
                  I'm a Provider
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.NGO})}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all font-bold text-sm ${formData.role === UserRole.NGO ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                >
                  I'm an NGO
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input required value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Hotel Hyatt / Helping Hands NGO" />
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-4">
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already a member? <button onClick={() => onNavigate('login')} className="text-green-600 font-bold hover:underline">Log In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
