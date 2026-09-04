import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';
import EducationalParticles from '../components/EducationalParticles';
import { MdSpeed, MdAutoGraph, MdDashboardCustomize } from 'react-icons/md';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

export default function LandingPage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-fuchsia-50 to-teal-50 dark:from-slate-900 dark:via-indigo-950/80 dark:to-slate-900 transition-colors duration-500">
            {/* Floating Colorful Particles */}
            <EducationalParticles />

            {/* Colorful Background Glows — these give the page its vibrant feel */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, 60, 0],
                    y: [0, 40, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -left-[5%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-400/50 to-indigo-400/40 dark:from-blue-600/20 dark:to-indigo-800/15 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="absolute top-[10%] -right-[5%] w-[45vw] h-[45vw] bg-gradient-to-bl from-pink-400/50 to-fuchsia-400/40 dark:from-fuchsia-600/20 dark:to-pink-800/15 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.15, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
                className="absolute bottom-[5%] left-[20%] w-[40vw] h-[40vw] bg-gradient-to-tr from-teal-400/40 to-emerald-400/30 dark:from-teal-600/15 dark:to-emerald-800/10 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 flex flex-col items-center text-center px-4">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto relative z-10"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm text-brand-blue dark:text-blue-400 text-sm font-semibold mb-8 transition-colors">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blue"></span>
                        </span>
                        Meet the Future of Education
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 transition-colors">
                        Grade Smarter.<br/>
                        <span className="text-gradient">Teach Better.</span><br/>
                        Learn Faster.
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light transition-colors">
                        SmartGrade AI automates grading and delivers personalized feedback to every student in under <span className="font-bold text-slate-900 dark:text-white">60 seconds</span>.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link to="/login" className="btn-primary text-lg px-10 py-4 group">
                            Try Demo
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="btn-secondary text-lg px-10 py-4">
                            Learn More
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Bar */}
            <motion.section 
                style={{ y: y2 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="relative z-20 mx-4 md:mx-auto max-w-6xl w-full"
            >
                <div className="glass-panel rounded-3xl p-8 md:p-12 overflow-hidden relative">
                    {/* Decorative blurred blob inside the panel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-200 dark:divide-slate-700 relative z-10">
                        <div className="text-center px-4">
                            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
                                <AnimatedCounter end={60} suffix="s" duration={1500} />
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Avg grading time</p>
                        </div>
                        <div className="text-center px-4">
                            <h3 className="text-4xl md:text-5xl font-extrabold text-brand-green mb-2">
                                <AnimatedCounter end={65} suffix="%" duration={2000} />
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Time saved</p>
                        </div>
                        <div className="text-center px-4">
                            <h3 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-2">
                                <AnimatedCounter end={250} suffix="M+" duration={2500} />
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Students supported</p>
                        </div>
                        <div className="text-center px-4">
                            <h3 className="text-4xl md:text-5xl font-extrabold text-brand-purple mb-2">
                                <AnimatedCounter end={10} suffix="+" duration={1000} />
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Languages</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors"
                    >
                        Why schools choose SmartGrade AI
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light transition-colors"
                    >
                        Bridging the gap between massive class sizes and the need for individualized attention.
                    </motion.p>
                </div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <motion.div variants={fadeUp} className="glass-card p-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-16 h-16 bg-blue-100/80 dark:bg-blue-900/50 text-brand-blue dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm">
                            <MdSpeed className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Instant Auto-Grading</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Submit handwritten or typed assignments and get them evaluated against complex rubrics in under a minute.</p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="glass-card p-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 dark:bg-green-500/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-16 h-16 bg-green-100/80 dark:bg-green-900/50 text-brand-green dark:text-green-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm">
                            <MdAutoGraph className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Personalized Feedback</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">It's not just a score. Gemini AI generates highly specific feedback highlighting exact strengths and weaknesses.</p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="glass-card p-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-16 h-16 bg-yellow-100/80 dark:bg-yellow-900/50 text-brand-yellow dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm">
                            <MdDashboardCustomize className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Real-Time Dashboard</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Comprehensive analytics for teachers to identify at-risk students, class trends, and performance bottlenecks instantly.</p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="glass-card p-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-16 h-16 bg-purple-100/80 dark:bg-purple-900/50 text-brand-purple dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">SDG 4 Aligned</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">Built to meet the UN Sustainable Development Goal for Quality, Equitable, and Inclusive Education for all.</p>
                    </motion.div>
                </motion.div>
            </section>

            {/* How it Works Section */}
            <motion.section style={{ y: y1 }} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-t border-white/50 dark:border-white/5 transition-colors"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors"
                        >
                            How it works in practice
                        </motion.h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent z-0"></div>

                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid md:grid-cols-3 gap-12 relative z-10"
                        >
                            <motion.div variants={fadeUp} className="text-center flex flex-col items-center">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center text-2xl font-black text-slate-300 dark:text-slate-500 mb-8 rotate-[-3deg] hover:rotate-0 transition-all duration-300 hover:-translate-y-2">1</div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Student Submits</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-light">Student answers questions in their preferred language natively or via upload.</p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="text-center flex flex-col items-center">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center text-2xl font-black text-white mb-8 scale-110 hover:scale-125 transition-all duration-300">2</div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Evaluates</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-light">Google Gemini analyzes the response, generating a score and personalized insights.</p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="text-center flex flex-col items-center">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center text-2xl font-black text-slate-300 dark:text-slate-500 mb-8 rotate-[3deg] hover:rotate-0 transition-all duration-300 hover:-translate-y-2">3</div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Everyone Learns</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-light">Teacher reviews analytics, Parents are notified, and the Student knows how to improve.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}