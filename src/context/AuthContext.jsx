import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Built-in demo users — works even without the backend
const DEMO_USERS = {
    'student@demo.com': { id: 'demo-student-1', name: 'Arjun', role: 'student', email: 'student@demo.com' },
    'teacher@demo.com': { id: 'demo-teacher-1', name: 'Mrs. Sharma', role: 'teacher', email: 'teacher@demo.com' },
    'parent@demo.com': { id: 'demo-parent-1', name: 'Mr. Patel', role: 'parent', email: 'parent@demo.com' },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleOfflineFallback = (email, password) => {
        console.warn('⚠️ Using offline demo mode.');
        if (password !== 'demo123') {
            return 'INVALID_CREDENTIALS';
        }
        const demoUser = DEMO_USERS[email];
        if (!demoUser) {
            return 'INVALID_CREDENTIALS';
        }
        const userData = {
            ...demoUser,
            avatar: `https://ui-avatars.com/api/?name=${demoUser.name}&background=random`
        };
        setUser(userData);
        navigate(`/${demoUser.role}`);
        return 'SUCCESS';
    };

    const login = async (role, email, password) => {
        try {
            // Try the live backend first
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const userData = {
                    ...result.data,
                    role: result.data.role.toLowerCase(),
                    avatar: `https://ui-avatars.com/api/?name=${result.data.name}&background=random`
                };
                setUser(userData);
                navigate(`/${userData.role}`);
                return 'SUCCESS';
            }
            
            // If the server explicitly says Invalid Credentials, respect it.
            // But if the server is throwing 500s because the DB isn't running, fallback to offline demo.
            if (response.status === 401 || response.status === 400) {
                return 'INVALID_CREDENTIALS';
            } else {
                return handleOfflineFallback(email, password);
            }

        } catch (networkError) {
            // Backend is not running at all
            return handleOfflineFallback(email, password);
        }
    };

    const logout = () => {
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
