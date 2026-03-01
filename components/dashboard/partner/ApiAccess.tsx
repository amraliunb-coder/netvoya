import React, { useState } from 'react';
import { Key, Copy, CheckCircle, ExternalLink, Terminal } from 'lucide-react';

const ApiAccess: React.FC = () => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // In a real application, these would be fetched from the backend.
    // We're generating static examples for the partner integration.
    const apiCredentials = {
        clientId: 'pk_live_8f7b3c9e2d1a4f6g',
        clientSecret: 'sk_live_v2_9x8y7z6w5v4u3t2s1r0q'
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(type);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="space-y-6 animate-in-view">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">API Access & Integrations</h2>
                    <p className="text-slate-500 text-sm">Manage your API credentials for back-office eSIM integrations.</p>
                </div>
                <button
                    onClick={() => window.open('/sahara_api_documentation.md', '_blank')}
                    className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 px-4 py-2 rounded-lg font-medium transition-all"
                >
                    <ExternalLink size={16} />
                    View Documentation
                </button>
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
                        <p className="pl-4">-d <span className="text-green-400">'{'{"client_id": "YOUR_ID", "client_secret": "YOUR_SECRET"}'}'</span></p>
                        <br />
                        <p className="text-slate-500 mb-2">// 2. Assign an eSIM to a user</p>
                        <p><span className="text-pink-400">curl</span> -X POST https://netvoya-backend.vercel.app/api/inventory/[BUCKET_ID]/assign \</p>
                        <p className="pl-4">-H <span className="text-green-400">"Authorization: Bearer YOUR_TOKEN"</span> \</p>
                        <p className="pl-4">-d <span className="text-green-400">'{'{"name": "Customer Name", "email": "customer@email.com"}'}'</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiAccess;
