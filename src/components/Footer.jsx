import React from 'react';
import SDG4Badge from './SDG4Badge';

export default function Footer() {
    return (
        <footer className='bg-white border-t border-slate-200 py-6 mt-auto w-full'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4'>
                <p className='text-sm text-slate-500'>
                    SmartGrade AI © 2025 | Built with Google Gemini AI
                </p>
                <SDG4Badge />
            </div>
        </footer>
    );
}