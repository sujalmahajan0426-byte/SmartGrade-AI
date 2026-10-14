import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdNotifications, MdNotificationsNone, MdAssignment, MdCheckCircle, MdDoneAll } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/notifications');
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setNotifications(data.data);
                const unread = data.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (err) {
            // Local fallback if backend is offline
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 10 seconds for new assignments/notifications
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = async () => {
        try {
            await fetch('http://localhost:5001/api/notifications/mark-all-read', { method: 'PATCH' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    };

    const handleNotificationClick = async (notif) => {
        try {
            await fetch(`http://localhost:5001/api/notifications/${notif.id}/read`, { method: 'PATCH' });
            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            // ignore
        }
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Icon Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-brand-blue hover:bg-blue-50 transition-colors focus:outline-none"
                title="Notifications"
            >
                {unreadCount > 0 ? (
                    <MdNotifications className="w-6 h-6 text-brand-blue" />
                ) : (
                    <MdNotificationsNone className="w-6 h-6" />
                )}

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {notifications.length > 0 && unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs font-semibold text-brand-blue hover:text-blue-700 flex items-center gap-1 transition-colors"
                                >
                                    <MdDoneAll className="w-3.5 h-3.5" /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                                            !notif.isRead ? 'bg-blue-50/40' : ''
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl mt-0.5 ${
                                            !notif.isRead ? 'bg-blue-100 text-brand-blue' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <MdAssignment className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className={`text-xs font-bold truncate ${
                                                    !notif.isRead ? 'text-slate-900' : 'text-slate-700'
                                                }`}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] text-slate-400 mt-1 block">
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <MdNotificationsNone className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-xs font-medium">No new notifications</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">When professors create assignments, you'll see them here!</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                                <span className="text-[11px] text-slate-500 font-medium">
                                    Click any notification to submit directly
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
