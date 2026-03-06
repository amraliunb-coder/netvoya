import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Building2,
    Mail,
    MapPin,
    Globe,
    Package,
    DollarSign,
    Wifi,
    WifiOff,
    Key,
    AlertCircle,
    RefreshCw,
    Search,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    Layers,
    ShieldCheck,
    ExternalLink,
    X,
    Receipt,
} from 'lucide-react';

interface ClientInventory {
    total: number;
    assigned: number;
    available: number;
    packageCount: number;
}

interface ClientRevenue {
    total: number;
    orderCount: number;
    lastOrderAt: string | null;
}

interface Order {
    _id: string;
    createdAt: string;
    totalTokens: number;
    totalAmount: number;
    status: string;
}

interface Client {
    _id: string;
    companyName: string;
    contactName: string;
    email: string;
    country: string;
    city: string;
    joinedAt: string;
    hasApiKey: boolean;
    webhookUrl: string | null;
    inventory: ClientInventory;
    revenue: ClientRevenue;
    status: 'Active' | 'Inactive';
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

// Compact stat pill
const StatPill: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-slate-300' }) => (
    <div className="flex flex-col items-center px-3 py-2 bg-white/5 rounded-lg min-w-[70px]">
        <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{label}</span>
    </div>
);

// Avatar
const Avatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() || '')
        .join('');
    const colors = [
        'from-orange-500 to-rose-600',
        'from-blue-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-violet-500 to-purple-600',
        'from-amber-500 to-orange-600',
    ];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {initials || '?'}
        </div>
    );
};

