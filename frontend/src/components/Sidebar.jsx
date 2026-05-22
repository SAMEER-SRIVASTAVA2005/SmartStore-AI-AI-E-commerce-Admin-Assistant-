import React from 'react';
import { api } from '../services/api';
import { LayoutDashboard, ShoppingBag, Sparkles, LogOut, Store, AlertTriangle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, storeName, onLogout, lowStockCount }) {
  const menuItems = [
    { id: 'dashboard', name: 'Sales Dashboard', icon: LayoutDashboard },
    { id: 'inventory', name: 'Product Catalog', icon: ShoppingBag, badge: lowStockCount > 0 ? lowStockCount : null },
    { id: 'aistudio', name: 'AI Copywriter', icon: Sparkles },
  ];

  const handleLogoutClick = () => {
    api.auth.logout();
    onLogout();
  };

  return (
    <aside className="w-80 h-screen fixed top-0 left-0 bg-[#0f1422] border-r border-gray-800 flex flex-col justify-between py-8 px-6 z-30">
      
      {/* Brand Header */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-md shadow-indigo-500/10">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
              {storeName || 'My SmartStore'}
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold">
              E-COMMERCE ADMIN
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 text-white border-l-2 border-cyan-400 shadow-lg shadow-indigo-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/40 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && (
                  <span className="flex items-center justify-center bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action Footer */}
      <div>
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 border border-transparent hover:border-red-500/10 group"
        >
          <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-transform group-hover:-translate-x-1" />
          <span>Exit SmartStore</span>
        </button>
      </div>
    </aside>
  );
}
