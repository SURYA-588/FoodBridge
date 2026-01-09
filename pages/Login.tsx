
import React, { useState } from 'react';
import { apiService } from '../services/api';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { user } = await apiService.login(email, password);
      onLogin(user);
    } catch (err) {
      setError('Invalid credentials or user not found. Please register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <span className="text-5xl font-black text-gray-900 tracking-tighter cursor-pointer" onClick={() => onNavigate('home')}>
              Food<span className="text-green-600">Bridge</span>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in for persistent access across devices</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6" id="login-form">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                id="email"
                name="username" 
                type="email" 
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all disabled:opacity-50"
                placeholder="you@organization.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                id="password"
                name="password"
                type="password" 
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
            >
              {isLoading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <button 
                onClick={() => onNavigate('register')}
                className="ml-1 font-bold text-green-600 hover:text-green-700"
              >
                Register here
              </button>
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

export default Login;
