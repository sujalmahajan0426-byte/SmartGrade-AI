import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { MdAssignmentTurnedIn, MdScore, MdPendingActions, MdBadge, MdArrowForward, MdAccessTime, MdSchool } from 'react-icons/md';
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
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAssignments = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/assignments');
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setAssignments(data.data);
            }
        } catch (err) {
            console.warn('Backend unreachable, using fallback assignments');
            const { assignments: mockAssignments } = await import('../../data/mockStudentData');
            setAssignments(mockAssignments || []);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
        // Poll every 15s so new teacher assignments appear automatically without refresh
        const interval = setInterval(fetchAssignments, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleComingSoon = () => {
        toast.info('🚀 Feature coming soon!');
    };

    return (
        <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto pt-4"
        >
            {/* Welcome Banner */}
            <motion.div variants={fadeUp} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-blue-500/20 overflow-hidden relative border border-white/20">
                <div className="absolute right-0 top-0 w-80 h-full hidden md:block opacity-15 transform translate-x-10 -translate-y-10 scale-125">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6 0 2.21 1.19 4.14 2.97 5.23.4.24.9.06 1.05-.39.14-.42-.09-.89-.48-1.13C8.21 14.88 7.5 13.51 7.5 12c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5c0 1.51-.71 2.88-2.04 3.71-.39.24-.62.71-.48 1.13.15.45.65.63 1.05.39C16.81 16.14 18 14.21 18 12c0-3.31-2.69-6-6-6z" /></svg>
                </div>
                
                <div className="relative z-10 flex items-center gap-5 sm:gap-6">
                    <div className="p-1 bg-white/20 rounded-full hidden sm:block backdrop-blur-md border border-white/30 shadow-lg">
                        <img src={user?.avatar || "https://ui-avatars.com/api/?name=Arjun&background=random"} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white object-cover bg-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                                B.Tech CS • 2nd Year
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1.5 tracking-tight">
                            Hello, {user?.name || 'Arjun'}! 👋
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base font-medium opacity-90">
                            You have <strong className="underline decoration-yellow-400 font-bold text-white">{assignments.length} assignments</strong> available to submit.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Active Assignments"
                    value={assignments.length}
                    icon={<MdAssignmentTurnedIn className="w-7 h-7" />}
                    trend={assignments.length > 0 ? 100 : 0}
                    colorClass="text-blue-600" bgClass="bg-gradient-to-br from-blue-100 to-indigo-100"
                />
                <StatCard
                    title="Overall Attendance"
                    value={`84%`}
                    icon={<MdSchool className="w-7 h-7" />}
                    trend={4}
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

            {/* Active Assignments Feed (Teacher created assignments live here!) */}
            <motion.div variants={fadeUp} className="glass-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Assigned Coursework 📚
                            <span className="text-xs font-bold bg-blue-100 text-brand-blue px-2.5 py-0.5 rounded-full">Live</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">Assignments created by faculty ready for Gemini AI evaluation</p>
                    </div>
                    <button
                        onClick={() => navigate('/student/submit')}
                        className="btn-primary py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto"
                    >
                        Submit Any Assignment <MdArrowForward />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div 
                                key={assignment.id}
                                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-blue transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-brand-blue border border-blue-200/60 px-2 py-0.5 rounded-md">
                                            {assignment.subject}
                                        </span>
                                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                                            <MdAccessTime className="text-slate-400" />
                                            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Next Week'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-base mb-1.5 group-hover:text-brand-blue transition-colors line-clamp-2">
                                        {assignment.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-normal">
                                        {assignment.question || 'Answer the prompt using Markdown or upload your handwritten solution.'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/student/submit')}
                                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-brand-blue hover:text-white border border-slate-200 hover:border-brand-blue text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-sm"
                                >
                                    Solve & Submit Answer →
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500 text-sm font-medium">No pending assignments at this moment.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Recent Feedback & Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Feedback Feed */}
                <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Recent AI Feedback</h2>
                        <button onClick={handleComingSoon} className="text-xs sm:text-sm font-bold text-brand-blue hover:text-indigo-700 bg-blue-50 px-3.5 py-1.5 rounded-lg transition-colors">View All</button>
                    </div>

                    <div className="space-y-3">
                        {[
                            { title: 'Python Iterators & Generators', subject: 'Python Programming', score: 92, grade: 'A+', date: 'Yesterday' },
                            { title: 'Calculus II Directional Derivatives', subject: 'Calculus II', score: 78, grade: 'B+', date: '3 days ago' },
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm
                                        ${item.score >= 90 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                        {item.grade}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.subject} • {item.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 text-base">{item.score}/100</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Graded
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Learning Streak */}
                <motion.div variants={fadeUp} className="glass-card p-6 sm:p-8 h-fit">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center justify-between tracking-tight">
                        Learning Streak
                        <span className="text-orange-600 font-black text-xs flex items-center gap-1.5 bg-orange-100 px-2.5 py-1 rounded-lg">🔥 12 Days</span>
                    </h2>

                    <div className="grid grid-cols-7 gap-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-center text-[11px] font-bold text-slate-400 mb-1">{d}</div>
                        ))}
                        <div className="col-span-3"></div>

                        {streakData.slice(0, 18).map((day, i) => (
                            <div
                                key={i}
                                className={`w-full aspect-square rounded-md shadow-xs
                                ${day.active ? 'bg-gradient-to-tr from-emerald-400 to-teal-400' : 'bg-slate-100 border border-slate-200/50'}`}
                                title={`Day ${day.day}: ${day.active ? 'Active' : 'Inactive'}`}
                            ></div>
                        ))}
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-5 leading-relaxed font-medium">Submit assignments consistently to build your streak and stay ahead in attendance!</p>
                </motion.div>
            </div>
        </motion.div>
    );
}