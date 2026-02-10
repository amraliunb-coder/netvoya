import React, { useState, useEffect, useRef } from 'react';
import {
    Bell,
    X,
    CheckCircle2,
    Info,
    AlertTriangle,
    AlertCircle,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import axios from 'axios';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
}

const NotificationCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

    const getPartnerId = () => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        return user?.id;
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const partnerId = getPartnerId();
            if (!partnerId) return;

            const res = await axios.get(`${API_BASE}/notifications`, {
                params: { userId: partnerId }
            });

            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (err) {
            console.error('Failed to load notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const res = await axios.patch(`${API_BASE}/notifications/${id}/read`);
            if (res.data.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-green-400" size={18} />;
            case 'warning': return <AlertTriangle className="text-yellow-400" size={18} />;
            case 'error': return <AlertCircle className="text-red-400" size={18} />;
            default: return <Info className="text-blue-400" size={18} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 transition-colors rounded-full hover:bg-white/5 ${isOpen ? 'text-orange-500 bg-white/5' : 'text-slate-400 hover:text-white'}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-[#0A0A0A] text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-[360px] bg-[#171717] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200 origin-top-right">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h3 className="font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] uppercase font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {loading && notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">
                                <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                                <p className="text-sm">Fetching notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell size={24} className="opacity-20" />
                                </div>
                                <p className="text-sm">All caught up!</p>
                                <p className="text-xs mt-1">No new notifications.</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => !n.isRead && markAsRead(n._id)}
                                        className={`px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-orange-500/[0.02]' : ''}`}
                                    >
                                        {!n.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                                        )}
                                        <div className="flex gap-4">
                                            <div className="mt-0.5">{getIcon(n.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h4 className={`text-sm font-semibold truncate ${!n.isRead ? 'text-white' : 'text-slate-400'}`}>
                                                        {n.title}
                                                    </h4>
                                                    <span className="text-[10px] text-slate-600 whitespace-nowrap font-mono">
                                                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className={`text-xs leading-relaxed line-clamp-2 ${!n.isRead ? 'text-slate-300' : 'text-slate-500'}`}>
                                                    {n.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 bg-white/[0.01] text-center">
                        <button className="text-[11px] uppercase font-bold text-slate-500 hover:text-orange-500 transition-colors tracking-wider flex items-center justify-center gap-1.5 mx-auto">
                            View All History
                            <ExternalLink size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