const Clients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [viewingOrdersFor, setViewingOrdersFor] = useState<{ id: string, name: string } | null>(null);
    const [clientOrders, setClientOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API_BASE}/admin/clients`);
            setClients(res.data.clients || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Failed to load clients.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClients(); }, []);

    const fetchClientOrders = async (clientId: string, clientName: string) => {
        try {
            setViewingOrdersFor({ id: clientId, name: clientName });
            setLoadingOrders(true);
            const res = await axios.get(`${API_BASE}/admin/clients/${clientId}/orders`);
            setClientOrders(res.data.orders || []);
        } catch (err: any) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Derived stats
    const totalRevenue = clients.reduce((s, c) => s + c.revenue.total, 0);
    const totalEsims = clients.reduce((s, c) => s + c.inventory.total, 0);
    const activeCount = clients.filter(c => c.status === 'Active').length;

    // Filter
    const filtered = clients
        .filter(c => {
            const q = search.toLowerCase();
            const matchSearch = !q || c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchSearch && matchStatus;
        });

    const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const fmtCurrency = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                        Clients <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-widest font-mono align-middle">CRM</span>
                    </h2>
                    <p className="text-slate-500 text-sm">All registered partner accounts with live inventory & revenue data.</p>
                </div>
                <button
                    onClick={fetchClients}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        icon: <Users size={20} />,
                        label: 'Total Partners',
                        value: clients.length,
                        sub: `${activeCount} active`,
                        color: 'text-blue-400',
                        bg: 'bg-blue-500/10 border-blue-500/20',
                    },
                    {
                        icon: <DollarSign size={20} />,
                        label: 'Total Revenue',
                        value: fmtCurrency(totalRevenue),
                        sub: 'Across all partners',
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-500/10 border-emerald-500/20',
                    },
                    {
                        icon: <Layers size={20} />,
                        label: 'eSIMs Issued',
                        value: totalEsims.toLocaleString(),
                        sub: `${clients.reduce((s, c) => s + c.inventory.assigned, 0)} assigned`,
                        color: 'text-orange-400',
                        bg: 'bg-orange-500/10 border-orange-500/20',
                    },
                ].map((card) => (
                    <div key={card.label} className={`rounded-2xl border p-5 flex items-center gap-4 ${card.bg}`}>
                        <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>{card.icon}</div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{card.label}</p>
                            <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by company, email, or country..."
                        className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 shrink-0">
                    {(['all', 'Active', 'Inactive'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
                    <AlertCircle size={18} />
                    <p className="text-sm">{error}</p>
                    <button onClick={fetchClients} className="ml-auto text-xs underline">Retry</button>
                </div>
            )}

            {/* Client Cards */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                    <RefreshCw size={28} className="animate-spin text-orange-500" />
                    <p className="text-sm">Loading partner data...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                    <Users size={36} className="opacity-30" />
                    <p className="text-sm">No clients found{search ? ` matching "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Sort bar */}
                    {/* Sort bar hidden but we keep the row layout */}
                    <div className="flex items-center justify-end px-4 pb-2 border-b border-white/5">
                        <span className="text-xs text-slate-600">{filtered.length} partner{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    {filtered.map((client) => {
                        const isExpanded = expandedId === client._id;
                        const utilizationPct = client.inventory.total > 0
                            ? Math.round((client.inventory.assigned / client.inventory.total) * 100)
                            : 0;

                        return (
                            <div
                                key={client._id}
                                className="bg-[#171717] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
                            >
                                {/* Main Row */}
                                <button
                                    className="w-full text-left p-5 flex flex-wrap lg:flex-nowrap items-center gap-4"
                                    onClick={() => setExpandedId(isExpanded ? null : client._id)}
                                >
                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-3 min-w-[220px]">
                                        <Avatar name={client.companyName} />
                                        <div>
                                            <p className="text-sm font-semibold text-white leading-tight">{client.companyName}</p>
                                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{client.contactName}</p>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {client.status === 'Active'
                                            ? <Wifi size={12} className="text-emerald-400" />
                                            : <WifiOff size={12} className="text-slate-500" />
                                        }
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${client.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {client.status}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs shrink-0 min-w-[120px]">
                                        <MapPin size={12} className="text-slate-600 shrink-0" />
                                        {client.city !== '—' ? `${client.city}, ` : ''}{client.country}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                                        <StatPill label="Revenue" value={fmtCurrency(client.revenue.total)} color="text-emerald-400" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); fetchClientOrders(client._id, client.companyName); }}
                                            className="hover:scale-105 hover:-translate-y-0.5 transition-all outline-none focus:outline-none ring-1 ring-white/10 hover:ring-white/30 rounded-lg group"
                                            title="View Transactions"
                                        >
                                            <StatPill label="eSIMs" value={client.inventory.total} color="text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        </button>
                                        <StatPill label="Assigned" value={client.inventory.assigned} color="text-orange-400" />
                                        {client.hasApiKey && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                                <Key size={11} className="text-violet-400" />
                                                <span className="text-[10px] text-violet-400 font-bold uppercase">API</span>
                                            </div>
                                        )}
                                        <div className={`transition-transform duration-200 text-slate-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Detail Panel */}
                                {isExpanded && (
                                    <div className="border-t border-white/5 px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/20">
                                        {/* Contact Details */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Contact</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Mail size={14} className="text-slate-500 shrink-0" />
                                                <a href={`mailto:${client.email}`} className="hover:text-orange-400 transition-colors truncate">
                                                    {client.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <MapPin size={14} className="text-slate-500 shrink-0" />
                                                {[client.city, client.country].filter(v => v !== '—').join(', ') || '—'}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Building2 size={14} className="text-slate-500 shrink-0" />
                                                Joined {fmtDate(client.joinedAt)}
                                            </div>
                                            {client.webhookUrl && (
                                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                                    <Globe size={13} className="text-slate-600 mt-0.5 shrink-0" />
                                                    <a href={client.webhookUrl} target="_blank" rel="noreferrer"
                                                        className="hover:text-orange-400 break-all transition-colors flex items-center gap-1">
                                                        {client.webhookUrl.replace(/^https?:\/\//, '')}
                                                        <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Inventory */}
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Inventory</p>
                                            <div className="space-y-2.5">
                                                {[
                                                    { label: 'Total Issued', value: client.inventory.total, color: 'text-blue-400' },
                                                    { label: 'Assigned', value: client.inventory.assigned, color: 'text-orange-400' },
                                                    { label: 'Available', value: client.inventory.available, color: 'text-emerald-400' },
                                                    { label: 'Package Types', value: client.inventory.packageCount, color: 'text-slate-300' },
                                                ].map(row => (
                                                    <div key={row.label} className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">{row.label}</span>
                                                        <span className={`font-bold font-mono ${row.color}`}>{row.value}</span>
                                                    </div>
                                                ))}
                                                {/* Utilization bar */}
                                                <div className="pt-2">
                                                    <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                                                        <span>Utilization</span>
                                                        <span>{utilizationPct}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${utilizationPct > 80 ? 'bg-red-500' : utilizationPct > 40 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${utilizationPct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Revenue */}
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Revenue & Activity</p>
                                            <div className="space-y-2.5">
                                                {[
                                                    { label: 'Total Revenue', value: fmtCurrency(client.revenue.total), color: 'text-emerald-400' },
                                                    { label: 'Total Orders', value: client.revenue.orderCount, color: 'text-slate-300' },
                                                    { label: 'Last Order', value: fmtDate(client.revenue.lastOrderAt), color: 'text-slate-400' },
                                                    { label: 'API Key', value: client.hasApiKey ? 'Active' : 'None', color: client.hasApiKey ? 'text-violet-400' : 'text-slate-600' },
                                                ].map(row => (
                                                    <div key={row.label} className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">{row.label}</span>
                                                        <span className={`font-bold font-mono ${row.color}`}>{row.value}</span>
                                                    </div>
                                                ))}
                                                {client.hasApiKey && (
                                                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                                        <ShieldCheck size={13} className="text-violet-400" />
                                                        <span className="text-xs text-violet-300">API integration enabled</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Health Alerts */}
            {!loading && clients.length > 0 && (() => {
                const noInventory = clients.filter(c => c.inventory.available === 0 && c.status === 'Active');
                const noOrders = clients.filter(c => c.revenue.orderCount === 0);
                if (!noInventory.length && !noOrders.length) return null;
                return (
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                            <AlertCircle size={16} />
                            <span className="text-sm font-semibold">Partner Alerts</span>
                        </div>
                        {noInventory.length > 0 && (
                            <p className="text-xs text-slate-400">
                                <span className="text-amber-400 font-semibold">{noInventory.length} partner{noInventory.length > 1 ? 's' : ''}</span> {noInventory.length > 1 ? 'have' : 'has'} <strong>0 available eSIMs</strong>:{' '}
                                {noInventory.map(c => c.companyName).join(', ')}
                            </p>
                        )}
                        {noOrders.length > 0 && (
                            <p className="text-xs text-slate-400">
                                <span className="text-amber-400 font-semibold">{noOrders.length} partner{noOrders.length > 1 ? 's' : ''}</span> {noOrders.length > 1 ? 'have' : 'has'} <strong>never placed an order</strong>:{' '}
                                {noOrders.map(c => c.companyName).join(', ')}
                            </p>
                        )}
                    </div>
                );
            })()}

            {/* Transactions Modal */}
            {viewingOrdersFor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingOrdersFor(null)}></div>
                    <div className="bg-[#171717] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Receipt size={18} className="text-orange-500" /> Transaction History
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">{viewingOrdersFor.name}</p>
                            </div>
                            <button onClick={() => setViewingOrdersFor(null)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                            {loadingOrders ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                                    <RefreshCw size={28} className="animate-spin text-orange-500" />
                                    <p className="text-sm">Loading transactions...</p>
                                </div>
                            ) : clientOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <Receipt size={28} className="opacity-50" />
                                    </div>
                                    <p className="text-sm text-slate-400">No transactions found for this partner.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-[11px] text-slate-500 uppercase tracking-widest bg-black/40 border-b border-white/5 sticky top-0 backdrop-blur-md">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Purchase ID</th>
                                            <th className="px-6 py-4 font-semibold">Purchase Date</th>
                                            <th className="px-6 py-4 font-semibold text-right">Total eSIMs</th>
                                            <th className="px-6 py-4 font-semibold text-right">Total Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {clientOrders.map(order => (
                                            <tr key={order._id} className="hover:bg-white/5 hover:cursor-default transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-slate-400 group-hover:text-slate-300 text-xs transition-colors">#{order._id.slice(-8)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">
                                                    {fmtDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-mono font-bold text-xs ring-1 ring-inset ring-blue-500/20">
                                                        <Package size={12} />
                                                        {order.totalTokens}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono font-bold text-emerald-400">
                                                        {fmtCurrency(order.totalAmount)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
