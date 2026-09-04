import React from 'react';

export default function DemoBadge() {
    return (
        <div className='fixed bottom-4 right-4 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-500/30 flex items-center gap-2 z-50'>
            <span className='relative flex h-2.5 w-2.5'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-white'></span>
            </span>
            Demo Mode
        </div>
    );
}