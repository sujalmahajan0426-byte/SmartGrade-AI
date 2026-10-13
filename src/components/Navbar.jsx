import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getRoleColor = (role) => {
        switch (role) {
            case 'student': return 'from-brand-blue to-indigo-500';
            case 'teacher': return 'from-brand-green to-teal-500';
            case 'parent': return 'from-brand-yellow to-orange-500';
            default: return 'from-brand-blue to-indigo-500';
        }
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'pt-2' : 'pt-4'}`}>
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 ${scrolled ? 'px-2' : 'px-4'}`}>
                <div className={`
                    glass-panel rounded-2xl flex justify-between items-center h-16 px-6 
                    transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                `}>
                    <Logo />

                    <nav className="flex items-center gap-4 sm:gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-slate-600 font-medium hover:text-brand-blue transition-colors hidden sm:block">
                                    Login
                                </Link>
                                <Link to="/login?mode=signup" className="btn-primary py-2 px-6 shadow-blue-500/20">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-5">
                                <div className="hidden sm:flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                                        <p className={`text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r ${getRoleColor(user.role)} capitalize`}>
                                            {user.role}
                                        </p>
                                    </div>
                                    <div className={`p-0.5 rounded-full bg-gradient-to-tr ${getRoleColor(user.role)}`}>
                                        <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                                <button onClick={logout} className="text-sm text-slate-500 font-medium hover:text-brand-red transition-colors px-2 py-1 rounded-md hover:bg-red-50">
                                    Logout
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}