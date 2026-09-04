import React from 'react';

export default function SDG4Badge() {
    return (
        <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-[#C5192D]/10 rounded-full border border-[#C5192D]/20'>
            <div className='w-5 h-5 bg-[#C5192D] text-white flex items-center justify-center rounded-sm font-bold text-[10px] leading-none'>
                4
            </div>
            <span className='text-xs font-semibold text-[#C5192D] tracking-wide'>
                QUALITY EDUCATION
            </span>
        </div>
    );
}
