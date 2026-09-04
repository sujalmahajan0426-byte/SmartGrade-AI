import React from 'react';
import { motion } from 'framer-motion';
import { attendanceSummary, attendanceTracker, childInfo } from '../../data/mockParentData';
import { MdCheckCircle, MdCancel, MdCalendarMonth, MdWarning, MdClass } from 'react-icons/md';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export default function ChildAttendance() {
    const totalLectures = attendanceSummary.reduce((acc, curr) => acc + curr.total, 0);
    const totalPresent = attendanceSummary.reduce((acc, curr) => acc + curr.present, 0);
    const overallPercentage = Math.round((totalPresent / totalLectures) * 100);

    const getStatusColor = (status) => {
        if (status === 'present') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (status === 'absent') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getStatusIcon = (status) => {
        if (status === 'present') return <MdCheckCircle className="w-5 h-5 text-emerald-500" />;
        if (status === 'absent') return <MdCancel className="w-5 h-5 text-red-500" />;
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                    <MdCalendarMonth className="text-orange-500" />
                    {childInfo.name}'s Attendance
                </h1>
                <p className="text-slate-500 font-medium mt-1">Monitor course-wise attendance. 80% is mandatory for semester exams.</p>
            </motion.div>

            {/* Overview Stats */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <motion.div variants={fadeUp} className={`glass-card p-6 flex flex-col justify-center border-b-4 ${overallPercentage >= 80 ? 'border-orange-500' : 'border-red-500'}`}>
                    <p className="text-sm font-semibold text-slate-500 mb-1">Overall Semester Attendance</p>
                    <h3 className={`text-4xl font-black ${overallPercentage >= 80 ? 'text-orange-600' : 'text-red-600'}`}>{overallPercentage}%</h3>
                </motion.div>
                
                <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <MdCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Lectures Attended</p>
                        <h3 className="text-2xl font-bold text-slate-800">{totalPresent} <span className="text-sm font-medium text-slate-400">/ {totalLectures}</span></h3>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <MdCancel className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Lectures Missed</p>
                        <h3 className="text-2xl font-bold text-slate-800">{totalLectures - totalPresent}</h3>
                    </div>
                </motion.div>
            </motion.div>

            {/* Alert for low overall attendance */}
            {overallPercentage < 80 && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <MdWarning className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-red-800 font-bold">Mandatory Attendance Warning</h4>
                        <p className="text-sm text-red-600 mt-1">{childInfo.name}'s overall attendance is below the mandatory 80% threshold. Students falling below this requirement may be debarred from appearing in end-semester exams.</p>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject-wise Summary */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <MdClass className="text-slate-400" /> Subject-wise Breakdown
                    </h2>
                    
                    <div className="space-y-4">
                        {attendanceSummary.map((sub, idx) => {
                            const pct = Math.round((sub.present / sub.total) * 100);
                            const isAtRisk = pct < 80;
                            return (
                                <div key={idx} className="bg-white/50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{sub.subject}</h4>
                                        <p className="text-sm text-slate-500">{sub.present} / {sub.total} Lectures</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xl font-black ${isAtRisk ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {pct}%
                                        </div>
                                        {isAtRisk && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">At Risk</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recent Lectures */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Lectures</h2>
                    
                    <div className="space-y-3">
                        {attendanceTracker.map((record) => (
                            <motion.div 
                                key={record.id}
                                whileHover={{ scale: 1.01 }}
                                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${getStatusColor(record.status)}`}
                            >
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(record.status)}
                                    <div>
                                        <h4 className="font-bold">{record.subject}</h4>
                                        <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{record.date} • {record.type}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold capitalize bg-white/40 px-3 py-1 rounded-lg">
                                    {record.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
