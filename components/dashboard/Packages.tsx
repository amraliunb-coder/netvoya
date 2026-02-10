import React, { useState, useEffect } from 'react';
import {
    Package,
    RefreshCw,
    DollarSign,
    Search,
    Filter,
    Save,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import axios from 'axios';

interface EsimPackage {
    _id: string;
    vendor_package_id: string;
    name: string;
    region: string;
    data_limit_gb: number;
    duration_days: number;
    wholesale_cost: number;
    retail_price: number;
    is_live: boolean;
    last_sync: string;
}

const Packages: React.FC = () => {
    const [packages, setPackages] = useState<EsimPackage[]>([]);
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');

    // Filter packages based on search term and status
    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true :
            statusFilter === 'live' ? pkg.is_live : !pkg.is_live;
        return matchesSearch && matchesStatus;
    });

    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/packages?admin=true`);
            setPackages(response.data.packages);
            setError(null);
        } catch (err: any) {
            setError('Failed to fetch packages. Make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await axios.get(`${API_BASE}/vendor/balance`);
            setBalance(response.data.balance);
        } catch (err: any) {
            console.error('Failed to fetch balance');
        }
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            await axios.post(`${API_BASE}/vendor/sync`);
            await fetchPackages();
        } catch (err: any) {
            setError('Sync failed. Check vendor credentials in .env');
        } finally {
            setSyncing(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setSaveStatus({ ...saveStatus, [id]: 'saving' });
            await axios.patch(`${API_BASE}/packages/${id}/status`, { is_live: !currentStatus });
            setPackages(packages.map(p => p._id === id ? { ...p, is_live: !currentStatus } : p));
            setSaveStatus({ ...saveStatus, [id]: 'saved' });
            setTimeout(() => setSaveStatus(prev => ({ ...prev, [id]: 'idle' })), 2000);
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const updatePrice = async (id: string, retail_price: number) => {
        try {
            setSaveStatus({ ...saveStatus, [id]: 'saving' });
            await axios.patch(`${API_BASE}/packages/${id}/price`, { retail_price });
            setPackages(packages.map(p => p._id === id ? { ...p, retail_price } : p));
            setSaveStatus({ ...saveStatus, [id]: 'saved' });
            setTimeout(() => setSaveStatus(prev => ({ ...prev, [id]: 'idle' })), 2000);
        } catch (err) {
            setError('Failed to update price');
        }
    };

    useEffect(() => {
        fetchPackages();
        fetchBalance();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">Packages & Product Pricing</h2>
                    <p className="text-slate-500 text-sm">Manage retail pricing and visibility for all eSIM products.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-xl border border-white/10 w-fit">
                        {[
                            { id: 'all', label: 'All', count: packages.length },
                            { id: 'live', label: 'Live', count: packages.filter(p => p.is_live).length },
                            { id: 'draft', label: 'Draft', count: packages.filter(p => !p.is_live).length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${statusFilter === tab.id
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        {balance !== null && (
                            <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${balance < 10 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                                <DollarSign size={16} />
                                <span className="text-sm font-bold">Balance: ${balance.toFixed(2)}</span>
                                {balance < 10 && <AlertCircle size={14} className="animate-pulse" />}
                            </div>
                        )}
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium transition-all hover:bg-orange-600 disabled:opacity-50`}
                        >
                            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                            {syncing ? 'Syncing...' : 'Sync with Vendor'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <p className="text-sm">{error}</p>
                    <button onClick={fetchPackages} className="ml-auto underline text-xs">Retry</button>
                </div>
            )}

            {balance !== null && balance < 10 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-4">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <div className="text-sm text-red-200">
                        <p className="font-bold mb-1">Low Vendor Balance Warning!</p>
                        <p className="text-red-300/80">Your vendor balance is below $10.00. Customers will see a "Service Temporarily Unavailable" error if the balance hits $0.00. Please top up your account.</p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by country, region, or package name..."
                    className="w-full bg-[#171717] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Results count when searching */}
            {searchTerm && (
                <div className="text-sm text-slate-500">
                    Showing <span className="text-white font-medium">{filteredPackages.length}</span> of <span className="text-white font-medium">{packages.length}</span> packages
                </div>
            )}

            <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Product Details</th>
                                <th className="px-6 py-4 font-semibold text-right">Wholesale</th>
                                <th className="px-6 py-4 font-semibold text-center">Retail Price (USD)</th>
                                <th className="px-6 py-4 font-semibold text-right">Margin</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw size={24} className="animate-spin text-orange-500" />
                                            Loading packages...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPackages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {searchTerm ? (
                                            <div>
                                                <p>No packages found matching "<span className="text-orange-400">{searchTerm}</span>"</p>
                                                <button onClick={() => setSearchTerm('')} className="text-orange-500 underline text-sm mt-2">Clear search</button>
                                            </div>
                                        ) : (
                                            'No packages found. Click "Sync with Vendor" to populate.'
                                        )}
                                    </td>
                                </tr>
                            ) : filteredPackages.map((pkg) => {
                                const margin = ((pkg.retail_price - pkg.wholesale_cost) / pkg.retail_price * 100).toFixed(1);
                                const isLoss = pkg.retail_price <= pkg.wholesale_cost;

                                return (
                                    <tr key={pkg._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(pkg._id, pkg.is_live)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${pkg.is_live
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                    : 'bg-white/5 border-white/10 text-slate-500'
                                                    }`}
                                            >
                                                {pkg.is_live ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {pkg.is_live ? 'Live' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-white font-medium">{pkg.name}</div>
                                            <div className="text-slate-500 text-xs">{pkg.region} • {pkg.data_limit_gb}GB • {pkg.duration_days} Days</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-slate-400">
                                            ${pkg.wholesale_cost.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-orange-500/50 transition-all">
                                                <span className="text-slate-500 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    defaultValue={pkg.retail_price}
                                                    className="bg-transparent text-white text-sm w-16 focus:outline-none"
                                                    onBlur={(e) => updatePrice(pkg._id, parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm text-right font-medium ${isLoss ? 'text-red-400' : 'text-green-400'}`}>
                                            {margin}%
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className={`p-2 rounded-lg transition-all ${saveStatus[pkg._id] === 'saved'
                                                    ? 'bg-green-500/20 text-green-500'
                                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {saveStatus[pkg._id] === 'saving' ? <RefreshCw size={16} className="animate-spin" /> :
                                                    saveStatus[pkg._id] === 'saved' ? <Save size={16} /> : <Save size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4 flex gap-4">
                <AlertCircle className="text-orange-500 shrink-0" size={20} />
                <div className="text-sm">
                    <p className="text-orange-200 font-medium mb-1">Pricing Safeguard Active</p>
                    <p className="text-slate-400">The wholesale cost is updated automatically via the background sync worker. If a vendor price increase reduces your margin below 0%, the package will be flagged in red. New packages always start as <strong>Draft</strong> and must be manually toggled to <strong>Live</strong>.</p>
                </div>
            </div>
        </div>
    );
};

export default Packages;
