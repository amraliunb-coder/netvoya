import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User,
  Lock,
  Mail,
  Smartphone,
  Tag,
  Zap,
  ShoppingBag,
  Percent,
  ChevronRight,
  LogOut,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import Button from './ui/Button';
import axios from 'axios';
import { registerUser, loginUser } from '../services/api';

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

interface ClientPortalProps {
  agencyRef?: string;
  onBackToMain?: () => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ agencyRef, onBackToMain }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('client_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Affiliate validation state
  const [affiliateValid, setAffiliateValid] = useState<boolean | null>(null); // null = loading
  const [affiliateAgencyName, setAffiliateAgencyName] = useState<string>('');
  const [affiliateAgencyId, setAffiliateAgencyId] = useState<string>('');

  // Packages & Token Selection state
  const [allPackages, setAllPackages] = useState<EsimPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  
  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  useEffect(() => {
    if (!agencyRef || agencyRef.trim() === '') {
      setAffiliateValid(false);
      return;
    }
    validateAffiliate();
    fetchPackages();
  }, [agencyRef]);

  const validateAffiliate = async () => {
    try {
      const res = await axios.get(`${API_BASE}/validate-affiliate/${agencyRef}`);
      if (res.data?.valid) {
        setAffiliateValid(true);
        setAffiliateAgencyName(res.data.agencyName || agencyRef);
        if (res.data.agencyId) setAffiliateAgencyId(res.data.agencyId);
      } else {
        setAffiliateValid(false);
      }
    } catch {
      setAffiliateValid(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const res = await axios.get(`${API_BASE}/client-packages`);
      if (res.data && res.data.packages) {
        setAllPackages(res.data.packages);
      }
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const usernameClean = authUsername || authEmail.split('@')[0] || `user_${Date.now()}`;
        const res = await registerUser({
          username: usernameClean,
          email: authEmail,
          password: authPassword,
          firstName: authFirstName,
          phone: authPhone,
          role: 'client',
          referredByAgency: agencyRef
        });

        if (res.user) {
          const userObj = { ...res.user, phone: authPhone, firstName: authFirstName };
          setCurrentUser(userObj);
          localStorage.setItem('client_user', JSON.stringify(userObj));
        }
      } else {
        const res = await loginUser({ email: authEmail, password: authPassword });
        if (res.user) {
          setCurrentUser(res.user);
          localStorage.setItem('client_user', JSON.stringify(res.user));
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('client_user');
  };

  const handleQuantityChange = (pkgId: string, change: number) => {
    setQuantities(prev => {
      const current = prev[pkgId] || 0;
      const next = Math.max(0, current + change);
      if (next === 0) {
        const updated = { ...prev };
        delete updated[pkgId];
        return updated;
      }
      return { ...prev, [pkgId]: next };
    });
  };

  // ── Destination Flag & Search Helpers ─────────────────────────────────────
  const countryFlags: { [key: string]: string } = {
    'Egypt': '🇪🇬',
    'Saudi Arabia': '🇸🇦',
    'Jordan': '🇯🇴',
    'Italy': '🇮🇹',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'Turkey': '🇹🇷',
    'United Arab Emirates': '🇦🇪',
    'UAE': '🇦🇪',
    'Global': '🌐',
    'Europe': '🇪🇺',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Spain': '🇪🇸',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'China': '🇨🇳',
    'Thailand': '🇹🇭',
    'Vietnam': '🇻🇳',
    'Greece': '🇬🇷',
    'Switzerland': '🇨🇭'
  };

  const getCountryFlag = (countryName: string) => {
    return countryFlags[countryName] || countryFlags[countryName.trim()] || '📍';
  };

  // Get all unique sorted countries/regions available in packages
  const availableCountries = Array.from(new Set(allPackages.map(p => p.region)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  // Determine actual available popular countries
  const popularCountries = [
    'Egypt',
    'Saudi Arabia',
    'Jordan',
    'Italy',
    'United States',
    'United Kingdom',
    'Turkey',
    'United Arab Emirates',
    'Europe',
    'Global'
  ].map(name => {
    // try direct or USA/UK translations
    const matched = availableCountries.find(c => {
      const cLower = c.toLowerCase();
      const nLower = name.toLowerCase();
      return cLower === nLower || 
             (nLower === 'united states' && (cLower === 'usa' || cLower === 'united states of america')) ||
             (nLower === 'united kingdom' && (cLower === 'uk' || cLower === 'gb'));
    });
    return matched || null;
  }).filter((c): c is string => c !== null);

  // Filter countries matching search query
  const searchedCountries = countrySearchQuery.trim() === ''
    ? []
    : availableCountries.filter(c => c.toLowerCase().includes(countrySearchQuery.toLowerCase()));

  // Filter plans inside selected country
  const filteredPackages = allPackages.filter(pkg => {
    const matchesCountry = selectedCountry ? pkg.region === selectedCountry : false;
    const matchesPlanSearch = searchTerm.trim() === '' || 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.data_limit_gb.toString().includes(searchTerm) ||
      pkg.duration_days.toString().includes(searchTerm);
    return matchesCountry && matchesPlanSearch;
  });

  // Calculate totals
  const selectedItems = allPackages.filter(p => (quantities[p._id] || 0) > 0);
  const totalTokens = (Object.values(quantities) as number[]).reduce((sum, q) => sum + q, 0);

  // Client affiliate pricing calculation (10% special affiliate discount off retail)
  const DISCOUNT_RATE = 0.10; // 10% discount for client affiliate portal
  
  const calculatePackagePrices = (pkg: EsimPackage) => {
    const originalPrice = pkg.retail_price;
    const discountedPrice = originalPrice * (1 - DISCOUNT_RATE);
    return { originalPrice, discountedPrice };
  };

  const totalAmount = selectedItems.reduce((sum, pkg) => {
    const { discountedPrice } = calculatePackagePrices(pkg);
    return sum + (discountedPrice * (quantities[pkg._id] || 0));
  }, 0);

  const originalTotalAmount = selectedItems.reduce((sum, pkg) => {
    return sum + (pkg.retail_price * (quantities[pkg._id] || 0));
  }, 0);

  const totalSavings = originalTotalAmount - totalAmount;

  const handleSubmitRequest = async () => {
    if (!currentUser) return;
    if (totalTokens === 0 || selectedItems.length === 0) {
      setSubmitError('Please select at least 1 eSIM package token.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const packagesPayload = selectedItems.map(pkg => {
        const { discountedPrice } = calculatePackagePrices(pkg);
        const qty = quantities[pkg._id];
        return {
          name: pkg.name,
          region: pkg.region,
          quantity: qty,
          price: discountedPrice,
          total: discountedPrice * qty
        };
      });

      const response = await axios.post(`${API_BASE}/client-request-inventory`, {
        totalTokens,
        totalAmount,
        discountLabel: '10% Agency Affiliate Discount',
        packages: packagesPayload,
        clientInfo: {
          name: currentUser.firstName || currentUser.username || 'Client',
          email: currentUser.email,
          phone: currentUser.phone || ''
        },
        agencyInfo: {
          name: affiliateAgencyName || agencyRef || 'Partner Agency',
          id: affiliateAgencyId || agencyRef,
          code: agencyRef
        }
      });

      if (response.data && response.data.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(response.data?.message || 'Failed to submit request.');
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetSelection = () => {
    setQuantities({});
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // ── Access Gate ─────────────────────────────────────────────────────────────
  // 1. Still validating — show a spinner
  if (affiliateValid === null) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-sky-500/30 border-t-sky-400 animate-spin" />
          <p className="text-slate-400 text-sm">Verifying your access link…</p>
        </div>
      </div>
    );
  }

  // 2. Invalid or no code — access denied
  if (!affiliateValid) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.15)]">
            <Lock size={36} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Access Restricted</h1>
          <p className="text-slate-400 mb-6 leading-relaxed text-sm">
            This portal is exclusively available to clients invited by a verified partner agency.
            The link you used is either invalid or has expired.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Valid link format</p>
            <code className="text-sky-400 text-xs break-all">
              https://netvoya.com/?ref=<span className="text-emerald-400">YOUR_AGENCY_CODE</span>
            </code>
          </div>
          <button
            onClick={onBackToMain}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back to Main Site
          </button>
        </div>
      </div>
    );
  }

  // 3. Valid — render the portal (use verified agencyName if available)
  const resolvedAgencyName = affiliateAgencyName || agencyRef;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white selection:bg-sky-500/30 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToMain}>
            <img
              src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png"
              alt="NetVoya"
              className="h-12 w-auto object-contain"
            />
            <span className="hidden sm:inline-block bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-500/20">
              Client Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-400">Signed in as</div>
                  <div className="text-sm font-semibold text-white">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Button variant="outline" className="!py-1.5 !px-3 text-xs" onClick={onBackToMain}>
                Return to Main Site
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Agency Partner Banner */}
      <div className="bg-gradient-to-r from-sky-900/60 via-indigo-900/40 to-cyan-900/60 border-b border-sky-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-sky-300 font-semibold">Special Client Affiliate Rates</div>
              <h2 className="text-sm font-bold text-white">
                Exclusive eSIM Access via <span className="text-sky-400 capitalize">{resolvedAgencyName || 'Partner Agency'}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Percent size={14} />
            <span>10% Discount Applied to All Token Packages</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* If user is NOT logged in, show sleek B2C Auth Modal / Card */}
        {!currentUser ? (
          <div className="max-w-md mx-auto my-12 bg-gradient-to-b from-[#141b2d] to-[#0d1322] border border-sky-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-sky-400">
              <Globe size={120} />
            </div>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 mx-auto mb-4 border border-sky-500/20">
                <User size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to NetVoya</h3>
              <p className="text-slate-400 text-xs">
                Sign in or create your account to unlock discounted global eSIM packages.
              </p>

              {/* Mode Toggle */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mt-6">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'signup' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {authError && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={authFirstName}
                        onChange={(e) => setAuthFirstName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Optional)</label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-3 top-3 text-slate-500" />
                      <input
                        type="tel"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/25 mt-6 disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In & Access eSIMs' : 'Create Account & Continue'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : submitSuccess ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto my-12 bg-[#141b2d] border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in-view">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/30">
              <CheckCircle2 size={44} />
            </div>

            <div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                Request Submitted
              </span>
              <h2 className="text-2xl font-bold text-white mt-3">eSIM Request Received!</h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto mt-2">
                We have sent an automated confirmation email to <strong className="text-sky-400">{currentUser.email}</strong>.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Total eSIM Tokens:</span>
                <span className="text-white font-bold">{totalTokens} Tokens</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Total Amount:</span>
                <span className="text-sky-400 font-bold">${totalAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Attributed Agency:</span>
                <span className="text-emerald-400 capitalize">{resolvedAgencyName || 'Partner'}</span>
              </div>
            </div>

            <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-xs text-sky-300 text-left">
              <strong>What happens next?</strong> NetVoya administrators have been notified to issue your eSIM tokens. Once ready, your QR activation codes will be delivered directly to your inbox.
            </div>

            <button
              onClick={resetSelection}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Main Package & Token Selection View */
          <div className="space-y-8">
            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-3">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Grid Layout: Packages/Destination Select + Order Summary Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Selection Area (Left 8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* ── STATE 1: Choose Destination ──────────────────────────────── */}
                {!selectedCountry ? (
                  <div className="space-y-8">
                    {/* Hero Heading */}
                    <div className="text-center py-6">
                      <h1 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">Where are you traveling next?</h1>
                      <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                        Search global countries or choose a popular region to view local eSIM packages.
                      </p>
                    </div>

                    {/* Destination Search Box */}
                    <div className="max-w-xl mx-auto relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Search size={20} />
                      </div>
                      <input
                        type="text"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        placeholder="Search country or region (e.g. USA, Egypt...)"
                        className="w-full bg-[#141b2d] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 shadow-lg transition-all"
                      />
                    </div>

                    {/* Search Results / Auto-complete list */}
                    {countrySearchQuery.trim() !== '' ? (
                      <div className="space-y-3 max-w-xl mx-auto">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold px-1">Search Results</p>
                        {searchedCountries.length === 0 ? (
                          <div className="p-8 text-center bg-[#141b2d] border border-white/5 rounded-2xl text-slate-500 text-sm">
                            No matching destinations found.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {searchedCountries.map(country => (
                              <button
                                key={country}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setCountrySearchQuery('');
                                }}
                                className="flex items-center gap-3 px-4 py-3 bg-[#141b2d] hover:bg-[#1b253b] border border-white/5 hover:border-sky-500/30 rounded-xl text-left text-sm text-white transition-all group"
                              >
                                <span className="text-2xl transition-transform group-hover:scale-110">{getCountryFlag(country)}</span>
                                <span className="font-semibold">{country}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Popular Destinations Grid */
                      <div className="space-y-4">
                        <h3 className="text-xs text-slate-500 uppercase tracking-widest font-semibold px-1">Popular Destinations</h3>
                        {loadingPackages ? (
                          <div className="text-center py-12 bg-[#141b2d] border border-white/5 rounded-3xl">
                            <RefreshCw size={24} className="animate-spin text-sky-400 mx-auto mb-2" />
                            <p className="text-slate-500 text-xs">Loading destinations…</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {popularCountries.map(country => (
                              <button
                                key={country}
                                onClick={() => setSelectedCountry(country)}
                                className="flex flex-col items-center justify-center p-5 bg-[#141b2d] hover:bg-[#1b253b] border border-white/5 hover:border-sky-500/30 rounded-2xl text-center transition-all group hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/5"
                              >
                                <span className="text-4xl mb-3 transition-transform group-hover:scale-110 duration-300">
                                  {getCountryFlag(country)}
                                </span>
                                <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                                  {country}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  
                  // ── STATE 2: Show plans for Selected Country ─────────────────
                  <div className="space-y-6">
                    {/* Back header navigation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedCountry(null);
                            setSearchTerm('');
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                          title="Back to destinations"
                        >
                          <ArrowRight size={16} className="rotate-180" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getCountryFlag(selectedCountry)}</span>
                            <h2 className="text-2xl font-bold text-white font-display">{selectedCountry} eSIM Plans</h2>
                          </div>
                          <p className="text-slate-400 text-xs mt-0.5">Select eSIM token packages for this destination.</p>
                        </div>
                      </div>

                      {/* Filter plans search */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Filter plans (e.g. 10GB)..."
                          className="bg-[#141b2d] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* Plan Cards Grid */}
                    {filteredPackages.length === 0 ? (
                      <div className="text-center py-16 bg-[#141b2d] border border-white/5 rounded-3xl">
                        <Globe size={36} className="text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-300 text-sm font-semibold">No plans match your filters</p>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-3 text-xs text-sky-400 hover:underline"
                        >
                          Clear plan filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPackages.map(pkg => {
                          const { originalPrice, discountedPrice } = calculatePackagePrices(pkg);
                          const currentQty = quantities[pkg._id] || 0;

                          return (
                            <div
                              key={pkg._id}
                              className={`bg-[#141b2d] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
                                currentQty > 0
                                  ? 'border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.15)] bg-gradient-to-b from-[#141b2d] to-[#10182b]'
                                  : 'border-white/5 hover:border-white/15'
                              }`}
                            >
                              <div>
                                {/* Package Header */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <div>
                                    <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 flex-shrink-0">
                                    <Globe size={16} />
                                  </div>
                                </div>

                                {/* Specs */}
                                <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-2.5 rounded-xl border border-white/5 mb-4">
                                  <div>
                                    <span className="text-slate-500 block text-[10px]">Data Allowance</span>
                                    <span className="font-semibold text-white">{pkg.data_limit_gb} GB Data</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block text-[10px]">Validity</span>
                                    <span className="font-semibold text-white">{pkg.duration_days} Days</span>
                                  </div>
                                </div>

                                {/* Pricing */}
                                <div className="flex items-baseline gap-2 mb-4">
                                  <span className="text-xl font-bold text-sky-400">${discountedPrice.toFixed(2)}</span>
                                  <span className="text-xs text-slate-500 line-through">${originalPrice.toFixed(2)}</span>
                                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold">
                                    Save 10%
                                  </span>
                                </div>
                              </div>

                              {/* Token Quantity Stepper */}
                              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">Select Tokens:</span>
                                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
                                  <button
                                    onClick={() => handleQuantityChange(pkg._id, -1)}
                                    disabled={currentQty === 0}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center text-xs font-bold text-white">{currentQty}</span>
                                  <button
                                    onClick={() => handleQuantityChange(pkg._id, 1)}
                                    className="w-7 h-7 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-sm"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar (Right 4 cols) */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 bg-[#141b2d] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <ShoppingBag size={20} className="text-sky-400" />
                    <h3 className="text-lg font-bold text-white">Order Summary</h3>
                  </div>

                  {selectedItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No packages selected yet.<br />Use the stepper to add tokens.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1 font-mono text-xs">
                      {selectedItems.map(pkg => {
                        const { discountedPrice } = calculatePackagePrices(pkg);
                        const qty = quantities[pkg._id];
                        return (
                          <div key={pkg._id} className="flex justify-between items-center bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <div>
                              <div className="text-white font-semibold truncate max-w-[150px]">{pkg.name}</div>
                              <div className="text-[10px] text-slate-500">{qty} token{qty > 1 ? 's' : ''} × ${discountedPrice.toFixed(2)}</div>
                            </div>
                            <div className="text-sky-400 font-bold">${(discountedPrice * qty).toFixed(2)}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Tokens:</span>
                      <span className="text-white font-bold">{totalTokens} Tokens</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Original Retail Price:</span>
                      <span className="line-through">${originalTotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Affiliate Discount Savings:</span>
                      <span>-${totalSavings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                      <span>Total Payee Amount:</span>
                      <span className="text-sky-400">${totalAmount.toFixed(2)} USD</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitRequest}
                    disabled={submitting || totalTokens === 0}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Token Request</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                    <ShieldCheck size={14} className="text-sky-400" />
                    <span>Automated notification sent to client & admin</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;
