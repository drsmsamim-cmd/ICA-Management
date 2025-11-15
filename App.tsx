
import React, { useState, useEffect } from 'react';
import { User, LoginCredentials, SignupDetails } from './types';
import Login from './pages/Login';
import MainLayout from './MainLayout';
import { login as apiLogin, signup as apiSignup } from './services/mockApiService';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('school-user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('school-user');
        }
        setLoading(false);
    }, []);

    const handleLogin = async (credentials: LoginCredentials) => {
        const loggedInUser = await apiLogin(credentials);
        if (loggedInUser) {
            setUser(loggedInUser);
            localStorage.setItem('school-user', JSON.stringify(loggedInUser));
            return loggedInUser;
        }
        throw new Error("Invalid credentials or user not found.");
    };
    
    const handleSignup = async (details: SignupDetails) => {
        const newUser = await apiSignup(details);
        if (newUser) {
            setUser(newUser);
            localStorage.setItem('school-user', JSON.stringify(newUser));
            return newUser;
        }
        throw new Error("A user with this email already exists.");
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('school-user');
    };

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('school-user', JSON.stringify(updatedUser));
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Application...</div>
            </div>
        );
    }

    return user ? (
        <MainLayout user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
    ) : (
        <Login onLogin={handleLogin} onSignup={handleSignup} />
    );
};

export default App;