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
  ChevronRight,
  Percent
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

// Volume Discount Configuration (Tiered)
const DISCOUNT_TIER_1 = { threshold: 100, percent: 0.05 }; // 5% for 100+
const DISCOUNT_TIER_2 = { threshold: 300, percent: 0.10 }; // 10% for 300+

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

  // Tiered discount logic
  const getDiscountInfo = () => {
    if (totalTokens >= DISCOUNT_TIER_2.threshold) {
      return { hasDiscount: true, percent: DISCOUNT_TIER_2.percent, label: '10%' };
    } else if (totalTokens >= DISCOUNT_TIER_1.threshold) {
      return { hasDiscount: true, percent: DISCOUNT_TIER_1.percent, label: '5%' };
    }
    return { hasDiscount: false, percent: 0, label: '' };
  };

  const discountInfo = getDiscountInfo();
  const hasDiscount = discountInfo.hasDiscount;

  const getDiscountedPrice = (price: number) => {
    return hasDiscount ? price * (1 - discountInfo.percent) : price;
  };

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

  const currentTotalDist = Object.values(distributions).reduce((a: number, b: number) => a + b, 0);
  const isDistValid = currentTotalDist === totalTokens && totalTokens > 0;

  const totalCost = selectedPackages.reduce((acc, pkg) => {
    return acc + (getDiscountedPrice(pkg.retail_price) * (distributions[pkg._id] || 0));
  }, 0);

  const nextStep = () => {
    if (step === 1 && totalTokens > 0) setStep(2);
    else if (step === 2 && selectedPackages.length > 0) setStep(3);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare payload
      const discountInfo = getDiscountInfo();
      const packagesPayload = selectedPackages.filter(p => distributions[p._id] > 0).map(pkg => ({
        name: pkg.name,
        region: pkg.region,
        quantity: distributions[pkg._id],
        price: pkg.retail_price,
        total: getDiscountedPrice(pkg.retail_price) * distributions[pkg._id]
      }));

      // Try to get partner info from local storage (best effort)
      let partnerInfo = { name: 'Partner', email: 'Unknown', role: 'Partner' };
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          partnerInfo = {
            name: user.username || user.email,
            email: user.email,
            role: user.role
          };
        }
      } catch (e) {
        // Ignore parsing errors
      }

      await axios.post(`${API_BASE}/request-inventory`, {
        totalTokens,
        totalAmount: totalCost, // totalCost is already calculated with discounts
        discountLabel: discountInfo.hasDiscount ? discountInfo.label : null,
        packages: packagesPayload,
        partnerInfo
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please make sure the backend is running and try again.');
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

                {hasDiscount && (
                  <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs py-3 px-4 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                    <Percent size={14} />
                    <span className="font-medium">Volume discount applied! You're saving {discountInfo.label} on all retail prices.</span>
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
                    {totalTokens > 0 && totalTokens < DISCOUNT_TIER_1.threshold && (
                      <p className="text-xs text-orange-400 mt-2">💡 Order {DISCOUNT_TIER_1.threshold}+ tokens to unlock 5% discount!</p>
                    )}
                    {totalTokens >= DISCOUNT_TIER_1.threshold && totalTokens < DISCOUNT_TIER_2.threshold && (
                      <p className="text-xs text-emerald-400 mt-2">🎉 5% discount applied! Order {DISCOUNT_TIER_2.threshold}+ tokens for 10% discount!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Selection by Country */}
          {step === 2 && (
            <div className="space-y-8 animate-in-view py-6">
              <div className="max-w-4xl">
                <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Step 2: Selection</label>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Select your target locations</h3>
                <p className="text-slate-500 text-sm mb-6">Choose packages to add to your inventory request. Rates are per token.</p>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by country, region, or package name..."
                    className="w-full bg-[#171717] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Packages Table */}
                <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-semibold w-16 text-center">Select</th>
                          <th className="px-6 py-4 font-semibold">Package Details</th>
                          <th className="px-6 py-4 font-semibold">Specs</th>
                          <th className="px-6 py-4 font-semibold text-right">Rate (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                              Loading catalog...
                            </td>
                          </tr>
                        ) : filteredPackages.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                              No matching plans found. Try a different search term.
                            </td>
                          </tr>
                        ) : (
                          filteredPackages.map(pkg => {
                            const isSelected = selectedPackages.some(p => p._id === pkg._id);
                            return (
                              <tr
                                key={pkg._id}
                                onClick={() => handleTogglePackage(pkg)}
                                className={`cursor-pointer transition-colors group ${isSelected ? 'bg-orange-500/5 hover:bg-orange-500/10' : 'hover:bg-white/5'}`}
                              >
                                <td className="px-6 py-4 text-center">
                                  <div className={`w-5 h-5 rounded border mx-auto flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-slate-400'}`}>
                                      <Globe size={16} />
                                    </div>
                                    <div>
                                      <div className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{pkg.name}</div>
                                      <div className="text-xs text-slate-500">{pkg.region}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-slate-400">
                                    <span className="text-slate-300">{pkg.data_limit_gb}GB</span> Data
                                    <span className="mx-2 text-slate-600">•</span>
                                    <span className="text-slate-300">{pkg.duration_days} Days</span> Validation
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {hasDiscount ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-slate-500 text-xs line-through">${pkg.retail_price.toFixed(2)}</span>
                                      <span className={`font-bold ${isSelected ? 'text-emerald-400' : 'text-emerald-400'}`}>
                                        ${getDiscountedPrice(pkg.retail_price).toFixed(2)}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className={`font-bold ${isSelected ? 'text-orange-500' : 'text-white'}`}>
                                      ${pkg.retail_price.toFixed(2)}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 text-right text-xs text-slate-500">
                  Selected: <span className="text-white font-bold">{selectedPackages.length}</span> packages
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Distribution & Summary */}
          {step === 3 && (
            <div className="space-y-8 animate-in-view py-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Price List & Distribution Inputs */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Step 3: Distribution</label>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Distribute your tokens</h3>
                    <p className="text-slate-500 text-sm">Allocate {totalTokens} tokens across your selected destinations. Review the price list below.</p>
                  </div>

                  {/* Price List Table */}
                  <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto max-h-[350px] custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-[#1a1a1a] text-slate-400 text-xs uppercase tracking-wider">
                            <th className="px-4 py-3 font-semibold">Package</th>
                            <th className="px-4 py-3 font-semibold">Region</th>
                            <th className="px-4 py-3 font-semibold text-center">Data</th>
                            <th className="px-4 py-3 font-semibold text-center">Days</th>
                            <th className="px-4 py-3 font-semibold text-right">Rate</th>
                            <th className="px-4 py-3 font-semibold text-center">Quantity</th>
                            <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {selectedPackages.map(pkg => {
                            const quantity = distributions[pkg._id] || 0;
                            const subtotal = pkg.retail_price * quantity;
                            return (
                              <tr key={pkg._id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                                      <Package size={14} />
                                    </div>
                                    <span className="text-white font-medium text-sm">{pkg.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">{pkg.region}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-white text-sm font-medium">{pkg.data_limit_gb}GB</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-slate-300 text-sm">{pkg.duration_days}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {hasDiscount ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-slate-500 text-[10px] line-through">${pkg.retail_price.toFixed(2)}</span>
                                      <span className="text-emerald-400 font-bold text-sm">${getDiscountedPrice(pkg.retail_price).toFixed(2)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-orange-500 font-bold text-sm">${pkg.retail_price.toFixed(2)}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="number"
                                    value={distributions[pkg._id] || ''}
                                    placeholder="0"
                                    min="0"
                                    onChange={(e) => handleDistChange(pkg._id, parseInt(e.target.value) || 0)}
                                    className="w-20 bg-black/40 border border-white/10 rounded-lg py-2 px-2 text-center text-white text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                                  />
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={`font-bold text-sm ${quantity > 0 ? (hasDiscount ? 'text-emerald-400' : 'text-white') : 'text-slate-600'}`}>
                                    ${(getDiscountedPrice(pkg.retail_price) * quantity).toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${currentTotalDist === totalTokens ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                    <span className="text-sm font-bold uppercase tracking-widest">Remaining to assign:</span>
                    <span className="text-xl font-display font-bold">{totalTokens - (currentTotalDist as number)}</span>
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
                            <div className={`w-1.5 h-1.5 ${hasDiscount ? 'bg-emerald-400' : 'bg-orange-500'} rounded-full`} />
                            {pkg.name} ({distributions[pkg._id]})
                          </span>
                          <span className={`font-medium ${hasDiscount ? 'text-emerald-400' : 'text-white'}`}>${(getDiscountedPrice(pkg.retail_price) * distributions[pkg._id]).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-400 text-sm">Total Tokens</span>
                          <span className="text-xl text-white font-display font-bold">{totalTokens}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Amount</span>
                          <span className={`text-4xl font-display font-bold ${hasDiscount ? 'text-emerald-400' : 'text-orange-500'}`}>${totalCost.toLocaleString()}</span>
                        </div>
                        {hasDiscount && (
                          <div className="mt-3 flex items-center justify-end gap-2 text-emerald-400 text-xs">
                            <Percent size={12} />
                            <span>{discountInfo.label} volume discount applied</span>
                          </div>
                        )}
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