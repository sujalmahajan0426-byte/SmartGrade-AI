import React from 'react';
import { recentFeedback } from '../../data/mockParentData';
import { MdOutlineAssessment } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function RecentFeedback() {
    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative pb-10 space-y-8">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Recent AI Feedback</h1>
                <p className="text-slate-500">Review the personalized guidance SmartGrade AI is providing to Arjun.</p>
            </div>

            <div className="relative pl-4 sm:pl-8">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 sm:left-12 top-4 bottom-4 w-1 bg-slate-200 rounded-full"></div>

                <div className="space-y-8">
                    {recentFeedback.map((feedback, index) => (
                        <div key={feedback.id} className="relative flex flex-col sm:flex-row gap-6 items-start">

                            {/* Timeline Node */}
                            <div className="absolute -left-4 sm:left-0 top-6 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10
                                ${feedback.score >= 80 ? 'bg-brand-green' : feedback.score >= 65 ? 'bg-brand-yellow' : 'bg-brand-red'}">
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-blue/50 transition-colors flex flex-col md:flex-row gap-6 w-full ml-6 sm:ml-12 relative">
                                {/* Date Ribbon */}
                                <div className="absolute -top-3 right-6 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                    {feedback.date}
                                </div>

                                <div className="md:w-48 flex-shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2 md:mt-0">
                                    <div className={`text-4xl font-black mb-2
                         ${feedback.score >= 80 ? 'text-brand-green' : feedback.score >= 65 ? 'text-brand-yellow' : 'text-brand-red'}`}>
                                        {feedback.score}%
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                                        {feedback.subject}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="mb-3">
                                            <h3 className="text-xl font-bold text-slate-800">{feedback.title}</h3>
                                        </div>
                                        <div className="bg-blue-50/50 p-4 rounded-xl border-l-4 border-brand-blue text-slate-700 italic">
                                            "{feedback.summary}"
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button onClick={handleComingSoon} className="flex items-center gap-2 text-brand-blue font-bold hover:underline">
                                            <MdOutlineAssessment className="w-5 h-5" /> Read Full Details
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}