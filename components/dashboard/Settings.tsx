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

      {/* Webhook Configuration Section (Existing) */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Webhook size={18} className="text-orange-500" />
            Webhook Endpoints
          </h3>
          <p className="text-slate-500 text-xs mt-1">Configure URLs to receive real-time notifications from the platform.</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs uppercase text-slate-500 font-mono mb-2">Order Status Updated</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="https://your-domain.com/webhooks/netvoya"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50"
              />
              <button
                onClick={handleSaveWebhook}
                disabled={saving}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/5 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <RefreshCw className="animate-spin" size={14} /> : null}
                Save Webhook
              </button>
            </div>
            {saveSuccess && <p className="text-green-400 text-[10px] mt-2 flex items-center gap-1 animate-fade-in"><CheckCircle2 size={12} /> Webhook URL saved successfully!</p>}
          </div>
        </div>
      </div>

      {/* Password & Security Section */}
      <PasswordChangeSection />

    </div>
  );
};

// Extracted Password Change Component for clarity
const PasswordChangeSection: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      setError('User session expired. Please login again.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setUpdating(true);
      const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';
      const res = await axios.patch(`${API_BASE}/user/change-password`, {
        userId,
        currentPassword,
        newPassword
      });

      if (res.data.success) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Alert the user that they should keep their new password safe
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02]">
        <h3 className="font-bold text-white flex items-center gap-2">
          <ShieldAlert size={18} className="text-orange-500" />
          Password & Security
        </h3>
        <p className="text-slate-500 text-sm mt-1">Update your login credentials to keep your account secure.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500">Confirm New</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-400/10 p-3 rounded-lg border border-green-400/20">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={updating}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {updating ? <RefreshCw className="animate-spin" size={16} /> : <ShieldAlert size={16} />}
            {updating ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;