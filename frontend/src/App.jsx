import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AIStudio from './pages/AIStudio';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lowStockCount, setLowStockCount] = useState(0);

  // Check for active login session on mount
  useEffect(() => {
    const loggedInUser = api.auth.getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const fetchLowStockCount = async () => {
    if (!user) return;
    try {
      const res = await api.products.getLowStockAlerts();
      if (res.success) {
        setLowStockCount(res.count);
      }
    } catch (err) {
      console.error('Failed to update stock alert indicators:', err);
    }
  };

  useEffect(() => {
    fetchLowStockCount();
  }, [user]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setLowStockCount(0);
  };

  // Render view depending on active sidebar tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard triggerRefreshLowStock={fetchLowStockCount} />;
      case 'inventory':
        return <Inventory triggerRefreshLowStock={fetchLowStockCount} />;
      case 'aistudio':
        return <AIStudio triggerRefreshLowStock={fetchLowStockCount} />;
      default:
        return <Dashboard triggerRefreshLowStock={fetchLowStockCount} />;
    }
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      {/* Sidebar - fixed width */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeName={user.storeName}
        onLogout={handleLogout}
        lowStockCount={lowStockCount}
      />

      {/* Main Content Pane */}
      <main className="flex-1 pl-80 min-h-screen py-10 px-8 text-[#e2e8f0]">
        
        {/* Soft background drift glowing circles */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/[0.02] rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
