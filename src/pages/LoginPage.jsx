import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { MdSchool, MdPerson, MdFamilyRestroom, MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setEmail(`${role}@demo.com`);
        setPassword('demo123');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const result = await login(selectedRole, email, password);
            if (result === 'SUCCESS') {
                toast.success(`Welcome back!`);
            } else if (result === 'INVALID_CREDENTIALS') {
                toast.error('Invalid email or password. Please check your credentials.');
                setIsLoading(false);
            } else if (result === 'NETWORK_ERROR') {
                toast.error('Could not connect to server. Please ensure the backend is running command.');
                setIsLoading(false);
            } else {
                toast.error('Server error. Please try again later.');
                setIsLoading(false);
            }
        } catch (err) {
            toast.error('An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    const roles = [
        { 
            id: 'student', title: 'Student', icon: <MdSchool className="w-7 h-7" />, 
            desc: 'Submit assignments & view feedback',
            gradient: 'from-blue-500 to-indigo-500',
            colors: { hoverBorder: 'hover:border-blue-400', ring: 'focus:ring-blue-500', text: 'text-blue-600', iconBg: 'bg-blue-50', accentBg: 'bg-blue-500/10' }
        },
        { 
            id: 'teacher', title: 'Teacher', icon: <MdPerson className="w-7 h-7" />, 
            desc: 'Manage class & review insights',
            gradient: 'from-emerald-500 to-teal-500',
            colors: { hoverBorder: 'hover:border-green-400', ring: 'focus:ring-green-500', text: 'text-emerald-600', iconBg: 'bg-emerald-50', accentBg: 'bg-emerald-500/10' }
        },
        { 
            id: 'parent', title: 'Parent', icon: <MdFamilyRestroom className="w-7 h-7" />, 
            desc: "Track child's learning progress",
            gradient: 'from-amber-500 to-orange-500',
            colors: { hoverBorder: 'hover:border-yellow-400', ring: 'focus:ring-yellow-500', text: 'text-amber-600', iconBg: 'bg-amber-50', accentBg: 'bg-amber-500/10' }
        },
    ];

    const getRoleButtonColor = (role) => {
        if (role === 'student') return 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30';
        if (role === 'teacher') return 'bg-gradient-to-r from-green-500 to-teal-500 shadow-green-500/30';
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pt-20">
            {/* Animated Background Orbs */}
            <motion.div 
                animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[5%] w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-300/20 rounded-full blur-[80px] pointer-events-none"
            />
            <motion.div 
                animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-gradient-to-tl from-pink-400/25 to-purple-300/20 rounded-full blur-[80px] pointer-events-none"
            />
            <motion.div 
                animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                className="absolute top-[50%] left-[50%] w-64 h-64 bg-gradient-to-r from-teal-300/20 to-cyan-300/15 rounded-full blur-[60px] pointer-events-none"
            />

            {/* Login Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md w-full relative z-10"
            >
                <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    {/* Subtle shimmer effect inside the card */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none z-0"
                    />

                    <div className="flex flex-col items-center mb-8 relative z-10">
                        {/* Animated Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, ease: "backOut", delay: 0.1 }}
                        >
                            <Logo className="mb-8 scale-110" />
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {!selectedRole ? (
                                <motion.div 
                                    key="role-selection"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-center w-full"
                                >
                                    {/* Animated Heading */}
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, duration: 0.5 }}
                                        className="text-2xl font-extrabold text-slate-800 mb-2"
                                    >
                                        Welcome Back!
                                    </motion.h2>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.5 }}
                                        className="text-slate-500 mb-8 font-medium"
                                    >
                                        Who are you logging in as today?
                                    </motion.p>

                                    {/* Staggered Role Cards */}
                                    <motion.div 
                                        variants={stagger}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4"
                                    >
                                        {roles.map((r) => (
                                            <motion.button
                                                key={r.id}
                                                variants={fadeUp}
                                                whileHover={{ 
                                                    y: -4, 
                                                    scale: 1.02,
                                                    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
                                                    transition: { duration: 0.2 }
                                                }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handleRoleSelect(r.id)}
                                                className={`w-full group relative bg-white/70 backdrop-blur-sm border-2 border-white/80 p-5 rounded-2xl flex items-center gap-4 text-left transition-colors duration-300 hover:bg-white
                                                ${r.colors.hoverBorder} focus:outline-none focus:ring-2 ${r.colors.ring} focus:ring-offset-2`}
                                            >
                                                {/* Colored accent bar on the left */}
                                                <div className={`absolute left-0 top-[20%] bottom-[20%] w-1 rounded-r-full bg-gradient-to-b ${r.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                                
                                                <div className={`relative z-10 flex ${r.colors.text} ${r.colors.iconBg} p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                                                    {r.icon}
                                                </div>
                                                <div className="relative z-10 flex-1">
                                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-900 transition-colors">{r.title}</h3>
                                                    <p className="text-sm text-slate-500 font-medium">{r.desc}</p>
                                                </div>
                                                {/* Arrow that appears on hover */}
                                                <motion.svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </motion.svg>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="login-form"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full relative z-10"
                                >
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        whileHover={{ x: -3 }}
                                        onClick={() => setSelectedRole(null)}
                                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-8 transition-colors px-3 py-1.5 -ml-3 rounded-lg hover:bg-slate-100/50"
                                    >
                                        <MdArrowBack className="w-4 h-4" /> Back to roles
                                    </motion.button>

                                    <motion.h2 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-3xl font-extrabold text-slate-800 mb-2 capitalize"
                                    >
                                        {selectedRole} Login
                                    </motion.h2>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-slate-500 mb-8 font-medium"
                                    >
                                        Enter your details to access your portal.
                                    </motion.p>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 mb-6 shadow-sm"
                                    >
                                        <p className="font-bold text-slate-700 mb-2 flex items-center gap-2 text-sm">
                                            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse inline-block shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Demo Credentials
                                        </p>
                                        <div className="flex justify-between items-center bg-white/80 rounded-lg p-2 px-3 border border-slate-100">
                                            <p className="text-slate-600 font-mono text-sm">{selectedRole}@demo.com</p>
                                            <p className="text-slate-400 font-mono text-xs tracking-widest">••••••••</p>
                                        </div>
                                    </motion.div>

                                    <form onSubmit={handleLogin} className="space-y-5">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-shadow shadow-sm font-medium text-slate-700"
                                            />
                                        </motion.div>
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-shadow shadow-sm font-medium text-slate-700"
                                            />
                                        </motion.div>
                                        <motion.button
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            whileHover={{ y: -2, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)" }}
                                            whileTap={{ scale: 0.97 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 mt-2
                                            ${getRoleButtonColor(selectedRole)}
                                            ${isLoading ? 'opacity-70 cursor-wait' : 'shadow-lg'}`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <motion.span 
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                    Authenticating...
                                                </span>
                                            ) : 'Login to Portal'}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}