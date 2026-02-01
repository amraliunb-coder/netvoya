import React, { useState, useEffect } from 'react';
import {
  Package,
  Check,
  ArrowRight,
  ArrowLeft,
  Search,
  Globe,
  ChevronDown,
  X,
  AlertCircle,
  Calculator,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import Button from '../../ui/Button';
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
}

const RequestInventory: React.FC = () => {
  const [step, setStep] = useState(1);
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [allPackages, setAllPackages] = useState<EsimPackage[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<EsimPackage[]>([]);
  const [distributions, setDistributions] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/packages`);
      setAllPackages(response.data.packages);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch packages. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePackage = (pkg: EsimPackage) => {
    const isSelected = selectedPackages.find(p => p._id === pkg._id);
    if (isSelected) {
      setSelectedPackages(selectedPackages.filter(p => p._id !== pkg._id));
      const newDists = { ...distributions };
      delete newDists[pkg._id];
      setDistributions(newDists);
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
      setDistributions({ ...distributions, [pkg._id]: 0 });
    }
  };

  const handleDistChange = (pkgId: string, value: number) => {
    setDistributions({ ...distributions, [pkgId]: Math.max(0, value) });
  };

  const filteredPackages = allPackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTotalDist = Object.values(distributions).reduce((a, b) => a + b, 0);
  const isDistValid = currentTotalDist === totalTokens && totalTokens > 0;

  const totalCost = selectedPackages.reduce((acc, pkg) => {
    return acc + (pkg.retail_price * (distributions[pkg._id] || 0));
  }, 0);

  const nextStep = () => {
    if (step === 1 && totalTokens > 0) setStep(2);
    else if (step === 2 && selectedPackages.length > 0) setStep(3);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock submission for now
      await new Promise(r => setTimeout(r, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Submission failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setSuccess(false);
    setStep(1);
    setTotalTokens(0);
    setSelectedPackages([]);
    setDistributions({});
    setSearchTerm('');
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in-view">
        <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center text-emerald-400 mb-6 border border-emerald-400/20">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-4">Request Submitted!</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Your request for {totalTokens} tokens across {selectedPackages.length} locations has been received.
          A billing representative will process your invoice within 24 hours.
        </p>
        <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-sm mx-auto w-full text-left">
          <div className="text-xs text-slate-500 uppercase font-bold mb-3 tracking-widest">Order Details</div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Total Tokens:</span>
            <span className="text-white font-medium">{totalTokens}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Value:</span>
            <span className="text-orange-500 font-bold">${totalCost.toLocaleString()}</span>
          </div>
        </div>
        <Button onClick={resetFlow} variant="secondary" className="mt-8">
          Start New Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Request Inventory</h2>
          <p className="text-slate-500 text-sm">Purchase additional tokens to issue more eSIMs to your clients.</p>
        </div>

        {/* Stepper Component */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === i ? 'bg-orange-500 text-white' : step > i ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                {step > i ? <Check size={16} /> : i}
              </div>
              {i < 3 && <div className={`w-12 h-px ${step > i ? 'bg-emerald-400/20' : 'bg-white/5'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#171717] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />

        <div className="flex-1">
          {/* STEP 1: Total Tokens */}
          {step === 1 && (
            <div className="space-y-8 animate-in-view py-6">
              <div className="max-w-md">
                <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Step 1: Quantity</label>
                <h3 className="text-2xl font-display font-bold text-white mb-6">How many tokens do you need in total?</h3>

                <div className="relative group">
                  <input
                    type="number"
                    min="1"
                    value={totalTokens || ''}
                    onChange={(e) => setTotalTokens(parseInt(e.target.value) || 0)}
                    placeholder="Enter amount (e.g. 500)"
                    className="w-full bg-white/5 border border-white/10 group-hover:border-white/20 rounded-2xl py-6 px-8 text-4xl font-display font-bold text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-white/5"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                    <span className="text-slate-500 font-bold tracking-tighter text-sm uppercase">Total</span>
                    <span className="text-orange-500 font-bold text-xl">Tokens</span>
                  </div>
                </div>

                {totalTokens > 0 && totalTokens < 10 && (
                  <div className="mt-4 flex items-center gap-2 text-orange-400 text-xs py-2 px-3 bg-orange-400/5 border border-orange-400/10 rounded-lg">
                    <AlertCircle size={14} />
                    <span>Minimum request is 10 tokens.</span>
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Flexible Distribution</h4>
                    <p className="text-sm text-slate-500">In the following steps, you'll be able to distribute these {totalTokens || 'X'} tokens across different countries according to your client needs.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Selection by Country */}
          {step === 2 && (
            <div className="space-y-8 animate-in-view py-6">
              <div className="max-w-xl">
                <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Step 2: Selection</label>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Select your target locations</h3>
                <p className="text-slate-500 text-sm mb-6">Choose one or more packages based on where your clients travel.</p>

                <div className="relative">
                  {/* Multi-Select Trigger */}
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`w-full bg-white/5 border rounded-2xl p-4 flex flex-wrap gap-2 cursor-pointer transition-all min-h-[64px] ${showDropdown ? 'border-orange-500/50 ring-4 ring-orange-500/10' : 'border-white/10 hover:border-white/20'}`}
                  >
                    {selectedPackages.length === 0 ? (
                      <div className="flex items-center gap-3 text-slate-500 w-full px-2">
                        <Search size={18} />
                        <span>Search and select packages...</span>
                      </div>
                    ) : (
                      selectedPackages.map(pkg => (
                        <div key={pkg._id} className="bg-orange-500 text-white text-xs font-bold py-1.5 pl-3 pr-2 rounded-lg flex items-center gap-2 animate-scale-in">
                          {pkg.name}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleTogglePackage(pkg); }}
                            className="hover:bg-white/20 rounded p-0.5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <ChevronDown size={20} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-in">
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                          <input
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Quick search (e.g. USA, Europe, 5GB)"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {loading ? (
                          <div className="p-8 text-center text-slate-500">Loading catalog...</div>
                        ) : filteredPackages.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">No matching plans found</div>
                        ) : (
                          filteredPackages.map(pkg => {
                            const isSelected = selectedPackages.find(p => p._id === pkg._id);
                            return (
                              <div
                                key={pkg._id}
                                onClick={() => handleTogglePackage(pkg)}
                                className={`p-4 cursor-pointer flex items-center justify-between group transition-colors ${isSelected ? 'bg-orange-500/5' : 'hover:bg-white/5'}`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-orange-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white'}`}>
                                    <Globe size={18} />
                                  </div>
                                  <div>
                                    <div className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                      {pkg.name}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {pkg.data_limit_gb}GB • {pkg.duration_days} Days • ${pkg.retail_price.toFixed(2)} / token
                                    </div>
                                  </div>
                                </div>
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 group-hover:border-white/30'}`}>
                                  {isSelected && <Check size={14} strokeWidth={3} />}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Distribution & Summary */}
          {step === 3 && (
            <div className="space-y-8 animate-in-view py-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Distribution Inputs */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Step 3: Distribution</label>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Distribute your tokens</h3>
                    <p className="text-slate-500 text-sm">Allocate {totalTokens} tokens across your selected destinations.</p>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedPackages.map(pkg => (
                      <div key={pkg._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all">
                            <Package size={20} />
                          </div>
                          <div>
                            <div className="text-white font-semibold">{pkg.name}</div>
                            <div className="text-xs text-slate-500">${pkg.retail_price.toFixed(2)} retail</div>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={distributions[pkg._id] || ''}
                            placeholder="0"
                            onChange={(e) => handleDistChange(pkg._id, parseInt(e.target.value) || 0)}
                            className="w-24 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-center text-white text-lg font-bold focus:outline-none focus:border-orange-500 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${currentTotalDist === totalTokens ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                    <span className="text-sm font-bold uppercase tracking-widest">Remaining to assign:</span>
                    <span className="text-xl font-display font-bold">{totalTokens - currentTotalDist}</span>
                  </div>
                </div>

                {/* Right Side: Summary Card */}
                <div className="w-full lg:w-[350px] shrink-0">
                  <div className="bg-gradient-to-br from-[#1e1e1e] to-black border border-white/10 rounded-3xl p-6 shadow-xl sticky top-0">
                    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Order Summary</h4>
                    <div className="space-y-4 mb-8">
                      {selectedPackages.filter(p => distributions[p._id] > 0).map(pkg => (
                        <div key={pkg._id} className="flex justify-between text-sm animate-slide-in">
                          <span className="text-slate-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                            {pkg.name} ({distributions[pkg._id]})
                          </span>
                          <span className="text-white font-medium">${(pkg.retail_price * distributions[pkg._id]).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-400 text-sm">Total Tokens</span>
                          <span className="text-xl text-white font-display font-bold">{totalTokens}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Amount</span>
                          <span className="text-4xl text-orange-500 font-display font-bold">${totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!isDistValid || loading}
                      className="w-full justify-center py-6 rounded-2xl text-lg relative group overflow-hidden"
                    >
                      <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 flex items-center gap-2">
                        {loading ? 'Processing...' : 'Confirm Request'}
                      </span>
                      {/* Shine Effect */}
                      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                    </Button>

                    <p className="text-[10px] text-slate-600 text-center mt-4 uppercase font-bold tracking-widest">Pricing based on active website catalog</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="mt-auto pt-8 flex justify-between">
          {step > 1 ? (
            <Button variant="secondary" onClick={prevStep} className="px-8 border border-white/10">
              <ArrowLeft size={18} className="mr-2" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <Button
              onClick={nextStep}
              disabled={step === 1 ? totalTokens < 10 : selectedPackages.length === 0}
              className="px-12 py-4"
            >
              {step === 1 ? 'Select Countries' : 'Continue to Distribution'} <ArrowRight size={18} className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(249, 115, 22, 0.3);
                }
                @keyframes shine {
                    to { left: 100%; }
                }
                .animate-shine {
                    animation: shine 1.5s infinite;
                }
            `}</style>
    </div>
  );
};

export default RequestInventory;