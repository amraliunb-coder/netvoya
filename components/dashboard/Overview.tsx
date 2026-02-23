import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Users,
  CreditCard,
  Activity,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Inbox,
  ChevronDown
} from 'lucide-react';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

interface RecentOrder {
  id: string;
  client: string;
  plan: string;
  amount: string;
  status: string;
  date: string;
}

// Format a date string as a relative "time ago" label
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-green-400/10 text-green-400',
  Processing: 'bg-blue-400/10 text-blue-400',
  Pending: 'bg-yellow-400/10 text-yellow-400',
  Cancelled: 'bg-red-400/10 text-red-400',
};

const Overview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRecentOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get(`${API_BASE}/admin/recent-orders`);
      if (res.data.success) {
        setRecentOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch recent orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await axios.patch(`${API_BASE}/admin/orders/${orderId}/status`, { status: newStatus });
      // Update local state immediately
      setRecentOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const stats = [
    { label: "Active eSIMs", value: "1,248", change: "+12.5%", trend: "up", icon: <Smartphone className="text-orange-500" size={24} /> },
    { label: "Total Revenue", value: "$48,290", change: "+8.2%", trend: "up", icon: <CreditCard className="text-orange-500" size={24} /> },
    { label: "Active Clients", value: "356", change: "+4.1%", trend: "up", icon: <Users className="text-orange-500" size={24} /> },
    { label: "Data Usage", value: "8.4 TB", change: "-2.3%", trend: "down", icon: <Activity className="text-orange-500" size={24} /> },
  ];

  return (
    <div className="space-y-8 animate-in-view">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm">Welcome back, here's what's happening today.</p>
        </div>
        <button
          onClick={() => setActiveTab('esim')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
        >
          <Plus size={18} />
          Issue New eSIM
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#171717] border border-white/5 rounded-xl p-6 hover:border-orange-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                {stat.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Revenue Chart Area */}
        <div className="lg:col-span-2 bg-[#171717] border border-white/5 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white">Revenue Analytics</h3>
            <select className="bg-black/30 border border-white/10 rounded-lg text-xs text-slate-400 px-3 py-1 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Mock Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-4 pb-2">
            {[65, 45, 75, 50, 85, 60, 90].map((h, i) => (
              <div key={i} className="w-full bg-white/5 rounded-t-lg relative group h-full flex flex-col justify-end hover:bg-white/10 transition-colors">
                <div
                  className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500 group-hover:from-orange-500 group-hover:to-orange-300"
                  style={{ height: `${h}%` }}
                ></div>
                <div className="text-center mt-2 text-xs text-slate-500 font-mono">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-[#171717] border border-white/5 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Top Destinations</h3>
          <div className="space-y-6">
            {[
              { country: "United States", volume: "32%", flag: "🇺🇸" },
              { country: "Japan", volume: "18%", flag: "🇯🇵" },
              { country: "France", volume: "15%", flag: "🇫🇷" },
              { country: "Thailand", volume: "12%", flag: "🇹🇭" },
              { country: "United Kingdom", volume: "8%", flag: "🇬🇧" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white font-medium">{item.country}</span>
                    <span className="text-slate-400">{item.volume}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: item.volume }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-white">Recent Transactions</h3>
          <button
            onClick={fetchRecentOrders}
            className="flex items-center gap-2 text-orange-500 text-sm hover:text-orange-400 transition-colors"
          >
            <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400 font-mono uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingOrders ? (
                // Loading skeleton rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-20" /></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <Inbox size={32} className="text-slate-600" />
                      <span>No transactions yet. Orders from partners will appear here.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-300 text-xs">{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-white">{order.client}</td>
                    <td className="px-6 py-4 text-slate-400">{order.plan}</td>
                    <td className="px-6 py-4 text-white font-medium">{order.amount}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`appearance-none cursor-pointer inline-flex items-center pl-2.5 pr-7 py-0.5 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all ${STATUS_STYLES[order.status] || 'bg-slate-400/10 text-slate-400'} ${updatingId === order.id ? 'opacity-50' : ''}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{timeAgo(order.date)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;