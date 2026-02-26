import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CreditCard,
  Smartphone,
  ShoppingCart,
  Zap,
  ArrowRight,
  Wifi,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { subDays, startOfMonth, format, isAfter, eachDayOfInterval, startOfDay, addDays } from 'date-fns';

interface PartnerOverviewProps {
  setActiveTab: (tab: string) => void;
}

interface Activation {
  _id: string;
  iccid: string;
  status: string;
  updatedAt: string;
  bucket_id: string;
  assigned_to_name?: string;
  // We might need to fetch package name separately or populate it, 
  // but for now we can infer or leave generic.
}

const PartnerOverview: React.FC<PartnerOverviewProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalTokens: 0,
    activeTokens: 0,
    availableTokens: 0
  });

  const [activations, setActivations] = useState<Activation[]>([]);
  const [usageData, setUsageData] = useState<Record<string, any>>({});
  const [usageFetched, setUsageFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get User ID from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const partnerId = user?.id;

        // 1. Fetch Inventory for Stats
        const inventoryRes = await axios.get(`${API_BASE}/inventory`, {
          params: { partner_id: partnerId }
        });

        if (inventoryRes.data.success) {
          const buckets: any[] = inventoryRes.data.buckets || [];
          const total = buckets.reduce((acc, b) => acc + (b.total_purchased || 0), 0);
          const active = buckets.reduce((acc, b) => acc + (b.assigned_count || 0), 0);
          const available = buckets.reduce((acc, b) => acc + (b.available_count || 0), 0);

          setStats({
            totalTokens: total,
            activeTokens: active,
            availableTokens: available
          });
        }

        // 2. Fetch Recent Activations
        const actRes = await axios.get(`${API_BASE}/partner/activations`, {
          params: { partner_id: partnerId }
        });

        if (actRes.data.success) {
          const acts = actRes.data.activations || [];
          setActivations(acts);

          // Fetch usage for active eSIMs
          const activeIccids = acts
            .filter((a: Activation) => a.status === 'Active')
            .map((a: Activation) => a.iccid);

          if (activeIccids.length > 0) {
            try {
              const usageRes = await axios.post(`${API_BASE}/esim/usage/batch`, { iccids: activeIccids });
              if (usageRes.data.success) {
                setUsageData(usageRes.data.usage);
              }
            } catch (usageErr) {
              console.error("Failed to fetch usage data", usageErr);
            } finally {
              setUsageFetched(true);
            }
          } else {
            setUsageFetched(true);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const [trendPeriod, setTrendPeriod] = useState<'7' | '30' | 'month'>('30');

  const { totalTokens, activeTokens, availableTokens } = stats;
  const usagePercentage = totalTokens > 0 ? (activeTokens / totalTokens) * 100 : 0;

  // Process Activation Trends Data
  const chartData = React.useMemo(() => {
    const end = new Date();
    let start = subDays(end, 7);
    if (trendPeriod === '30') start = subDays(end, 30);
    if (trendPeriod === 'month') start = startOfMonth(end);

    start = startOfDay(start);

    // Filter relevant activations
    const relevantActs = activations.filter((a: any) => isAfter(new Date(a.updatedAt || new Date()), start));

    const map = new Map<string, number>();
    for (const a of relevantActs) {
      const d = format(new Date(a.updatedAt || new Date()), 'MMM dd');
      map.set(d, (map.get(d) || 0) + 1);
    }

    const days = eachDayOfInterval({ start, end });
    return days.map(d => {
      const formatted = format(d, 'MMM dd');
      return {
        date: formatted,
        activations: map.get(formatted) || 0
      };
    });
  }, [activations, trendPeriod]);

  const currentPeriodTotal = chartData.reduce((sum, d) => sum + d.activations, 0);

  // Determine low data / expiring "Needs Attention" items
  const needsAttentionItems = React.useMemo(() => {
    const alerts: any[] = [];

    activations.filter(a => a.status === 'Active').forEach((a: any) => {
      const u = usageData[a.iccid];
      if (!u || !u.initial_data || !u.remaining_data) return;

      const parseVal = (str: string) => {
        if (!str) return 0;
        const num = parseFloat(str) || 0;
        if (str.toUpperCase().includes('GB')) return num * 1024;
        return num;
      };

      const initial = parseVal(u.initial_data);
      const remaining = parseVal(u.remaining_data);
      const pct = initial > 0 ? (remaining / initial) * 100 : 0;

      const packageName = (a.bucket_id as any)?.package_name || 'Global Data Plan';

      if (pct < 10) {
        alerts.push({
          iccid: a.iccid,
          type: 'low_data',
          name: a.assigned_to_name || 'Unknown',
          package: packageName,
          text: `Only ${pct.toFixed(0)}% data remaining (${u.remaining_data} left).`
        });
      }

      // Simple expiry heuristic: if updated > 28 days ago for a 30-day package
      if (packageName.includes('30 Days')) {
        const assignedDate = new Date(a.updatedAt || new Date());
        const daysSince = (new Date().getTime() - assignedDate.getTime()) / (1000 * 3600 * 24);
        if (daysSince > 28 && daysSince <= 30) {
          alerts.push({
            iccid: a.iccid,
            type: 'expiring',
            name: a.assigned_to_name || 'Unknown',
            package: packageName,
            text: `Expires in < 48 hours.`
          });
        }
      }
    });

    // Insert dummy alerts for demonstration if none exist natively, but ONLY for the demo partner
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    if (alerts.length === 0 && user?.email === 'partner@netvoya.com') {
      alerts.push({
        iccid: 'dummy-1',
        type: 'low_data',
        name: 'Sarah Jenkins',
        package: 'Europe 10GB Pack',
        text: 'Only 5% data remaining (500MB left).'
      });
      alerts.push({
        iccid: 'dummy-2',
        type: 'expiring',
        name: 'Michael Chen',
        package: 'Egypt 1GB',
        text: 'Expires in < 24 hours.'
      });
    }

    return alerts;
  }, [activations, usageData]);

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

      {/* Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Activation Trends */}
        <div className="lg:col-span-7 bg-[#171717] border border-white/5 rounded-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold text-white">Activation Trends</h3>
            <select
              value={trendPeriod}
              onChange={(e) => setTrendPeriod(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-lg py-1 px-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6">
              <div className="text-3xl font-display font-bold text-white mb-1">{currentPeriodTotal} Activations</div>
              <div className="flex items-center gap-1 text-sm text-green-400">
                <TrendingUp size={14} />
                <span>Steady growth</span>
              </div>
            </div>
            <div className="h-[200px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <RefreshCw className="animate-spin mb-2" size={20} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                      minTickGap={20}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="activations"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorActs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="lg:col-span-5 bg-[#171717] border border-white/5 rounded-xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <AlertTriangle size={120} />
          </div>
          <div className="p-6 border-b border-white/5 relative z-10">
            <h3 className="font-semibold text-white">Needs Attention</h3>
          </div>
          <div className="p-0 flex-1 relative z-10">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <RefreshCw className="animate-spin mx-auto mb-2" size={20} />
              </div>
            ) : needsAttentionItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500 h-full">
                <CheckCircle2 size={48} className="text-green-500/50 mb-4" />
                <p>All active eSIMs are healthy.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {needsAttentionItems.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <div className={`mt-1 p-2 rounded-lg ${item.type === 'low_data' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                        {item.type === 'low_data' ? <AlertTriangle size={16} /> : <Clock size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{item.name} - <span className="text-slate-400">{item.package}</span></div>
                        <div className="text-xs text-slate-500 mt-1">{item.text}</div>
                      </div>
                      <button
                        onClick={() => setActiveTab('esims')}
                        className="text-xs text-orange-500 hover:text-orange-400 font-medium whitespace-nowrap"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
                {needsAttentionItems.length > 4 && (
                  <div className="p-4 border-t border-white/5 text-right">
                    <button
                      onClick={() => setActiveTab('esims')}
                      className="text-orange-500 text-sm hover:text-orange-400 font-medium flex items-center justify-end gap-1 w-full"
                    >
                      View All Alerts <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PartnerOverview;