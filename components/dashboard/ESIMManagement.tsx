import React, { useState, useEffect, useRef } from 'react';
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
  Package as PackageIcon,
  ChevronDown
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
  createdAt?: string;
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

  // Form State
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
  const [showForm, setShowForm] = useState(true);

  // Searchable Select State
  const [pkgSearch, setPkgSearch] = useState('');
  const [isPkgDropdownOpen, setIsPkgDropdownOpen] = useState(false);
  const pkgDropdownRef = useRef<HTMLDivElement>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profilesResp, usersResp, pkgsResp] = await Promise.all([
        axios.get(`${API_BASE}/admin/profiles`),
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/packages?admin=true`)
      ]);

      setProfiles(profilesResp.data.profiles || []);
      setPartners(usersResp.data || []);
      setPackages(pkgsResp.data.packages || []);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (pkgDropdownRef.current && !pkgDropdownRef.current.contains(event.target as Node)) {
        setIsPkgDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/admin/issue-esim`, formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({ partnerId: '', packageId: '', iccid: '', activationCode: '', qrCodeUrl: '' });
        setPkgSearch('');
        fetchData(); // Refresh list
      }, 2000);
    } catch (err: any) {
      alert('Failed to issue eSIM: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.iccid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.assigned_to_name && p.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(pkgSearch.toLowerCase()) ||
    pkg.region.toLowerCase().includes(pkgSearch.toLowerCase())
  );

  const selectedPackage = packages.find(p => p._id === formData.packageId);

  return (
    <div className="space-y-8 animate-in-view pb-20">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">eSIM Management</h2>
          <p className="text-slate-500 text-sm">Issue and manage individual eSIM profiles.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 border rounded-lg text-sm transition-all flex items-center gap-2 ${showForm ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'}`}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Close Form' : 'Issue New eSIM'}
          </button>
          <button
            onClick={fetchData}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Manual Issue Form - INLINED AT THE TOP */}
      {showForm && (
        <div className="bg-[#171717] border border-orange-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/5 animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent flex justify-between items-center text-orange-500">
            <div className="flex items-center gap-3">
              <Plus size={18} />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Issue New eSIM</h3>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent">
            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500">
                  <Check size={32} />
                </div>
                <h4 className="text-xl font-bold text-white">Issued Successfully!</h4>
                <p className="text-slate-400 text-sm mt-2">The eSIM has been added to the partner's inventory.</p>
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Partner Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Target Partner</label>
                    <div className="relative">
                      <select
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-orange-500/50 transition-colors"
                        value={formData.partnerId}
                        onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                        required
                      >
                        <option value="">Select Partner Account</option>
                        {partners.filter(u => u.role === 'partner' || (u as any).role === 'partner').map(p => (
                          <option key={p._id} value={p._id}>{p.companyName || p.username} ({p.email})</option>
                        ))}
                      </select>
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* SEARCHABLE Package Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Package Plan</label>
                    <div className="relative" ref={pkgDropdownRef}>
                      <div
                        onClick={() => setIsPkgDropdownOpen(!isPkgDropdownOpen)}
                        className={`w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white cursor-pointer flex justify-between items-center transition-all hover:border-white/20 ${isPkgDropdownOpen ? 'border-orange-500/50' : ''}`}
                      >
                        <span className={selectedPackage ? "text-white" : "text-slate-500"}>
                          {selectedPackage ? `${selectedPackage.name} - ${selectedPackage.region}` : "Select Package"}
                        </span>
                        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isPkgDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isPkgDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-2 border-b border-white/5 bg-black/20">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                              <input
                                type="text"
                                autoFocus
                                value={pkgSearch}
                                onChange={(e) => setPkgSearch(e.target.value)}
                                placeholder="Quick search package..."
                                className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/30"
                              />
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredPackages.length === 0 ? (
                              <div className="p-4 text-center text-slate-500 text-xs">No matching packages</div>
                            ) : (
                              filteredPackages.map(pkg => (
                                <div
                                  key={pkg._id}
                                  onClick={() => {
                                    setFormData({ ...formData, packageId: pkg._id });
                                    setIsPkgDropdownOpen(false);
                                  }}
                                  className={`p-3 text-sm cursor-pointer hover:bg-orange-500/10 flex justify-between items-center transition-colors ${formData.packageId === pkg._id ? 'bg-orange-500/5 text-orange-400' : 'text-slate-300'}`}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{pkg.name}</span>
                                    <span className="text-[10px] text-slate-500">{pkg.region}</span>
                                  </div>
                                  {formData.packageId === pkg._id && <Check size={14} />}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">ICCID</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50 transition-colors"
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
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50 transition-colors"
                      placeholder="LPA:1$..."
                      value={formData.activationCode}
                      onChange={(e) => setFormData({ ...formData, activationCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">QR Code URL (Optional)</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50"
                      placeholder="https://..."
                      value={formData.qrCodeUrl}
                      onChange={(e) => setFormData({ ...formData, qrCodeUrl: e.target.value })}
                    />
                    <p className="text-[10px] text-slate-600">Generated automatically if left empty.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !formData.packageId}
                    className="w-full py-4 bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? <RefreshCw className="animate-spin" size={20} /> : (
                      <>
                        <Smartphone size={18} />
                        Issue to Partner
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider whitespace-nowrap">Global Inventory</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ICCID or Client..."
                className="bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-orange-500/50 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-slate-300 rounded-lg text-xs hover:bg-white/10 transition-colors">
              <Filter size={14} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-slate-300 rounded-lg text-xs hover:bg-white/10 transition-colors">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="divide-y divide-white/5">
          {loading && profiles.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <RefreshCw className="animate-spin mb-3 text-orange-500" size={24} />
              <p>Loading profiles...</p>
            </div>
          ) : error && profiles.length === 0 ? (
            <div className="p-12 text-center text-red-400 flex flex-col items-center">
              <AlertCircle className="mb-3" size={30} />
              <p>{error}</p>
              <button onClick={fetchData} className="mt-4 underline text-sm">Retry Request</button>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-sm">No profiles found in inventory.</p>
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
                      ICCID: <span className="font-mono text-slate-400 tracking-wider text-sm">{profile.iccid}</span>
                    </div>
                    {profile.assigned_to_name ? (
                      <div className="text-slate-500 text-xs mt-1">Issued to: <span className="text-slate-300">{profile.assigned_to_name}</span></div>
                    ) : (
                      <div className="text-slate-500 text-xs mt-1">Status: <span className="text-slate-300 uppercase tracking-tighter">{profile.status}</span></div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 font-medium ${profile.status === 'Active' ? 'text-green-400' : profile.status === 'Assigned' ? 'text-blue-400' : 'text-slate-400'}`}>
                      <Signal size={14} className={profile.status === 'Active' ? "text-green-400" : profile.status === 'Assigned' ? "text-blue-400" : "text-slate-600"} />
                      {profile.status}
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      {new Date(profile.assignment_date || profile.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  {profile.status !== 'Available' && (
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden" title="Data Usage">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.random() * 80}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">End of Inventory Records</p>
          <p className="text-xs text-slate-400">Total: {filteredProfiles.length}</p>
        </div>
      </div>

    </div>
  );
};

export default ESIMManagement;