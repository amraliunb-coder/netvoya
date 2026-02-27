import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    RefreshCw,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Inbox,
    Download,
    Calendar
} from 'lucide-react';

interface RevenueStats {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
}

interface RevenueOrder {
    id: string;
    client: string;
    plan: string;
    amount: number;
    cost: number;
    profit: number;
    date: string;
}

const RevenueView: React.FC = () => {
    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

    const [stats, setStats] = useState<RevenueStats>({ totalRevenue: 0, totalCost: 0, totalProfit: 0 });
    const [orders, setOrders] = useState<RevenueOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [partners, setPartners] = useState<{ id: string, name: string }[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    // Fetch unique partners for the filter dropdown
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await axios.get(`${API_BASE}/admin/users`);
                if (res.data.success) {
                    const fetchedPartners = res.data.users
                        .filter((u: any) => u.role === 'partner')
                        .map((u: any) => ({
                            id: u.id,
                            name: u.companyName || u.firstName || 'Unknown Partner'
                        }));
                    setPartners(fetchedPartners);
                }
            } catch (err) {
                console.error('Failed to fetch partners:', err);
            }
        };
        fetchPartners();
    }, []);

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API_BASE}/admin/revenue`, {
                params: { partner_id: selectedPartner }
            });

            if (res.data.success) {
                setStats(res.data.stats);
                setOrders(res.data.orders);
            }
        } catch (err: any) {
            console.error('Failed to fetch revenue data:', err);
            setError('Failed to fetch revenue analytics. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [selectedPartner]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateStr));
    };

    const filteredOrders = orders.filter(order => {
        if (dateFilter === 'all') return true;

        const orderDate = new Date(order.date);
        const today = new Date();

        if (dateFilter === 'today') {
            return orderDate.toDateString() === today.toDateString();
        }
        if (dateFilter === '7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return orderDate >= sevenDaysAgo;
        }
        if (dateFilter === '30days') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
        }
        if (dateFilter === 'thismonth') {
            return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
        }
        if (dateFilter === 'lastmonth') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
            return orderDate >= lastMonth && orderDate <= endOfLastMonth;
        }
        return true;
    });

    const filteredStats = {
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.amount, 0),
        totalCost: filteredOrders.reduce((sum, order) => sum + order.cost, 0),
        totalProfit: filteredOrders.reduce((sum, order) => sum + order.profit, 0)
    };

    const handleExportCsv = () => {
        if (filteredOrders.length === 0) return;

        const headers = ['Date', 'Partner', 'Package(s)', 'Retail Revenue', 'Actual Wholesale Cost', 'Net Profit'];
        const csvRows = filteredOrders.map(order => [
            new Date(order.date).toLocaleDateString(),
            `"${order.client.replace(/"/g, '""')}"`,
            `"${order.plan.replace(/"/g, '""')}"`,
            order.amount.toFixed(2),
            order.cost.toFixed(2),
            order.profit.toFixed(2)
        ].join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `netvoya_revenue_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in-view">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">Revenue Analytics</h2>
                    <p className="text-slate-500 text-sm">Track actual confirmed net profit and costs in real-time.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                            value={selectedPartner}
                            onChange={(e) => setSelectedPartner(e.target.value)}
                            className="bg-[#171717] border border-white/10 rounded-lg text-sm text-white pl-9 pr-8 py-2 focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <option value="all">All Partners</option>
                            {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-[#171717] border border-white/10 rounded-lg text-sm text-white pl-9 pr-8 py-2 focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="thismonth">This Month</option>
                            <option value="lastmonth">Last Month</option>
                        </select>
                    </div>
                    <button
                        onClick={handleExportCsv}
                        disabled={filteredOrders.length === 0}
                        className="p-2 bg-[#171717] border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-orange-500/50 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm pr-3"
                    >
                        <Download size={16} /> <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button
                        onClick={fetchRevenueData}
                        disabled={loading}
                        className="p-2 bg-[#171717] border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-orange-500" : ""} />
                    </button>
                </div>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center">
                    {error}
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <DollarSign size={64} className="text-white" />
                            </div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-white/5 rounded-lg text-slate-300">
                                    <CreditCard size={20} />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl font-display font-bold text-white mb-1">
                                    {formatCurrency(filteredStats.totalRevenue)}
                                </div>
                                <div className="text-slate-500 text-sm">Total Retail Revenue</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ArrowDownRight size={64} className="text-red-500" />
                            </div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                    <ArrowDownRight size={20} />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl font-display font-bold text-red-100 mb-1">
                                    {formatCurrency(filteredStats.totalCost)}
                                </div>
                                <div className="text-red-500/60 text-sm">Actual Wholesale Cost</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#171717] border border-orange-500/20 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={64} className="text-orange-500" />
                            </div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500 border border-orange-500/30">
                                    <TrendingUp size={20} />
                                </div>
                                <div className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs font-medium rounded-full border border-orange-500/30">
                                    Net Profit
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-4xl font-display font-bold text-orange-500 mb-1 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                                    {formatCurrency(filteredStats.totalProfit)}
                                </div>
                                <div className="text-orange-200/60 text-sm">Realized Margin</div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden mt-8">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-white">Confirmed Transactions</h3>
                                <p className="text-xs text-slate-500 mt-1">Detailed breakdown of all completed inventory requests.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-[#1a1a1a] text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Partner</th>
                                        <th className="px-6 py-4 font-medium">Package(s)</th>
                                        <th className="px-6 py-4 font-medium text-right">Retail Revenue</th>
                                        <th className="px-6 py-4 font-medium text-right text-red-500/70">Cost</th>
                                        <th className="px-6 py-4 font-medium text-right text-orange-500/80">Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                                <RefreshCw className="animate-spin mx-auto mb-2 text-orange-500" size={24} />
                                                Generating Analytics...
                                            </td>
                                        </tr>
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-500">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                        <Inbox size={24} className="text-slate-400" />
                                                    </div>
                                                    <span>No confirmed transactions found for this filter.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 text-slate-400 text-xs">
                                                    {formatDate(order.date)}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-white text-sm">
                                                    {order.client}
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">
                                                    {order.plan}
                                                </td>
                                                <td className="px-6 py-4 text-slate-300 font-medium text-right font-mono">
                                                    {formatCurrency(order.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-red-400/80 text-right font-mono text-sm">
                                                    -{formatCurrency(order.cost)}
                                                </td>
                                                <td className="px-6 py-4 text-orange-400 font-bold text-right font-mono outline-none group-hover:text-orange-500 transition-colors">
                                                    +{formatCurrency(order.profit)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RevenueView;
