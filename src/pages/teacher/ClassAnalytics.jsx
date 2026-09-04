import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { classAnalytics } from '../../data/mockTeacherData';

export default function ClassAnalytics() {
    const { distribution, subjectAverages, performanceOverTime } = classAnalytics;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Class Analytics</h1>
                    <p className="text-slate-500">Comprehensive view of Class 10A's performance trends and mastery.</p>
                </div>

                <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm font-medium">
                    <option>Last 30 Days</option>
                    <option>This Semester</option>
                    <option>All Time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grade Distribution */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        Grade Distribution
                    </h2>
                    <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        return (
                                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
                                                {value}
                                            </text>
                                        );
                                    }}
                                >
                                    {distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="flex flex-col gap-2 min-w-[120px]">
                            {distribution.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm border border-indigo-100 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        🧠 Classroom Sentiment Analysis
                    </h2>
                    <p className="text-xs text-indigo-700 mb-4">Aggregated from AI interactions and feedback tone.</p>
                    <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={classAnalytics.sentiment}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    nameKey="emotion"
                                    labelLine={false}
                                >
                                    {classAnalytics.sentiment.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="flex flex-col gap-2 min-w-[120px]">
                            {classAnalytics.sentiment.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-indigo-900 font-medium">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                                    {entry.emotion}: {entry.value}%
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Over Time */}
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Aggregate Trend (Last 5 Weeks)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceOverTime}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 100]} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="avgScore" stroke="#4285F4" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject wise Breakdown */}
                <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Subject-wise Class Averages vs Target</h2>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="subject" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="avg" name="Class Average" fill="#4285F4" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                <Bar dataKey="target" name="School Target" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}