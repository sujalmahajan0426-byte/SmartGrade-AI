import React, { useEffect, useState } from 'react';

export default function ScoreMeter({ score }) {
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        // Animate score from 0 up to actual score
        let start = 0;
        const end = parseInt(score, 10);
        if (isNaN(end)) return;

        const duration = 1500;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                setCurrentScore(end);
            } else {
                setCurrentScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [score]);

    // Calculate SVG stroke dash array for the circular gauge
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (currentScore / 100) * circumference;

    let colorClass = "text-brand-green";
    if (currentScore < 40) colorClass = "text-brand-red";
    else if (currentScore < 75) colorClass = "text-brand-yellow";

    return (
        <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle
                    cx="70" cy="70" r={radius}
                    fill="none"
                    className="stroke-slate-100"
                    strokeWidth="12"
                />
                {/* Progress Circle */}
                <circle
                    cx="70" cy="70" r={radius}
                    fill="none"
                    className={`transition-all duration-300 ease-out ${colorClass}`}
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className={`text-4xl font-black ${colorClass}`}>{currentScore}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
        </div>
    );
}
