import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { MdPeople, MdAssignmentTurnedIn, MdPendingActions, MdScore, MdTimer, MdWarning, MdPublic } from 'react-icons/md';
import { teacherStats, recentActivity } from '../../data/mockTeacherData';
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

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/assignments');
                const data = await res.json();
                if (data.success) setAssignments(data.data);
            } catch (err) {
                console.warn('⚠️ Backend unreachable, using mock data for teacher dashboard.');
                // Keep assignments empty but don't crash
            }
        };
        fetchTeacherData();
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
            <motion.div variants={fadeUp} className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-teal-500/20 overflow-hidden relative border border-white/20">
                <div className="absolute right-0 top-0 w-80 h-full hidden md:block opacity-20 transform translate-x-10 -translate-y-10 scale-125">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
                
                {/* Decorative glowing orb */}
                <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-white opacity-20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-1 bg-white/20 rounded-full hidden sm:block backdrop-blur-md border border-white/30 shadow-lg">
                        <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-white object-cover bg-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black mb-2 tracking-tight">Good morning, {user?.name}! 👩‍🏫</h1>
                        <p className="text-teal-50 text-lg font-medium opacity-90">Here's what your class has been up to today.</p>
                    </div>
                </div>
            </motion.div>

            {/* Time Saved Alert */}
            <motion.div variants={fadeUp} className="glass-panel border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50/50 to-transparent p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white shadow-lg shadow-amber-500/30">
                        <MdTimer className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">SmartGrade AI Impact</h3>
                        <p className="text-slate-600 font-medium">The AI assistant has saved you <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md inline-block shadow-inner">4.2 hours</span> of manual grading this week!</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={teacherStats?.totalStudents || 32}
                    icon={<MdPeople className="w-7 h-7" />}
                    colorClass="text-blue-600" bgClass="bg-gradient-to-br from-blue-100 to-indigo-100"
                />
                <StatCard
                    title="Assignments"
                    value={assignments.length || 8}
                    icon={<MdAssignmentTurnedIn className="w-7 h-7" />}
                    trend={100}
                    colorClass="text-emerald-600" bgClass="bg-gradient-to-br from-emerald-100 to-teal-100"
                />
                <StatCard
                    title="Pending Review"
                    value={teacherStats?.pendingReview || 5}
                    icon={<MdPendingActions className="w-7 h-7" />}
                    colorClass="text-amber-600" bgClass="bg-gradient-to-br from-amber-100 to-orange-100"
                />
                <StatCard
                    title="Class Average"
                    value={`${teacherStats?.classAverage || 85}%`}
                    icon={<MdScore className="w-7 h-7" />}
                    trend={4}
                    colorClass="text-purple-600" bgClass="bg-gradient-to-br from-purple-100 to-fuchsia-100"
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Feed */}
                <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recent Class Activity</h2>
                        <button onClick={handleComingSoon} className="text-sm font-bold text-brand-green hover:text-emerald-700 bg-green-50 px-4 py-2 rounded-lg transition-colors">View All</button>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-7 top-4 bottom-4 w-1 bg-slate-100 rounded-full"></div>

                        <div className="space-y-8">
                            {recentActivity.map((activity, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={activity.id} 
                                    className="relative flex gap-6 items-start pl-4 group"
                                >
                                    <div className="absolute left-0 w-7 h-7 rounded-full bg-white border-4 border-emerald-400 mt-1 z-10 shadow-[0_0_10px_rgba(52,211,153,0.5)] group-hover:scale-110 transition-transform"></div>
                                    <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 flex-1 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-slate-600 text-lg">
                                                    <span className="font-bold text-slate-800">{activity.student}</span>
                                                    {' '}
                                                    {activity.error ? (
                                                        <span className="text-rose-500 font-semibold flex items-center gap-1.5 inline-flex"><MdWarning /> flagged for manual review</span>
                                                    ) : (
                                                        <>&nbsp;{activity.action === 'submitted' ? 'submitted' : 'viewed feedback for'}</>
                                                    )}
                                                    {' '}
                                                    <span className="font-bold text-slate-700">{activity.assignment}</span>
                                                </p>
                                                <span className="text-sm font-medium text-slate-400 mt-1 block">{activity.time}</span>
                                            </div>
                                            {activity.grade && (
                                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg bg-emerald-100 text-emerald-700 shadow-sm">
                                                    {activity.grade}
                                                </span>
                                            )}
                                            {activity.error && (
                                                <button onClick={handleComingSoon} className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-500 hover:text-white transition-colors shadow-sm">
                                                    Grade Manually
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions & Reminders */}
                <motion.div variants={fadeUp} className="space-y-6">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-5 tracking-tight">Quick Actions</h2>
                        <div className="space-y-3">
                            <button onClick={handleComingSoon} className="w-full text-left px-5 py-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-700 font-bold hover:shadow-md hover:-translate-y-0.5 transition-all border border-emerald-100/50">
                                + Create Assignment
                            </button>
                            <button onClick={handleComingSoon} className="w-full text-left px-5 py-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 text-blue-700 font-bold hover:shadow-md hover:-translate-y-0.5 transition-all border border-blue-100/50">
                                ✉️ Message Parents
                            </button>
                            <button onClick={handleComingSoon} className="w-full text-left px-5 py-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all bg-slate-50/50">
                                📊 Generate Weekly Report
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 border border-indigo-400/30 rounded-3xl p-8 relative overflow-hidden text-white">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute right-4 bottom-4 text-7xl opacity-20">💡</div>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span>Smart Insights</span>
                        </h3>
                        <p className="text-indigo-50 mb-5 font-medium leading-relaxed">
                            Based on recent tests, <strong className="text-white bg-indigo-400/50 px-1.5 py-0.5 rounded">15 students</strong> are struggling with "Refraction of Light". Consider reviewing this topic on Friday.
                        </p>
                        <button onClick={handleComingSoon} className="bg-white text-indigo-700 text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm w-full">
                            Generate Lesson Plan
                        </button>
                    </div>

                    {/* SDG 4 Alignment Badge */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 rounded-3xl p-8 text-white shadow-lg shadow-blue-500/20 flex flex-col gap-4 relative overflow-hidden border border-blue-400/30">
                        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner">
                                <MdPublic className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-black text-xl tracking-tight">SDG 4 Aligned</h3>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-blue-50 mb-4 font-medium leading-relaxed opacity-90">Your curriculum officially meets the UN Sustainable Development Goal for Quality Education.</p>
                            <button onClick={handleComingSoon} className="w-full text-sm font-bold uppercase tracking-wider text-white border-2 border-white/30 px-4 py-2.5 rounded-xl hover:bg-white hover:text-blue-600 transition-all">
                                View Policy Impact
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}