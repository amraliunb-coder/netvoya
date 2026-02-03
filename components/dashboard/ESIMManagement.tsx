import React, { useState, useEffect } from 'react';
import {
  Plus,
  Upload,
  Code,
  Search,
  Filter,
  Download,
  Smartphone,
  Signal,
  RefreshCw,
  AlertCircle,
  X,
  Check,
  User,
  Package
} from 'lucide-react';
import axios from 'axios';

interface EsimProfile {
  _id: string;
  iccid: string;
  status: 'Available' | 'Assigned' | 'Active' | 'Revoked';
  assigned_to_name?: string;
  assigned_to_email?: string;
  assignment_date?: string;
  bucket_id?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  companyName?: string;
}

interface Package {
  _id: string;
  name: string;
  region: string;
}

const ESIMManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<EsimProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partners, setPartners] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState({
    partnerId: '',
    packageId: '',
    iccid: '',
    activationCode: '',
    qrCodeUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/profiles`);
      setProfiles(response.data.profiles);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch profiles. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const openIssueModal = async () => {
    setIsModalOpen(true);
    try {
      // Fetch Partners
      const usersResp = await axios.get(`${API_BASE}/users`);
      setPartners(usersResp.data.filter((u: any) => u.role === 'partner'));

      // Fetch Packages
      const pkgsResp = await axios.get(`${API_BASE}/packages?admin=true`);
      setPackages(pkgsResp.data.packages);

    } catch (err) {
      console.error('Failed to load modal data', err);
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/admin/issue-esim`, formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setFormData({ partnerId: '', packageId: '', iccid: '', activationCode: '', qrCodeUrl: '' });
        fetchProfiles(); // Refresh list
      }, 1500);
    } catch (err: any) {
      alert('Failed to issue eSIM: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(p =>
    p.iccid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.assigned_to_name && p.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in-view">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">eSIM Management</h2>
          <p className="text-slate-500 text-sm">Manage inventory, issue profiles, and track usage.</p>
        </div>
        <button
          onClick={fetchProfiles}
          className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Refresh List"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={openIssueModal}
          className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-orange-500/20 transition-all"
        >
          <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Plus size={80} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">Issue New eSIM</h3>
            <p className="text-orange-100 text-sm">Manually assign to partner</p>
          </div>
        </div>

        <div className="bg-[#171717] border border-white/5 rounded-xl p-6 group cursor-pointer hover:border-orange-500/30 transition-all">
          <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
            <Upload size={24} />
          </div>
          <h3 className="font-bold text-lg text-white mb-1">Bulk Issue (CSV)</h3>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </div>

        <div className="bg-[#171717] border border-white/5 rounded-xl p-6 group cursor-pointer hover:border-orange-500/30 transition-all">
          <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
            <Code size={24} />
          </div>
          <h3 className="font-bold text-lg text-white mb-1">API Integration</h3>
          <p className="text-slate-500 text-sm">Connect your own platform</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ICCID or Client..."
              className="bg-black/30 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-slate-300 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-slate-300 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <RefreshCw className="animate-spin mb-3 text-orange-500" size={24} />
              <p>Loading profiles...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400 flex flex-col items-center">
              <AlertCircle className="mb-3" size={30} />
              <p>{error}</p>
              <button onClick={fetchProfiles} className="mt-4 underline text-sm">Retry Request</button>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>No profiles found. Issue a new eSIM or seed the database.</p>
            </div>
          ) : (
            filteredProfiles.map((profile) => (
              <div key={profile._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${profile.status === 'Active' ? 'bg-green-400/10 text-green-400' : profile.status === 'Assigned' ? 'bg-blue-400/10 text-blue-400' : 'bg-slate-400/10 text-slate-400'}`}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium flex items-center gap-2">
                      eSIM Profile
                      <span className="text-xs font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{profile.iccid.substring(0, 10)}...</span>
                    </div>
                    {profile.assigned_to_name ? (
                      <div className="text-slate-500 text-xs mt-1">Issued to: <span className="text-slate-300">{profile.assigned_to_name}</span></div>
                    ) : (
                      <div className="text-slate-500 text-xs mt-1">Status: <span className="text-slate-300">{profile.status}</span></div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 ${profile.status === 'Active' ? 'text-green-400' : 'text-slate-400'}`}>
                      <Signal size={14} className={profile.status === 'Active' ? "text-green-400" : "text-slate-600"} />
                      {profile.status}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {new Date(profile.assignment_date || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  {profile.status !== 'Available' && (
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden" title="Data Usage Mock">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/5 text-center">
          <p className="text-xs text-slate-600">Showing {filteredProfiles.length} records</p>
        </div>
      </div>

      {/* Manual Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171717] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Issue New eSIM</h3>
                <p className="text-xs text-slate-500">Manually adding to partner inventory</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500">
                    <Check size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white">Issued Successfully!</h4>
                  <p className="text-slate-400 text-sm mt-2">The eSIM has been added to the user's inventory.</p>
                </div>
              ) : (
                <form onSubmit={handleIssueSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 uppercase">Partner</label>
                      <div className="relative">
                        <select
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-orange-500/50"
                          value={formData.partnerId}
                          onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                          required
                        >
                          <option value="">Select Partner</option>
                          {partners.map(p => (
                            <option key={p._id} value={p._id}>{p.companyName || p.username} ({p.email})</option>
                          ))}
                        </select>
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 uppercase">Package Plan</label>
                      <div className="relative">
                        <select
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-orange-500/50"
                          value={formData.packageId}
                          onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                          required
                        >
                          <option value="">Select Package</option>
                          {packages.map(p => (
                            <option key={p._id} value={p._id}>{p.name} - {p.region}</option>
                          ))}
                        </select>
                        <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">ICCID</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50"
                      placeholder="89..."
                      value={formData.iccid}
                      onChange={(e) => setFormData({ ...formData, iccid: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Activation Code (LPA)</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50"
                      placeholder="LPA:1$..."
                      value={formData.activationCode}
                      onChange={(e) => setFormData({ ...formData, activationCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">QR Code URL (Optional)</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50"
                      placeholder="https://..."
                      value={formData.qrCodeUrl}
                      onChange={(e) => setFormData({ ...formData, qrCodeUrl: e.target.value })}
                    />
                    <p className="text-[10px] text-slate-500">If left blank, a generic QR code will be generated from the activation code.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 mt-4 flex items-center justify-center gap-2"
                  >
                    {submitting ? <RefreshCw className="animate-spin" /> : 'Issue to Partner'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ESIMManagement;