import React from 'react';
import { feedbackHistory } from '../../data/mockStudentData';
import { MdOutlineAssessment, MdSearch } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function MyFeedback() {
    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">My Feedback History</h1>
                    <p className="text-slate-500">Review past assignments and track your AI feedback over time.</p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none w-full sm:w-64"
                    />
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 font-semibold text-slate-700">Assignment</th>
                                <th className="py-4 px-6 font-semibold text-slate-700">Subject</th>
                                <th className="py-4 px-6 font-semibold text-slate-700">Date Completed</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Score</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Grade</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {feedbackHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6 font-semibold text-slate-800">{item.title}</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {item.subject}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-500">{item.date}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`font-bold ${item.score >= 80 ? 'text-brand-green' : item.score >= 60 ? 'text-brand-yellow' : 'text-brand-red'}`}>
                                            {item.score}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm
                      ${item.score >= 90 ? 'bg-green-100 text-green-700' :
                                                item.score >= 70 ? 'bg-blue-100 text-blue-700' :
                                                    item.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                            {item.grade}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button onClick={handleComingSoon} className="text-brand-blue font-semibold text-sm hover:underline flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MdOutlineAssessment /> View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}