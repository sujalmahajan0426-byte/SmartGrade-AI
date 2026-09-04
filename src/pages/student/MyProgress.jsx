import React from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { progressData } from '../../data/mockStudentData';

export default function MyProgress() {
    const strongest = [...progressData.bySubject].sort((a, b) => b.score - a.score)[0];
    const weakest = [...progressData.bySubject].sort((a, b) => a.score - b.score)[0];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Progress Analytics</h1>
                <p className="text-slate-500">Track your performance over time and identify areas for improvement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Key Insights Overview */}
                <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 grid md:grid-cols-3 gap-6 divide-x divide-slate-100">
                    <div className="px-4 flex flex-col items-center justify-center text-center group">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🟢</span>
                        <h3 className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Strongest Subject</h3>
                        <p className="text-2xl font-bold text-brand-green">{strongest.subject}</p>
                        <p className="text-sm text-slate-500">{strongest.score}% Average</p>
                    </div>

                    <div className="px-4 flex flex-col items-center justify-center text-center group">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🔴</span>
                        <h3 className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Needs Attention</h3>
                        <p className="text-2xl font-bold text-brand-red">{weakest.subject}</p>
                        <p className="text-sm text-slate-500">{weakest.score}% Average</p>
                    </div>

                    <div className="px-4 flex flex-col items-center justify-center text-center group">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📈</span>
                        <h3 className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Recent Trend</h3>
                        <p className="text-2xl font-bold text-brand-blue">+7% Growth</p>
                        <p className="text-sm text-slate-500">Last 30 Days</p>
                    </div>
                </div>

                {/* Overall Trend Line Chart */}
                <div className="md:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Trend (Last 10 Submissions)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#4285f4', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#4285F4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Chart for Topic Balance */}
                <div className="md:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Subject Mastery</h3>
                    <p className="text-xs text-slate-500 mb-4">A balanced shape indicates well-rounded learning.</p>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={progressData.radar}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="A" stroke="#34A853" strokeWidth={2} fill="#34A853" fillOpacity={0.4} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Comparison Bar Chart */}
                <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Averages vs Target</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={progressData.bySubject} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="subject" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="score" name="Your Average" fill="#4285F4" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                <Bar dataKey="fullMark" name="Target Matrix" fill="#E2E8F0" radius={[6, 6, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}