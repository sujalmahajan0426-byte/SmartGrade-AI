import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MdDashboard, MdAssignment, MdFeedback, MdTrendingUp,
    MdBadge, MdLanguage, MdPeople, MdAnalytics, MdWarning,
    MdMessage, MdNotifications, MdInsertChartOutlined, MdCalendarToday
} from 'react-icons/md';

const getLinks = (role) => {
    switch (role) {
        case 'student':
            return [
                { path: '/student', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/student/submit', label: 'Submit Assignment', icon: <MdAssignment /> },
                { path: '/student/feedback', label: 'My Feedback', icon: <MdFeedback /> },
                { path: '/student/progress', label: 'My Progress', icon: <MdTrendingUp /> },
                { path: '/student/attendance', label: 'My Attendance', icon: <MdCalendarToday /> },
                { path: '/student/badges', label: 'My Badges', icon: <MdBadge /> },
                { path: '/student/language', label: 'Language Settings', icon: <MdLanguage /> },
            ];
        case 'teacher':
            return [
                { path: '/teacher', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/teacher/assignments', label: 'Assignments', icon: <MdAssignment /> },
                { path: '/teacher/students', label: 'My Students', icon: <MdPeople /> },
                { path: '/teacher/analytics', label: 'Class Analytics', icon: <MdAnalytics /> },
                { path: '/teacher/at-risk', label: 'At-Risk Students', icon: <MdWarning /> },
                { path: '/teacher/reports', label: 'Reports', icon: <MdInsertChartOutlined /> },
            ];
        case 'parent':
            return [
                { path: '/parent', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/parent/progress', label: 'Child Progress', icon: <MdTrendingUp /> },
                { path: '/parent/attendance', label: 'Child Attendance', icon: <MdCalendarToday /> },
                { path: '/parent/feedback', label: 'Recent Feedback', icon: <MdFeedback /> },
                { path: '/parent/notifications', label: 'Notifications', icon: <MdNotifications /> },
                { path: '/parent/message', label: 'Message Teacher', icon: <MdMessage /> },
            ];
        default:
            return [];
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const slideRight = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export default function Sidebar({ role }) {
    const links = getLinks(role);

    const getThemeClass = (isActive) => {
        if (!isActive) return "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200";
        if (role === 'student') return "bg-gradient-to-r from-blue-50 to-indigo-50/30 dark:from-blue-900/40 dark:to-indigo-900/20 text-brand-blue dark:text-blue-400 shadow-sm font-bold border-l-4 border-brand-blue dark:border-blue-400";
        if (role === 'teacher') return "bg-gradient-to-r from-green-50 to-teal-50/30 dark:from-green-900/40 dark:to-teal-900/20 text-brand-green dark:text-green-400 shadow-sm font-bold border-l-4 border-brand-green dark:border-green-400";
        if (role === 'parent') return "bg-gradient-to-r from-orange-50 to-yellow-50/30 dark:from-orange-900/40 dark:to-yellow-900/20 text-orange-600 dark:text-orange-400 shadow-sm font-bold border-l-4 border-orange-500 dark:border-orange-400";
        return "";
    };

    return (
        <aside className="w-64 hidden md:block h-full shrink-0 relative z-10 pt-4">
            <div className="sticky top-[100px] h-[calc(100vh-120px)] p-4 pr-0">
                <div className="glass-panel h-full rounded-2xl rounded-r-none overflow-hidden shadow-sm">
                    <motion.nav 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="p-3 space-y-1.5 mt-2 overflow-y-auto h-full scrollbar-hide"
                    >
                        {links.map((link) => (
                            <motion.div key={link.path} variants={slideRight}>
                                <NavLink
                                    to={link.path}
                                    end={link.path === `/${role}`}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ${getThemeClass(isActive)}`
                                    }
                                >
                                    <span className="text-xl transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                                    <span className="tracking-wide text-sm">{link.label}</span>
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.nav>
                </div>
            </div>
        </aside>
    );
}