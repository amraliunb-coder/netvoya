import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Smartphone,
  Signal,
  MoreVertical,
  UserPlus,
  Download,
  AlertCircle,
  RefreshCw,
  Mail,
  CheckCircle,
  X
} from 'lucide-react';
import axios from 'axios';

interface InventoryBucket {
  _id: string;
  package_name: string;
  region: string;
  data_limit_gb: number;
  duration_days: number;
  total_purchased: number;
  assigned_count: number;
  available_count: number;
}

const PartnerESIMs: React.FC = () => {
  const [buckets, setBuckets] = useState<InventoryBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningBucket, setAssigningBucket] = useState<InventoryBucket | null>(null);
  const [assignmentData, setAssignmentData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/inventory`);
      setBuckets(response.data.buckets);
    } catch (err: any) {
      setError('Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBucket) return;

    try {
      setStatus('submitting');
      await axios.post(`${API_BASE}/inventory/${assigningBucket._id}/assign`, assignmentData);
      setStatus('success');
      setTimeout(() => {
        setAssigningBucket(null);
        setAssignmentData({ name: '', email: '' });
        setStatus('idle');
        fetchInventory();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Assignment failed.');
      setStatus('idle');
    }
  };

  const handleDownload = async (bucketId: string) => {
    try {
      const resp = await axios.get(`${API_BASE}/inventory/${bucketId}/download`);
      alert(`Download started: ${resp.data.message}`);
    } catch (err) {
      alert('Download failed.');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="space-y-6 animate-in-view relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">eSIM Inventory</h2>
          <p className="text-slate-500 text-sm">Manage your bulk purchases and allocate profiles to team members.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search packages or regions..."
            className="w-full bg-[#171717] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Package Plan</th>
              <th className="px-6 py-4 text-center">Total</th>
              <th className="px-6 py-4 text-center">Assigned</th>
              <th className="px-6 py-4 text-center">Available</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <RefreshCw className="animate-spin mx-auto mb-2 text-orange-500" />
                  Syncing your inventory...
                </td>
              </tr>
            ) : buckets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No inventory found. Go to "Request Inventory" to stock up.
                </td>
              </tr>
            ) : buckets.map((bucket) => (
              <tr key={bucket._id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{bucket.package_name}</div>
                      <div className="text-xs text-slate-500 font-mono">{bucket.region} • {bucket.data_limit_gb}GB • {bucket.duration_days} Days</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-mono font-medium text-slate-300">
                  {bucket.total_purchased}
                </td>
                <td className="px-6 py-4 text-center font-mono text-slate-400">
                  {bucket.assigned_count}
                </td>
                <td className="px-6 py-4 text-center font-mono text-orange-400 font-bold">
                  {bucket.available_count}
                </td>
                <td className="px-6 py-4">
                  {bucket.available_count > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                      Sold Out
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDownload(bucket._id)}
                      className="p-2 bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all"
                      title="Download QR Codes"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => setAssigningBucket(bucket)}
                      disabled={bucket.available_count === 0}
                      className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-all disabled:opacity-30 disabled:grayscale"
                    >
                      <UserPlus size={14} />
                      Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {assigningBucket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Assign eSIM profile</h3>
                <p className="text-xs text-slate-500">From {assigningBucket.package_name}</p>
              </div>
              <button onClick={() => setAssigningBucket(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-white font-bold">Email Sent!</h4>
                  <p className="text-sm text-slate-400">Assignment successful. The employee will receive leur QR code immediately.</p>
                </div>
              ) : (
                <form onSubmit={handleAssign} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Employee Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Karim El Sharaany"
                      value={assignmentData.name}
                      onChange={(e) => setAssignmentData({ ...assignmentData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        required
                        type="email"
                        placeholder="employee@company.com"
                        value={assignmentData.email}
                        onChange={(e) => setAssignmentData({ ...assignmentData, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                      {status === 'submitting' ? <RefreshCw className="animate-spin" size={20} /> : 'Confirm Allocation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4 flex gap-4">
        <AlertCircle className="text-orange-500 shrink-0" size={20} />
        <div className="text-sm">
          <p className="text-orange-200 font-medium mb-1">Stock Note</p>
          <p className="text-slate-400">Inventory is automatically replenished after bulk purchases. Assigning a profile removes it from your available stock and emails the link to the recipient.</p>
        </div>
      </div>
    </div>
  );
};

export default PartnerESIMs;