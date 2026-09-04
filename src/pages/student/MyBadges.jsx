import React from 'react';
import { badges } from '../../data/mockStudentData';
import { MdLock } from 'react-icons/md';

export default function MyBadges() {
    return (
        <div className="max-w-5xl mx-auto animate-fade-in relative pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Achievement Badges</h1>
                <p className="text-slate-500">Collect badges by consistently learning and improving your scores.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`relative rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300
              ${badge.earned
                                ? 'bg-white shadow-sm hover:shadow-md border-2 border-brand-yellow/30 transform hover:-translate-y-1'
                                : 'bg-slate-50 border border-slate-200 opacity-70 grayscale'
                            }`}
                    >
                        {/* Ribbon Decoration for Earned */}
                        {badge.earned && (
                            <div className="absolute top-0 right-4 w-4 h-8 bg-brand-yellow/20 -z-10 before:content-[''] before:absolute before:top-full before:left-0 before:border-solid before:border-t-brand-yellow/20 before:border-t-8 before:border-x-transparent before:border-x-[8px] before:border-b-0"></div>
                        )}

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 relative
              ${badge.earned ? 'bg-yellow-100 shadow-inner' : 'bg-slate-200'}`}>

                            {!badge.earned && (
                                <div className="absolute -top-1 -right-1 bg-slate-700 text-white rounded-full p-1 border-2 border-slate-50">
                                    <MdLock className="w-3 h-3" />
                                </div>
                            )}

                            <span className={badge.earned ? 'animate-[bounce_2s_infinite]' : ''} style={{ animationDelay: badge.id.replace('b', '') + '00ms' }}>
                                {badge.icon}
                            </span>
                        </div>

                        <h3 className={`font-bold text-lg mb-1 ${badge.earned ? 'text-slate-800' : 'text-slate-600'}`}>
                            {badge.title}
                        </h3>

                        {badge.desc && (
                            <p className="text-sm text-slate-500 mb-3">{badge.desc}</p>
                        )}

                        {badge.earned ? (
                            <div className="mt-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Earned {badge.date}
                            </div>
                        ) : (
                            <div className="mt-auto text-xs font-medium text-slate-400">
                                Locked
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}