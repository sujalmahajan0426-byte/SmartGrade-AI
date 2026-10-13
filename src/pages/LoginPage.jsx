import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { MdSchool, MdPerson, MdFamilyRestroom, MdArrowBack, MdLock, MdEmail, MdPersonOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    
    const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'
    const [selectedRole, setSelectedRole] = useState(null);
    
    // Login form fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Signup form fields
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupRole, setSignupRole] = useState('STUDENT');
    
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setLoginEmail(`${role}@demo.com`);
        setLoginPassword('demo123');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await login(selectedRole, loginEmail, loginPassword);
            if (res.success) {
                toast.success('Welcome back to SmartGrade AI!');
            } else {
                toast.error(res.message || 'Invalid email or password.');
                setIsLoading(false);
            }
        } catch (err) {
            toast.error('An unexpected error occurred during login.');
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (signupPassword.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await register({
                name: signupName,
                email: signupEmail,
                password: signupPassword,
                role: signupRole
            });

            if (res.success) {
                toast.success(`Account created successfully! Welcome, ${signupName}!`);
            } else {
                toast.error(res.message || 'Registration failed. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            toast.error('Could not connect to authentication server.');
            setIsLoading(false);
        }
    };

    const roles = [
        { 
            id: 'student', title: 'Student', icon: <MdSchool className="w-7 h-7" />, 
            desc: 'Submit assignments & view feedback',
            gradient: 'from-blue-500 to-indigo-500',
            colors: { hoverBorder: 'hover:border-blue-400', ring: 'focus:ring-blue-500', text: 'text-blue-600', iconBg: 'bg-blue-50' }
        },
        { 
            id: 'teacher', title: 'Teacher', icon: <MdPerson className="w-7 h-7" />, 
            desc: 'Create rubrics, evaluate & analytics',
            gradient: 'from-emerald-500 to-teal-500',
            colors: { hoverBorder: 'hover:border-green-400', ring: 'focus:ring-green-500', text: 'text-emerald-600', iconBg: 'bg-emerald-50' }
        },
        { 
            id: 'parent', title: 'Parent', icon: <MdFamilyRestroom className="w-7 h-7" />, 
            desc: "Track ward's lecture attendance & progress",
            gradient: 'from-amber-500 to-orange-500',
            colors: { hoverBorder: 'hover:border-yellow-400', ring: 'focus:ring-yellow-500', text: 'text-amber-600', iconBg: 'bg-amber-50' }
        },
    ];

    const getRoleButtonColor = (role) => {
        if (role === 'student' || role === 'STUDENT') return 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30';
        if (role === 'teacher' || role === 'TEACHER') return 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30';
        return 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pt-24 pb-16">
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[8%] left-[5%] w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-300/15 rounded-full blur-[90px] pointer-events-none"
            />
            <motion.div 
                animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[8%] right-[5%] w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-pink-300/15 rounded-full blur-[90px] pointer-events-none"
            />

            {/* Central Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg w-full relative z-10"
            >
                <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-xl border border-white/80 bg-white/85">
                    
                    {/* Header Logo */}
                    <div className="flex flex-col items-center mb-6">
                        <Logo className="scale-110 mb-4" />
                        
                        {/* Tab Switcher: Sign In vs Sign Up */}
                        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full max-w-xs mt-2 border border-slate-200/80">
                            <button
                                type="button"
                                onClick={() => { setAuthMode('login'); setSelectedRole(null); }}
                                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                                    authMode === 'login'
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode('signup'); setSelectedRole(null); }}
                                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                                    authMode === 'signup'
                                        ? 'bg-white text-brand-blue shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Create Account
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ===================== SIGN UP MODE ===================== */}
                        {authMode === 'signup' ? (
                            <motion.div
                                key="signup-mode"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Join SmartGrade AI</h2>
                                    <p className="text-sm text-slate-500">Create your college account with live backend persistence</p>
                                </div>

                                <form onSubmit={handleSignupSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                                        <div className="relative">
                                            <MdPersonOutline className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Arjun Sharma"
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm text-slate-800 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="e.g. arjun@nit.edu"
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm text-slate-800 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                                        <div className="relative">
                                            <MdLock className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                                            <input
                                                type="password"
                                                required
                                                placeholder="Minimum 6 characters"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm text-slate-800 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Role</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'STUDENT', label: 'Student' },
                                                { id: 'TEACHER', label: 'Teacher' },
                                                { id: 'PARENT', label: 'Parent' },
                                            ].map((r) => (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setSignupRole(r.id)}
                                                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                                                        signupRole === r.id
                                                            ? 'bg-brand-blue text-white border-brand-blue shadow-md shadow-blue-500/20'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Register & Open Portal'
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : !selectedRole ? (
                            /* ===================== SIGN IN ROLE SELECT ===================== */
                            <motion.div 
                                key="role-selection"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome Back!</h2>
                                    <p className="text-sm text-slate-500">Select your role to sign in with demo credentials or your account</p>
                                </div>

                                <motion.div 
                                    variants={stagger}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-3"
                                >
                                    {roles.map((r) => (
                                        <motion.button
                                            key={r.id}
                                            variants={fadeUp}
                                            whileHover={{ y: -3, scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleRoleSelect(r.id)}
                                            className={`w-full group bg-white border border-slate-200/90 hover:border-slate-300 p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-200 shadow-sm hover:shadow-md ${r.colors.hoverBorder}`}
                                        >
                                            <div className={`${r.colors.text} ${r.colors.iconBg} p-3 rounded-xl transition-transform group-hover:scale-105`}>
                                                {r.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base">{r.title}</h3>
                                                <p className="text-xs text-slate-500 font-medium truncate">{r.desc}</p>
                                            </div>
                                            <span className="text-xs font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                                Sign in →
                                            </span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* ===================== SIGN IN FORM ===================== */
                            <motion.div 
                                key="login-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <button
                                    onClick={() => setSelectedRole(null)}
                                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-slate-100"
                                >
                                    <MdArrowBack /> Choose a different role
                                </button>

                                <div className="mb-5">
                                    <h2 className="text-2xl font-extrabold text-slate-800 capitalize">{selectedRole} Sign In</h2>
                                    <p className="text-xs text-slate-500">Sign in to your dashboard connected to PostgreSQL</p>
                                </div>

                                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Demo Quick Access</p>
                                        <p className="text-xs text-slate-600 font-mono">{selectedRole}@demo.com</p>
                                    </div>
                                    <span className="text-[11px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md">demo123</span>
                                </div>

                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                                            <input
                                                type="email"
                                                required
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm font-medium text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                                        <div className="relative">
                                            <MdLock className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
                                            <input
                                                type="password"
                                                required
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm font-medium text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-base transition-all ${getRoleButtonColor(selectedRole)} flex items-center justify-center gap-2`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Authenticating...
                                            </>
                                        ) : (
                                            `Sign In as ${selectedRole}`
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}