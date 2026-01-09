
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { apiService } from './services/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseFood from './pages/BrowseFood';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [loading, setLoading] = useState(true);

  // Persistent Login: Check for authToken on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Validate token with simulated backend
          const user = await apiService.verifyToken(token);
          setCurrentUser(user);
          
          // Auto-navigate to dashboard if user is logged in and currently on a guest page
          setCurrentPage(prev => {
            if (prev === 'home' || prev === 'login' || prev === 'register') {
              return 'dashboard';
            }
            return prev;
          });
          
          console.log(`[Auth] Persistent session restored for: ${user.email}`);
        } catch (err) {
          console.warn("[Auth] Session invalid or expired. Clearing token.");
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
          <span className="text-green-700 font-bold text-xl tracking-tighter">FoodBridge</span>
          <p className="text-gray-400 text-sm mt-2 animate-pulse">Restoring your session...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Landing onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onLogin={handleLoginSuccess} onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onRegister={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
      case 'dashboard':
        if (!currentUser) { setCurrentPage('login'); return null; }
        if (currentUser.role === UserRole.ADMIN) return <AdminDashboard user={currentUser} />;
        return <Dashboard user={currentUser} onNavigate={setCurrentPage} />;
      case 'browse':
        if (!currentUser) { setCurrentPage('login'); return null; }
        return <BrowseFood user={currentUser} onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {currentPage !== 'login' && currentPage !== 'register' && (
        <Navbar 
          user={currentUser} 
          onNavigate={setCurrentPage} 
          onLogout={handleLogout} 
          currentPage={currentPage}
        />
      )}
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-2 md:space-y-0 text-gray-400">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a href="tel:7708794789" className="hover:text-green-400 transition-colors font-medium">7708794789</a>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <a href="mailto:suryasrivan@gmail.com" className="hover:text-green-400 transition-colors">suryasrivan@gmail.com</a>
            </div>
          </div>
          <div className="w-full border-t border-gray-700 my-4"></div>
          <p className="text-sm opacity-60 text-center">&copy; 2025 FoodBridge. Sharing Food, Sharing Hope.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
