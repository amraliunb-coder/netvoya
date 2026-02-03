import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CreditCard,
  Smartphone,
  ShoppingCart,
  Zap,
  ArrowRight,
  Wifi,
  RefreshCw
} from 'lucide-react';

interface PartnerOverviewProps {
  setActiveTab: (tab: string) => void;
}

interface Activation {
  _id: string;
  iccid: string;
  status: string;
  updatedAt: string;
  bucket_id: string;
  // We might need to fetch package name separately or populate it, 
  // but for now we can infer or leave generic.
}

const PartnerOverview: React.FC<PartnerOverviewProps> = ({ setActiveTab }) => {
  const totalTokens = 5000;
  const activeTokens = 1240;
  const availableTokens = totalTokens - activeTokens;
  const usagePercentage = (activeTokens / totalTokens) * 100;

  const [activations, setActivations] = useState<Activation[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchActivations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/partner/activations`);
        if (res.data.success) {
          setActivations(res.data.activations);
        }
      } catch (err) {
        console.error("Failed to load activations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivations();
  }, []);

  return (
    <div className="space-y-8 animate-in-view">

      {/* Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Partner Dashboard</h2>
          <p className="text-slate-500 text-sm">Monitor your eSIM inventory and consumption.</p>
        </div>
        <button
          onClick={() => setActiveTab('request')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
        >
          <ShoppingCart size={18} />
          Purchase Tokens
        </button>
      </div>

      {/* Main Token Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#171717] to-black border border-white/5 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CreditCard size={120} />
          </div>

          <h3 className="text-slate-400 font-medium mb-1 flex items-center gap-2">
            <CreditCard size={16} /> Total Token Balance
          </h3>
          <div className="text-5xl font-display font-bold text-white mb-8">{totalTokens.toLocaleString()}</div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-orange-500">{activeTokens.toLocaleString()} Active</span>
              <span className="text-slate-500">{(availableTokens).toLocaleString()} Available</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-[#171717] border border-white/5 rounded-xl p-6 flex items-center justify-between group hover:border-orange-500/20 transition-colors">
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Active eSIMs</div>
              <div className="text-2xl font-bold text-white">{activeTokens}</div>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
              <Wifi size={24} />
            </div>
          </div>

          <div className="bg-[#171717] border border-white/5 rounded-xl p-6 flex items-center justify-between group hover:border-orange-500/20 transition-colors">
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Available to Issue</div>
              <div className="text-2xl font-bold text-white">{availableTokens}</div>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
              <Smartphone size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-white">Recent Activations</h3>
          <button
            onClick={() => setActiveTab('my-esims')}
            className="text-orange-500 text-sm hover:text-orange-400 flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              <RefreshCw className="animate-spin mx-auto mb-2" size={20} />
              Loading...
            </div>
          ) : activations.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No recent activations found.</div>
          ) : (
            activations.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-slate-400'}`}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Global Data Plan</div>
                    <div className="text-slate-500 text-xs font-mono">ID: {item.iccid}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium text-sm ${item.status === 'Active' ? 'text-green-400' : 'text-blue-400'}`}>
                    {item.status}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default PartnerOverview;