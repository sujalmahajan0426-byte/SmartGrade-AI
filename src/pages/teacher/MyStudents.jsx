import React, { useState } from 'react';
import { roster } from '../../data/mockTeacherData';
import { MdSearch, MdFilterList, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function MyStudents() {
    const [searchTerm, setSearchTerm] = useState('');
    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    const filteredRoster = roster.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">My Students</h1>
                    <p className="text-slate-500">Complete roster for Class 10A ({roster.length} students).</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search name or roll no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none w-full"
                        />
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                    <button onClick={handleComingSoon} className="btn-secondary px-3 py-2 flex items-center justify-center">
                        <MdFilterList className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 font-semibold text-slate-700">Roll No</th>
                                <th className="py-4 px-6 font-semibold text-slate-700">Student Name</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Avg Score</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Trend</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Attendance</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-right">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRoster.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="py-4 px-6 text-slate-500 font-mono text-sm">{student.rollNo}</td>

                                    <td className="py-4 px-6 border-l-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-800">{student.name}</span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-center">
                                        <span className={`font-bold inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-sm
                       ${student.avgScore >= 80 ? 'bg-green-100 text-green-700' :
                                                student.avgScore >= 65 ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                            {student.avgScore}%
                                        </span>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-500">
                                            {student.avgScore % 2 === 0 ? <MdTrendingUp className="text-brand-green" /> : <MdTrendingDown className="text-brand-red" />}
                                            {student.avgScore % 2 === 0 ? '+2%' : '-1%'}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-center text-slate-600 text-sm font-medium">
                                        {student.attendance}%
                                    </td>

                                    <td className="py-4 px-6 text-right">
                                        <button onClick={handleComingSoon} className="text-brand-green font-semibold text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRoster.length === 0 && (
                        <div className="py-12 text-center text-slate-500">
                            No students found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}