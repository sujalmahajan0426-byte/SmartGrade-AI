import React from 'react';

export default function LoadingAI() {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in w-full h-full min-h-[400px]">
            <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-brand-blue rounded-full opacity-20 animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-2 bg-brand-green rounded-full opacity-40 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                <div className="absolute inset-4 bg-brand-yellow rounded-full opacity-60 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-5xl">
                    🤖
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-3 text-center">
                SmartGrade AI is analyzing your answer...
            </h2>

            <p className="text-slate-500 text-center mb-8 max-w-sm">
                Our Gemini AI engine is reading your submission, evaluating it against the rubric, and generating personalized feedback.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow rounded-full animate-[progress_3s_ease-in-out_infinite]"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: 'progressGradient 2s linear infinite, fillProgress 15s ease-out forwards'
                    }}>
                </div>
            </div>
            <style>{`
        @keyframes progressGradient {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes fillProgress {
          0% { width: 0%; }
          50% { width: 75%; }
          100% { width: 95%; }
        }
      `}</style>
        </div>
    );
}
