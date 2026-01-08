import React, { useState } from 'react';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Webhook
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = "sk_live_51Mxq...892Kls9";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in-view max-w-4xl">
      
      <div>
        <h2 className="text-2xl font-display font-bold text-white">Platform Settings</h2>
        <p className="text-slate-500 text-sm">Manage API keys, webhooks, and account preferences.</p>
      </div>

      {/* API Configuration */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-orange-500" />
            API Configuration
          </h3>
          <p className="text-slate-500 text-xs mt-1">Use this key to authenticate requests from your application.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Live Secret Key</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type={showKey ? "text" : "password"} 
                  value={apiKey}
                  readOnly
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-slate-300 font-mono text-sm focus:outline-none focus:border-orange-500/50"
                />
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white/5 hover:bg-white/10 text-white px-4 rounded-lg flex items-center gap-2 transition-colors border border-white/5"
              >
                {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-4">
              <button className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1.5 font-medium transition-colors">
                <RefreshCw size={12} />
                Regenerate API Key
              </button>
              <p className="text-xs text-slate-500 mt-1">Regenerating will invalidate the existing key immediately.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
              <Webhook size={16} className="text-orange-500" />
              Webhook Endpoints
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                 <div className="flex-1">
                   <label className="block text-xs uppercase text-slate-500 font-mono mb-1">Order Status Updated</label>
                   <input 
                     type="text" 
                     placeholder="https://your-domain.com/webhooks/netvoya"
                     className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50"
                   />
                 </div>
                 <button className="mt-6 px-4 py-2 bg-white/5 text-slate-300 text-sm rounded-lg hover:bg-white/10 transition-colors">Test</button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
          <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20">
            Save Changes
          </button>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;