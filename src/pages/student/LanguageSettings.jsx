import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MdLanguage, MdCheckCircle } from 'react-icons/md';

export default function LanguageSettings() {
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const languages = [
        { id: 'en', name: 'English', native: 'English', active: true },
        { id: 'hi', name: 'Hindi', native: 'हिन्दी', active: true },
        { id: 'mr', name: 'Marathi', native: 'मराठी', active: true },
        { id: 'ta', name: 'Tamil', native: 'தமிழ்', active: true },
        { id: 'te', name: 'Telugu', native: 'తెలుగు', active: true },
        { id: 'bn', name: 'Bengali', native: 'বাংলা', active: true },
    ];

    const handleSave = () => {
        toast.success(`Language updated to ${selectedLanguage}`);
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in relative pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Language Preferences</h1>
                <p className="text-slate-500">Choose the language you prefer for reading instructions and viewing feedback.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                        <MdLanguage className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Select Interface Language</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => setSelectedLanguage(lang.name)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left
                 ${selectedLanguage === lang.name
                                    ? 'border-brand-blue bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                        >
                            <div>
                                <h3 className={`font-bold ${selectedLanguage === lang.name ? 'text-brand-blue' : 'text-slate-700'}`}>
                                    {lang.name}
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">{lang.native}</p>
                            </div>

                            {selectedLanguage === lang.name && (
                                <MdCheckCircle className="w-6 h-6 text-brand-blue" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button onClick={handleSave} className="btn-primary">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
}