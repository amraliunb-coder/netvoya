import React, { useState, useEffect } from 'react';
import {
  Key,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  Webhook,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import axios from 'axios';

const SettingsView: React.FC = () => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

  const getPartnerId = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.id;
  };

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const partnerId = getPartnerId();
        if (!partnerId) return;

        const res = await axios.get(`${API_BASE}/partner/settings`, {
          params: { partner_id: partnerId }
        });

        if (res.data.success) {
          setApiKey(res.data.settings.apiKey || '');
          setHasApiKey(res.data.settings.hasApiKey);
          setWebhookUrl(res.data.settings.webhookUrl || '');
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleGenerateKey = async () => {
    const confirmed = hasApiKey
      ? window.confirm('This will invalidate your existing key immediately. Are you sure?')
      : true;
    if (!confirmed) return;

    try {
      setGenerating(true);
      const partnerId = getPartnerId();
      const res = await axios.post(`${API_BASE}/partner/settings/generate-key`, {
        partner_id: partnerId
      });

      if (res.data.success) {
        setApiKey(res.data.apiKey);
        setHasApiKey(true);
        setJustGenerated(true);
        setShowKey(true);
      }
    } catch (err) {
      alert('Failed to generate API key.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveWebhook = async () => {
    try {
      setSaving(true);
      const partnerId = getPartnerId();
      const res = await axios.put(`${API_BASE}/partner/settings/webhook`, {
        partner_id: partnerId,
        webhookUrl
      });

      if (res.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      alert('Failed to save webhook URL.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Loading settings...
      </div>
    );
  }

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

            {!hasApiKey ? (
              <div className="bg-black/30 border border-dashed border-white/10 rounded-xl p-6 text-center">
                <ShieldAlert size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm mb-4">No API key generated yet. Click below to create one.</p>
                <button
                  onClick={handleGenerateKey}
                  disabled={generating}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {generating ? <RefreshCw className="animate-spin" size={16} /> : <Key size={16} />}
                  Generate API Key
                </button>
              </div>
            ) : (
              <>
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

                {justGenerated && (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-3">
                    <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-yellow-200 text-xs">Save this key now. For security, the full key will only be shown this once.</p>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={handleGenerateKey}
                    disabled={generating}
                    className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1.5 font-medium transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={generating ? 'animate-spin' : ''} />
                    Regenerate API Key
                  </button>
                  <p className="text-xs text-slate-500 mt-1">Regenerating will invalidate the existing key immediately.</p>
                </div>
              </>
            )}
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
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end items-center gap-3">
          {saveSuccess && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 size={14} /> Saved!</span>}
          <button
            onClick={handleSaveWebhook}
            disabled={saving}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : null}
            Save Changes
          </button>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;