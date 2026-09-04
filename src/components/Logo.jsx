import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
    return (
        <Link to="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex items-center justify-center w-10 h-10 bg-brand-blue rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.2" />
                    <path d="M12 6c-3.31 0-6 2.69-6 6 0 2.21 1.19 4.14 2.97 5.23.4.24.9.06 1.05-.39.14-.42-.09-.89-.48-1.13C8.21 14.88 7.5 13.51 7.5 12c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5c0 1.51-.71 2.88-2.04 3.71-.39.24-.62.71-.48 1.13.15.45.65.63 1.05.39C16.81 16.14 18 14.21 18 12c0-3.31-2.69-6-6-6zm-1.87 9.87C9.33 15.34 8.5 13.8 8.5 12c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.8-.83 3.34-1.63 3.87-.2.13-.25.4-.12.6.13.2.4.25.6.12 1.06-.67 2.15-2.58 2.15-4.59 0-2.48-2.02-4.5-4.5-4.5S7.5 9.52 7.5 12c0 2.01 1.09 3.92 2.15 4.59.2.13.47.08.6-.12.13-.2.08-.47-.12-.6z" />
                    <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                    <path d="M5 14h-.5v-4H5v4zm14-4h-.5v4h.5v-4z" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-brand-yellow rounded-full p-0.5 border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" />
                    </svg>
                </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
                SmartGrade<span className="text-brand-blue">AI</span>
            </span>
        </Link>
    );
}
