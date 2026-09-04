import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { MdAssignmentTurnedIn, MdScore, MdPendingActions, MdBadge } from 'react-icons/md';
import { streakData } from '../../data/mockStudentData';
import { toast } from 'react-toastify';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function StudentDashboard() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resA = await fetch('http://localhost:5001/api/assignments');
                const dataA = await resA.json();
                if (dataA.success) setAssignments(dataA.data);
            } catch (err) {
                console.warn('⚠️ Backend unreachable, using mock data for dashboard.');
                const { assignments: mockAssignments } = await import('../../data/mockStudentData');
                setAssignments(mockAssignments || []);
            }
        };
        fetchData();
    }, []);

    const handleComingSoon = () => {
        toast.info('🚀 Feature coming soon!');
    };

    return (
        <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto pt-6"
        >
            {/* Welcome Banner */}
            <motion.div variants={fadeUp} className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-500/20 overflow-hidden relative border border-white/20">
                <div className="absolute right-0 top-0 w-80 h-full hidden md:block opacity-20 transform translate-x-10 -translate-y-10 scale-125">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6 0 2.21 1.19 4.14 2.97 5.23.4.24.9.06 1.05-.39.14-.42-.09-.89-.48-1.13C8.21 14.88 7.5 13.51 7.5 12c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5c0 1.51-.71 2.88-2.04 3.71-.39.24-.62.71-.48 1.13.15.45.65.63 1.05.39C16.81 16.14 18 14.21 18 12c0-3.31-2.69-6-6-6z" /></svg>
                </div>
                
                {/* Decorative glowing orb */}
                <div className="absolute top-[0%] left-[-20%] w-80 h-80 bg-white opacity-20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-1 bg-white/20 rounded-full hidden sm:block backdrop-blur-md border border-white/30 shadow-lg">
                        <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Student"} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-white object-cover bg-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black mb-2 tracking-tight">Hello, {user?.name}! 👋</h1>
                        <p className="text-blue-100 text-lg font-medium opacity-90">Ready to learn today? Let's check your progress.</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Assignments Available"
                    value={assignments.length || 3}
                    icon={<MdAssignmentTurnedIn className="w-7 h-7" />}
                    trend={assignments.length > 0 ? 100 : 0}
                    colorClass="text-blue-600" bgClass="bg-gradient-to-br from-blue-100 to-indigo-100"
                />
                <StatCard
                    title="Average Score"
                    value={`85%`}
                    icon={<MdScore className="w-7 h-7" />}
                    trend={2}
                    colorClass="text-emerald-600" bgClass="bg-gradient-to-br from-emerald-100 to-teal-100"
                />
                <StatCard
                    title="Recent Submissions"
                    value={recentFeedback.length || 2}
                    icon={<MdPendingActions className="w-7 h-7" />}
                    colorClass="text-amber-600" bgClass="bg-gradient-to-br from-amber-100 to-orange-100"
                />
                <StatCard
                    title="Badges Earned"
                    value={5}
                    icon={<MdBadge className="w-7 h-7" />}
                    colorClass="text-purple-600" bgClass="bg-gradient-to-br from-purple-100 to-fuchsia-100"
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Feedback Feed */}
                <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Recent Feedback</h2>
                        <button onClick={handleComingSoon} className="text-sm font-bold text-brand-blue hover:text-indigo-700 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg transition-colors">View All</button>
                    </div>

                    <div className="space-y-4">
                        {recentFeedback.length > 0 ? recentFeedback.map((item, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx} 
                                onClick={handleComingSoon}
                                className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm
                                        ${item.score >= 90 ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border border-emerald-200' :
                                        item.score >= 70 ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 border border-blue-200' :
                                        'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 border border-amber-200'}`}>
                                        {item.grade}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-brand-blue transition-colors">{item.title}</h4>
                                        <p className="text-sm font-medium text-slate-500 mt-0.5">{item.subject} • {item.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 text-lg">{item.score}/100</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                                        {item.status}
                                    </span>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 font-medium">No recent feedback available.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Learning Streak */}
                <motion.div variants={fadeUp} className="glass-card p-8 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-between tracking-tight">
                        Learning Streak
                        <span className="text-orange-600 dark:text-orange-400 font-black text-sm flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/30 px-3 py-1.5 rounded-lg shadow-sm border border-orange-200/50 dark:border-orange-700/50">🔥 12 Days</span>
                    </h2>

                    <div className="grid grid-cols-7 gap-3">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-400 mb-2">{d}</div>
                        ))}
                        {/* Pad calendar start */}
                        <div className="col-span-3"></div>

                        {streakData.map((day, i) => (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + (i * 0.02) }}
                                key={i}
                                onClick={handleComingSoon}
                                className={`w-full aspect-square rounded-lg shadow-sm
                                ${day.active ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 hover:scale-110 cursor-pointer' : 'bg-slate-100 border border-slate-200/60'} 
                                transition-all duration-300`}
                                title={`Day ${day.day}: ${day.active ? 'Active' : 'Inactive'}`}
                            ></motion.div>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-center text-slate-500 mt-6 leading-relaxed">Submit assignments consistently to build your streak and earn new badges!</p>
                </motion.div>
            </div>
        </motion.div>
    );
}