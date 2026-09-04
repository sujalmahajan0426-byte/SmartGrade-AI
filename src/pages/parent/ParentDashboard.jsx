import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { MdTrendingUp, MdSchool, MdAssignment, MdEventAvailable, MdWarning, MdCheckCircle, MdInfo } from 'react-icons/md';
import { parentStats, childInfo, subjectPerformance, progressTrend, attendanceSummary } from '../../data/mockParentData';

export default function ParentDashboard() {
    const { user } = useAuth();
    const totalLectures = attendanceSummary.reduce((acc, curr) => acc + curr.total, 0);
    const totalPresent = attendanceSummary.reduce((acc, curr) => acc + curr.present, 0);
    const overallPercentage = Math.round((totalPresent / totalLectures) * 100);

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-400 to-brand-yellow rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
                <div className="absolute right-0 top-0 w-64 h-full hidden md:block opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                </div>
                <h1 className="text-3xl font-bold mb-2 z-10 relative">Hello, {user?.name}!</h1>
                <p className="text-orange-50 text-lg z-10 relative">Here's how {childInfo.name} is doing this week 📊</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Child Info Card */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-brand-yellow/20 text-orange-600 rounded-full flex items-center justify-center font-bold text-3xl mb-4 border-4 border-yellow-50">
                        {childInfo.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{childInfo.name}</h2>
                    <p className="text-slate-500 font-medium mb-4">{childInfo.school}</p>

                    <div className="grid grid-cols-2 gap-4 w-full mt-auto pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Class</p>
                            <p className="font-bold text-slate-700">{childInfo.class}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Roll No</p>
                            <p className="font-bold text-slate-700">{childInfo.rollNo}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                    <StatCard
                        title="Overall Average"
                        value={`${parentStats.avgScore}%`}
                        icon={<MdSchool className="w-6 h-6" />}
                        colorClass="text-brand-blue" bgClass="bg-blue-50"
                    />
                    <StatCard
                        title="Submissions This Week"
                        value={parentStats.weeklySubmissions}
                        icon={<MdAssignment className="w-6 h-6" />}
                        colorClass="text-brand-green" bgClass="bg-green-50"
                    />
                    <StatCard
                        title="Recent Improvement"
                        value={`+${parentStats.improvement}%`}
                        icon={<MdTrendingUp className="w-6 h-6" />}
                        colorClass="text-brand-yellow" bgClass="bg-yellow-50"
                    />
                    <StatCard
                        title="Attendance"
                        value={`${overallPercentage}%`}
                        icon={<MdEventAvailable className="w-6 h-6" />}
                        colorClass="text-purple-500" bgClass="bg-purple-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">30-Day Performance Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progressTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 100]} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="score" stroke="#FBBC05" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Performance Cards */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Current Subject Standing</h2>
                    <div className="space-y-3">
                        {subjectPerformance.map((sub, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                <span className="font-semibold text-slate-700">{sub.subject}</span>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold text-lg
                          ${sub.score >= 80 ? 'text-brand-green' : sub.score >= 65 ? 'text-brand-yellow' : 'text-brand-red'}
                       `}>{sub.score}%</span>
                                    <div className="w-6 flex justify-center">
                                        {sub.score >= 80 && <span className="text-brand-green text-xl">🟢</span>}
                                        {sub.score >= 65 && sub.score < 80 && <span className="text-brand-yellow text-xl">🟡</span>}
                                        {sub.score < 65 && <span className="text-brand-red text-xl">🔴</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}