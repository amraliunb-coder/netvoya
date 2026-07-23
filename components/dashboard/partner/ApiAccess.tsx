import React, { useState, useEffect } from 'react';
import { Key, Copy, CheckCircle, ExternalLink, Terminal, Link2, RefreshCw, Share2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';
const SITE_URL = (import.meta as any).env?.VITE_SITE_URL || 'https://netvoya.com';

const ApiAccess: React.FC = () => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [affiliateCode, setAffiliateCode] = useState<string>('');
    const [affiliateLoading, setAffiliateLoading] = useState(true);
    const [affiliateRegenerating, setAffiliateRegenerating] = useState(false);

    // Get partner_id from localStorage (set during login)
    const getPartnerId = () => {
        try {
            const stored = localStorage.getItem('partner_user') || localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed._id || parsed.id || null;
            }
        } catch { /* ignore */ }
        return null;
    };

    useEffect(() => {
        fetchAffiliateCode();
    }, []);

    const fetchAffiliateCode = async () => {
        const partnerId = getPartnerId();
        if (!partnerId) { setAffiliateLoading(false); return; }
        try {
            setAffiliateLoading(true);
            const res = await axios.get(`${API_BASE}/partner/settings?partner_id=${partnerId}`);
            if (res.data?.settings?.affiliateCode) {
                setAffiliateCode(res.data.settings.affiliateCode);
            }
        } catch (err) {
            console.error('Failed to load affiliate code', err);
        } finally {
            setAffiliateLoading(false);
        }
    };

    const regenerateAffiliateCode = async () => {
        const partnerId = getPartnerId();
        if (!partnerId) return;
        try {
            setAffiliateRegenerating(true);
            const res = await axios.post(`${API_BASE}/partner/affiliate/generate`, { partner_id: partnerId });
            if (res.data?.affiliateCode) {
                setAffiliateCode(res.data.affiliateCode);
            }
        } catch (err) {
            console.error('Failed to regenerate affiliate code', err);
        } finally {
            setAffiliateRegenerating(false);
        }
    };

    const affiliateLink = affiliateCode ? `${SITE_URL}/?ref=${affiliateCode}` : '';

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(type);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // In a real application, these would be fetched from the backend.
    const apiCredentials = {
        clientId: 'pk_live_8f7b3c9e2d1a4f6g',
        clientSecret: 'sk_live_v2_9x8y7z6w5v4u3t2s1r0q'
    };

    return (
        <div className="space-y-6 animate-in-view">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">API Access &amp; Integrations</h2>
                    <p className="text-slate-500 text-sm">Manage your API credentials and client affiliate link.</p>
                </div>
                <button
                    onClick={() => window.open('/sahara_api_documentation.md', '_blank')}
                    className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 px-4 py-2 rounded-lg font-medium transition-all"
                >
                    <ExternalLink size={16} />
                    View Documentation
                </button>
            </div>

            {/* ── Affiliate Link Card ──────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-sky-950/40 to-[#171717] border border-sky-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Link2 size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Share2 size={18} className="text-sky-400" />
                            <h3 className="font-semibold text-white">Client Affiliate Link</h3>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mb-5 ml-6">
                        Share this unique link with your clients. Only those with this link can access the discounted eSIM portal.
                    </p>

                    {affiliateLoading ? (
                        <div className="flex items-center gap-2 text-slate-500 text-sm py-3">
                            <div className="w-4 h-4 rounded-full border-2 border-sky-500/30 border-t-sky-400 animate-spin" />
                            Loading your affiliate link…
                        </div>
                    ) : affiliateCode ? (
                        <>
                            {/* Full link field */}
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="text"
                                    readOnly
                                    value={affiliateLink}
                                    className="w-full bg-black/40 border border-sky-500/20 rounded-lg py-2.5 px-4 text-sky-300 font-mono text-sm focus:outline-none"
                                />
                                <button
                                    onClick={() => copyToClipboard(affiliateLink, 'affiliate')}
                                    className="flex-shrink-0 p-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg text-sky-400 hover:text-sky-300 transition-colors"
                                    title="Copy link"
                                >
                                    {copiedKey === 'affiliate' ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                </button>
                            </div>

                            {/* Code row + regenerate */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Your code:</span>
                                    <code className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                                        {affiliateCode}
                                    </code>
                                </div>
                                <button
                                    onClick={regenerateAffiliateCode}
                                    disabled={affiliateRegenerating}
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                    title="Generate a new code (old link will stop working)"
                                >
                                    <RefreshCw size={13} className={affiliateRegenerating ? 'animate-spin' : ''} />
                                    {affiliateRegenerating ? 'Regenerating…' : 'Regenerate'}
                                </button>
                            </div>

                            {copiedKey === 'affiliate' && (
                                <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle size={12} /> Link copied to clipboard!
                                </p>
                            )}

                            <div className="mt-4 text-xs text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                <strong>Note:</strong> Regenerating your code will immediately invalidate the old link. Any clients using the old link will lose access.
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500 text-sm">
                            Unable to load affiliate code. Please refresh the page or contact support.
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Credentials Card */}
                <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden p-6 relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Key size={120} />
                    </div>
                    <h3 className="font-semibold text-white mb-6 relative z-10">Production Credentials</h3>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Client ID</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    readOnly
                                    value={apiCredentials.clientId}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-emerald-400 font-mono text-sm focus:outline-none"
                                />
                                <button
                                    onClick={() => copyToClipboard(apiCredentials.clientId, 'id')}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    {copiedKey === 'id' ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Client Secret</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="password"
                                    readOnly
                                    value={apiCredentials.clientSecret}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-slate-300 font-mono text-sm focus:outline-none"
                                />
                                <button
                                    onClick={() => copyToClipboard(apiCredentials.clientSecret, 'secret')}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    {copiedKey === 'secret' ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 text-xs text-orange-400 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                            <strong>Warning:</strong> Never share your Client Secret. If comprised, you can regenerate it, which will instantly revoke the old one.
                        </div>
                    </div>
                </div>

                {/* Quick Start Card */}
                <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Terminal size={18} className="text-orange-500" /> API Quick Start
                        </h3>
                    </div>
                    <div className="p-6 flex-1 bg-black/40 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed">
                        <p className="text-slate-500 mb-2">// 1. Get an access token</p>
                        <p><span className="text-pink-400">curl</span> -X POST https://netvoya-backend.vercel.app/api/auth/token \</p>
                        <p className="pl-4">-H <span className="text-green-400">"Content-Type: application/json"</span> \</p>
                        <p className="pl-4">-d <span className="text-green-400">'{'{\"client_id\": \"YOUR_ID\", \"client_secret\": \"YOUR_SECRET\"}'}' </span></p>
                        <br />
                        <p className="text-slate-500 mb-2">// 2. Assign an eSIM to a user</p>
                        <p><span className="text-pink-400">curl</span> -X POST https://netvoya-backend.vercel.app/api/inventory/[BUCKET_ID]/assign \</p>
                        <p className="pl-4">-H <span className="text-green-400">"Authorization: Bearer YOUR_TOKEN"</span> \</p>
                        <p className="pl-4">-d <span className="text-green-400">'{'{\"name\": \"Customer Name\", \"email\": \"customer@email.com\"}'}' </span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiAccess;
