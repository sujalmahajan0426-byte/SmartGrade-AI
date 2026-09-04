import React from 'react';
import { notifications } from '../../data/mockParentData';
import { MdWarning, MdNotifications, MdCheckCircle, MdInfo } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function Notifications() {
    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    const getIcon = (type) => {
        switch (type) {
            case 'critical': return <MdWarning className="w-6 h-6 text-brand-red" />;
            case 'warning': return <MdWarning className="w-6 h-6 text-brand-yellow" />;
            case 'success': return <MdCheckCircle className="w-6 h-6 text-brand-green" />;
            case 'info': default: return <MdInfo className="w-6 h-6 text-brand-blue" />;
        }
    };

    const getBgClass = (type, read) => {
        if (read) return 'bg-white border-slate-200';
        switch (type) {
            case 'critical': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'success': return 'bg-green-50 border-green-200';
            case 'info': default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative pb-10 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-800">
                    <MdNotifications className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
                    <p className="text-slate-500">Stay updated on Arjun's activities and alerts from SmartGrade AI.</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`flex items-start gap-4 p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md
              ${getBgClass(notif.type, notif.read)}`}
                    >
                        <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm border
              ${notif.read ? 'border-slate-100' : 'border-transparent'}`}>
                            {getIcon(notif.type)}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-4 mb-1">
                                <p className={`font-semibold text-lg ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                    {notif.text}
                                </p>
                                <span className="text-sm font-medium text-slate-500 whitespace-nowrap">{notif.time}</span>
                            </div>

                            {!notif.read && (
                                <div className="mt-3 flex gap-3">
                                    <button onClick={handleComingSoon} className="text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors">
                                        View full details
                                    </button>
                                    {notif.type === 'critical' && (
                                        <button onClick={handleComingSoon} className="text-sm font-bold bg-brand-red text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                                            Message Teacher
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}