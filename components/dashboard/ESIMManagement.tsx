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
  ChevronDown,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

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

interface ParsedEsim {
  iccid: string;
  smdp_address: string;
  matching_id: string;
  activation_code: string;
}

const ESIMManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<EsimProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [usageData, setUsageData] = useState<Record<string, any>>({});

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

  // Tab State: 'single' or 'bulk'
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Searchable Select State
  const [pkgSearch, setPkgSearch] = useState('');
  const [isPkgDropdownOpen, setIsPkgDropdownOpen] = useState(false);
  const pkgDropdownRef = useRef<HTMLDivElement>(null);

  // Bulk Import State
  const [bulkParsedEsims, setBulkParsedEsims] = useState<ParsedEsim[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkPartnerId, setBulkPartnerId] = useState('');
  const [bulkPackageId, setBulkPackageId] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [bulkPkgSearch, setBulkPkgSearch] = useState('');
  const [isBulkPkgDropdownOpen, setIsBulkPkgDropdownOpen] = useState(false);
  const bulkPkgDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams();
      if (partnerFilter) urlParams.append('partnerId', partnerFilter);

      const [profilesResp, usersResp, pkgsResp] = await Promise.all([
        axios.get(`${API_BASE}/admin/profiles?${urlParams.toString()}`),
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/packages?admin=true`)
      ]);

      const profilesList = profilesResp.data.profiles || [];
      setProfiles(profilesList);
      setPartners(usersResp.data || []);
      setPackages(pkgsResp.data.packages || []);
      setError(null);

      // Fetch usage for active/assigned eSIMs
      const activeIccids = profilesList
        .filter((p: EsimProfile) => p.status === 'Active' || p.status === 'Assigned')
        .map((p: EsimProfile) => p.iccid);

      if (activeIccids.length > 0) {
        try {
          const usageRes = await axios.post(`${API_BASE}/esim/usage/batch`, { iccids: activeIccids });
          if (usageRes.data.success) {
            setUsageData(usageRes.data.usage);
          }
        } catch (usageErr) {
          console.error("Failed to fetch usage data", usageErr);
        }
      }
    } catch (err: any) {
      setError('Failed to fetch data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [partnerFilter]);

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (pkgDropdownRef.current && !pkgDropdownRef.current.contains(event.target as Node)) {
        setIsPkgDropdownOpen(false);
      }
      if (bulkPkgDropdownRef.current && !bulkPkgDropdownRef.current.contains(event.target as Node)) {
        setIsBulkPkgDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // === SINGLE ISSUE HANDLERS ===
  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/admin/issue-esim`, formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({ partnerId: '', packageId: '', iccid: '', activationCode: '', qrCodeUrl: '' });
        setVerificationDetails(null);
        setPkgSearch('');
        fetchData(); // Refresh list
      }, 2000);
    } catch (err: any) {
      alert('Failed to issue eSIM: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const verifyICCID = async () => {
    if (!formData.iccid || formData.iccid.length < 5) {
      setVerificationError("Please enter a valid ICCID first.");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setVerificationDetails(null);

    try {
      const res = await axios.get(`${API_BASE}/admin/verify-iccid/${formData.iccid}`);
      const details = res.data.details;
      setVerificationDetails(details);

      if (details) {
        const vendorDesc = JSON.stringify(details).toLowerCase();

        const matchedPkg = packages.find(p =>
          vendorDesc.includes(p.name.toLowerCase()) ||
          (details.product_name && p.name.toLowerCase().includes(details.product_name.toLowerCase()))
        );

        if (matchedPkg) {
          setFormData(prev => ({ ...prev, packageId: matchedPkg._id }));
          if (details.activation_code) {
            setFormData(prev => ({ ...prev, activationCode: details.activation_code }));
          }
          if (details.smp_address) {
            if (!details.activation_code) {
              setFormData(prev => ({ ...prev, activationCode: `LPA:1$${details.smp_address}$...` }));
            }
          }
        }
      }
    } catch (err: any) {
      setVerificationError(err.response?.data?.message || err.message || "Failed to verify ICCID");
    } finally {
      setIsVerifying(false);
    }
  };

  // === BULK IMPORT HANDLERS ===
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setBulkFileName(file.name);
    setBulkResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsed: ParsedEsim[] = jsonData
          .filter(row => row.Iccid || row.iccid || row.ICCID)
          .map(row => {
            const iccid = String(row.Iccid || row.iccid || row.ICCID || '').trim();
            const smdp = String(row.Smdp_address || row.smdp_address || row.SMDP_ADDRESS || '').trim();
            const matchId = String(row.Matching_id || row.matching_id || row.MATCHING_ID || '').trim();
            return {
              iccid,
              smdp_address: smdp,
              matching_id: matchId,
              activation_code: (smdp && matchId) ? `LPA:1$${smdp}$${matchId}` : ''
            };
          });

        setBulkParsedEsims(parsed);
      } catch (err) {
        alert('Failed to parse the Excel file. Please check the format.');
        setBulkParsedEsims([]);
        setBulkFileName('');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBulkSubmit = async () => {
    if (!bulkPartnerId || !bulkPackageId || bulkParsedEsims.length === 0) {
      alert('Please select a partner, package, and upload a file first.');
      return;
    }

    setBulkSubmitting(true);
    setBulkResult(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/bulk-import`, {
        partnerId: bulkPartnerId,
        packageId: bulkPackageId,
        esims: bulkParsedEsims.map(e => ({
          iccid: e.iccid,
          smdp_address: e.smdp_address,
          matching_id: e.matching_id
        }))
      });
      setBulkResult(res.data);
      fetchData(); // Refresh inventory
    } catch (err: any) {
      setBulkResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setBulkSubmitting(false);
    }
  };

  const clearBulkImport = () => {
    setBulkParsedEsims([]);
    setBulkFileName('');
    setBulkResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredProfiles = profiles.filter(p =>
    p.iccid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.assigned_to_name && p.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(pkgSearch.toLowerCase()) ||
    pkg.region.toLowerCase().includes(pkgSearch.toLowerCase())
  );

  const bulkFilteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(bulkPkgSearch.toLowerCase()) ||
    pkg.region.toLowerCase().includes(bulkPkgSearch.toLowerCase())
  );

  const selectedPackage = packages.find(p => p._id === formData.packageId);
  const bulkSelectedPackage = packages.find(p => p._id === bulkPackageId);

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

      {/* Issue Form with Tabs */}
      {showForm && (
        <div className="bg-[#171717] border border-orange-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/5 animate-in slide-in-from-top-4 duration-300">
          {/* Tab Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent flex justify-between items-center">
            <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'single' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                <Plus size={14} />
                Single Issue
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'bulk' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                <Upload size={14} />
                Bulk Import
              </button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent">

            {/* ===================== SINGLE ISSUE TAB ===================== */}
            {activeTab === 'single' && (
              <>
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
                    <div className="lg:col-span-3 grid grid-cols-1 gap-6">

                      {/* Step 1: Verification Section */}
                      <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">1</div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Verify Identity</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">ICCID</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="89..."
                                value={formData.iccid}
                                onChange={(e) => setFormData({ ...formData, iccid: e.target.value })}
                                required
                              />
                              <button
                                type="button"
                                onClick={verifyICCID}
                                disabled={isVerifying || !formData.iccid}
                                className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                              >
                                {isVerifying ? <RefreshCw className="animate-spin" size={18} /> : "Verify"}
                              </button>
                            </div>
                          </div>

                          {/* Verification Status Card */}
                          {verificationDetails && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 animate-in fade-in zoom-in duration-300">
                              <div className="flex items-center gap-2 text-green-400 mb-2">
                                <Check size={16} />
                                <span className="text-xs font-bold uppercase">Verified Live</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex flex-col">
                                  <span className="text-slate-500">Status</span>
                                  <span className="text-white font-medium">{verificationDetails.status || 'Active'}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-slate-500">Bundle</span>
                                  <span className="text-white font-medium truncate" title={verificationDetails.product_name || verificationDetails.package_label}>
                                    {verificationDetails.product_name || verificationDetails.package_label || 'Unknown'}
                                  </span>
                                </div>
                                {verificationDetails.balance && (
                                  <div className="col-span-2 mt-1 pt-1 border-t border-green-500/20 flex justify-between">
                                    <span className="text-slate-500">Data Balance</span>
                                    <span className="text-white font-mono">{JSON.stringify(verificationDetails.balance)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {verificationError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-left-2">
                              <AlertCircle size={18} className="shrink-0 mt-0.5" />
                              <p className="text-xs leading-relaxed">{verificationError}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 2: Assignment Details */}
                      <div className={`space-y-4 transition-opacity duration-300 ${verificationDetails ? 'opacity-100' : 'opacity-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 text-slate-300 flex items-center justify-center text-xs font-bold">2</div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Assign Package</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </>
            )}

            {/* ===================== BULK IMPORT TAB ===================== */}
            {activeTab === 'bulk' && (
              <div className="space-y-6">

                {/* Success / Error Result */}
                {bulkResult && (
                  <div className={`rounded-xl p-5 border animate-in fade-in zoom-in duration-300 ${bulkResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {bulkResult.success ? (
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                          <Check size={24} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                          <AlertCircle size={24} />
                        </div>
                      )}
                      <div>
                        <h4 className={`font-bold ${bulkResult.success ? 'text-green-400' : 'text-red-400'}`}>
                          {bulkResult.success ? 'Import Successful!' : 'Import Failed'}
                        </h4>
                        <p className="text-slate-400 text-sm">{bulkResult.message}</p>
                      </div>
                    </div>
                    {bulkResult.success && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-400">{bulkResult.imported}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Imported</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-yellow-400">{bulkResult.skipped}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Skipped (Duplicates)</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-red-400">{bulkResult.errors?.length || 0}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Errors</div>
                        </div>
                      </div>
                    )}
                    <button onClick={clearBulkImport} className="mt-4 text-xs text-slate-400 hover:text-white underline transition-colors">Import another file</button>
                  </div>
                )}

                {!bulkResult && (
                  <>
                    {/* Step 1: File Upload */}
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">1</div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Upload Excel File</h4>
                      </div>

                      {bulkParsedEsims.length === 0 ? (
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-orange-500/30 hover:bg-white/[0.02]'}`}
                        >
                          <FileSpreadsheet size={40} className={`mx-auto mb-4 ${isDragging ? 'text-orange-500' : 'text-slate-500'}`} />
                          <p className="text-white font-medium mb-1">
                            {isDragging ? 'Drop your file here' : 'Drag & drop your Excel file here'}
                          </p>
                          <p className="text-slate-500 text-xs">or click to browse — supports .xlsx and .csv</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                              <FileSpreadsheet size={20} className="text-green-400" />
                              <div>
                                <p className="text-white text-sm font-medium">{bulkFileName}</p>
                                <p className="text-green-400 text-xs">{bulkParsedEsims.length} eSIMs parsed successfully</p>
                              </div>
                            </div>
                            <button onClick={clearBulkImport} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Preview Table */}
                          <div className="bg-black/30 rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-3 border-b border-white/5 flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Preview</span>
                              <span className="text-[10px] text-slate-500">Showing {Math.min(bulkParsedEsims.length, 5)} of {bulkParsedEsims.length}</span>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-black/20 text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">ICCID</th>
                                    <th className="px-4 py-2 text-left">SMDP Address</th>
                                    <th className="px-4 py-2 text-left">Activation Code</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {bulkParsedEsims.slice(0, 5).map((esim, i) => (
                                    <tr key={i} className="text-slate-300 hover:bg-white/5">
                                      <td className="px-4 py-2 text-slate-500">{i + 1}</td>
                                      <td className="px-4 py-2 font-mono text-white">{esim.iccid}</td>
                                      <td className="px-4 py-2 font-mono text-slate-400 truncate max-w-[200px]">{esim.smdp_address || '—'}</td>
                                      <td className="px-4 py-2 font-mono text-slate-400 truncate max-w-[250px]">{esim.activation_code || '—'}</td>
                                    </tr>
                                  ))}
                                  {bulkParsedEsims.length > 5 && (
                                    <tr>
                                      <td colSpan={4} className="px-4 py-2 text-center text-slate-500 text-[10px]">
                                        ...and {bulkParsedEsims.length - 5} more
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Partner & Package Selection */}
                    <div className={`space-y-4 transition-opacity duration-300 ${bulkParsedEsims.length > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 text-slate-300 flex items-center justify-center text-xs font-bold">2</div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Assign to Partner</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Partner Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-slate-500 uppercase">Target Partner</label>
                          <div className="relative">
                            <select
                              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-orange-500/50 transition-colors"
                              value={bulkPartnerId}
                              onChange={(e) => setBulkPartnerId(e.target.value)}
                            >
                              <option value="">Select Partner Account</option>
                              {partners.filter(u => (u as any).role === 'partner').map(p => (
                                <option key={p._id} value={p._id}>{p.companyName || p.username} ({p.email})</option>
                              ))}
                            </select>
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                          </div>
                        </div>

                        {/* Package Selector (searchable) */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-slate-500 uppercase">Package Plan</label>
                          <div className="relative" ref={bulkPkgDropdownRef}>
                            <div
                              onClick={() => setIsBulkPkgDropdownOpen(!isBulkPkgDropdownOpen)}
                              className={`w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white cursor-pointer flex justify-between items-center transition-all hover:border-white/20 ${isBulkPkgDropdownOpen ? 'border-orange-500/50' : ''}`}
                            >
                              <span className={bulkSelectedPackage ? "text-white" : "text-slate-500"}>
                                {bulkSelectedPackage ? `${bulkSelectedPackage.name} - ${bulkSelectedPackage.region}` : "Select Package"}
                              </span>
                              <ChevronDown size={16} className={`text-slate-500 transition-transform ${isBulkPkgDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isBulkPkgDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 border-b border-white/5 bg-black/20">
                                  <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                      type="text"
                                      autoFocus
                                      value={bulkPkgSearch}
                                      onChange={(e) => setBulkPkgSearch(e.target.value)}
                                      placeholder="Quick search package..."
                                      className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/30"
                                    />
                                  </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                  {bulkFilteredPackages.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500 text-xs">No matching packages</div>
                                  ) : (
                                    bulkFilteredPackages.map(pkg => (
                                      <div
                                        key={pkg._id}
                                        onClick={() => {
                                          setBulkPackageId(pkg._id);
                                          setIsBulkPkgDropdownOpen(false);
                                        }}
                                        className={`p-3 text-sm cursor-pointer hover:bg-orange-500/10 flex justify-between items-center transition-colors ${bulkPackageId === pkg._id ? 'bg-orange-500/5 text-orange-400' : 'text-slate-300'}`}
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-medium">{pkg.name}</span>
                                          <span className="text-[10px] text-slate-500">{pkg.region}</span>
                                        </div>
                                        {bulkPackageId === pkg._id && <Check size={14} />}
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleBulkSubmit}
                      disabled={bulkSubmitting || !bulkPartnerId || !bulkPackageId || bulkParsedEsims.length === 0}
                      className="w-full py-4 bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                      {bulkSubmitting ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          Importing {bulkParsedEsims.length} eSIMs...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Import {bulkParsedEsims.length} eSIMs to Partner
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
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
          <div className="flex gap-2 w-full sm:w-auto items-center">
            <div className="relative">
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="appearance-none bg-black/30 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-orange-500/50"
              >
                <option value="">All Partners</option>
                {partners.filter(u => (u as any).role === 'partner').map(p => (
                  <option key={p._id} value={p._id}>{p.companyName || p.username}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            </div>
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
                    <div className="flex flex-col items-end gap-1 w-32">
                      {usageData[profile.iccid] ? (
                        (() => {
                          const u = usageData[profile.iccid];
                          if (!u.initial_data || !u.remaining_data) {
                            return <span className="text-[10px] text-slate-500">Usage unavailable</span>;
                          }

                          // Parse simple "1 GB" or "500 MB" strings loosely
                          const parseVal = (str: string) => {
                            if (!str) return 0;
                            const num = parseFloat(str) || 0;
                            if (str.toUpperCase().includes('GB')) return num * 1024;
                            return num;
                          };

                          const initial = parseVal(u.initial_data);
                          const remaining = parseVal(u.remaining_data);
                          const pct = initial > 0 ? (remaining / initial) * 100 : 0;

                          let colorClass = "bg-green-500";
                          if (pct < 20) colorClass = "bg-red-500";
                          else if (pct < 50) colorClass = "bg-yellow-500";

                          return (
                            <>
                              <div className="flex justify-between w-full text-[10px] text-slate-400 font-mono">
                                <span>{u.remaining_data} left</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden" title={`${pct.toFixed(0)}% remaining`}>
                                <div className={`h-full ${colorClass} rounded-full transition-all duration-1000`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}></div>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative" title="Loading usage...">
                          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                        </div>
                      )}
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