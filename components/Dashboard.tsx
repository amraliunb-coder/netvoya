import React, { useState } from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Users,
  Package,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  ShoppingCart
} from 'lucide-react';

// Admin Components
import Overview from './dashboard/Overview';
import ESIMManagement from './dashboard/ESIMManagement';
import PackagesView from './dashboard/Packages';
import SettingsView from './dashboard/Settings';

// Partner Components
import PartnerOverview from './dashboard/partner/PartnerOverview';
import PartnerESIMs from './dashboard/partner/PartnerESIMs';
import RequestInventory from './dashboard/partner/RequestInventory';

interface DashboardProps {
  onLogout: () => void;
  role: 'admin' | 'partner';
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, role }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define menu items based on role
  const adminMenuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'esim', label: 'eSIM Management', icon: <Smartphone size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    { id: 'packages', label: 'Packages', icon: <Package size={20} /> },
    { id: 'revenue', label: 'Revenue', icon: <DollarSign size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const partnerMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'my-esims', label: 'My eSIMs', icon: <Smartphone size={20} /> },
    { id: 'request', label: 'Request Inventory', icon: <ShoppingCart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : partnerMenuItems;

  const renderContent = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'overview': return <Overview setActiveTab={setActiveTab} />;
        case 'esim': return <ESIMManagement />;
        case 'packages': return <PackagesView />;
        case 'settings': return <SettingsView />;
        default: return <PlaceholderContent />;
      }
    } else {
      // Partner Views
      switch (activeTab) {
        case 'overview': return <PartnerOverview setActiveTab={setActiveTab} />;
        case 'my-esims': return <PartnerESIMs />;
        case 'request': return <RequestInventory />;
        case 'settings': return <SettingsView />;
        default: return <PlaceholderContent />;
      }
    }
  };

  const PlaceholderContent = () => (
    <div className="flex items-center justify-center h-[60vh] text-slate-500 flex-col gap-4">
      <div className="p-4 rounded-full bg-white/5">
        <Package size={40} className="opacity-50" />
      </div>
      <p>This module is currently under development.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white font-sans selection:bg-orange-500/30">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#171717] border-r border-white/5 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <img
            src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png"
            alt="NetVoya"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="p-4 space-y-1">
          <div className="text-xs font-mono uppercase text-slate-500 px-4 py-2 mb-2">
            {role === 'admin' ? 'Admin Console' : 'Partner Portal'}
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_#F97316]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-display font-semibold text-white capitalize">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#171717] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 w-64 transition-all"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 rounded-full border border-black"></span>
            </button>

            <div className="h-8 w-px bg-white/10 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-white">
                  {role === 'admin' ? 'Karim El Sharaany' : 'Partner Account'}
                </div>
                <div className="text-xs text-slate-500 capitalize">{role}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold">
                {role === 'admin' ? 'KS' : 'PA'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Dashboard;