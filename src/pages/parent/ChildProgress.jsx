import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { progressTrend, subjectPerformance } from '../../data/mockParentData';
import { studentStats, progressData } from '../../data/mockStudentData'; // Reusing student detailed data for parent deep dive

export default function ChildProgress() {
    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Detailed Progress Report</h1>
                <p className="text-slate-500">In-depth analytics of Arjun's academic standing across all subjects.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Overall Growth Chart */}
                <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex justify-between items-center">
                        <span>Overall Score Trajectory (Semester)</span>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">+12% Growth</span>
                    </h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34A853" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="score" stroke="#34A853" strokeWidth={4} fillOpacity={1} fill="url(#scoreArea)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Strengths & Weaknesses Radar */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Subject Proficiency Profile</h2>
                    <p className="text-sm text-slate-500 mb-6 text-center">Visualizing mastery balance across disciplines.</p>
                    <div className="h-64 sm:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={progressData.radar}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 13, fontWeight: 700 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Child Score" dataKey="A" stroke="#4285F4" strokeWidth={3} fill="#4285F4" fillOpacity={0.5} />
                                <RechartsTooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Comparison Bar Chart */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Subject Averages vs Class Target</h2>
                    <div className="h-64 sm:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={progressData.bySubject} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                                <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <YAxis dataKey="subject" type="category" stroke="#64748B" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                                <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="score" name="Arjun's Score" fill="#FBBC05" radius={[0, 6, 6, 0]} barSize={20} />
                                <Bar dataKey="fullMark" name="Class Target" fill="#E2E8F0" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}