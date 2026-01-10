import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Shield, Users, Eye, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { account, ID } from '../lib/appwrite';
import logo from '../assets/logo.png';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager' // default role
    });

    const roles = [
        {
            id: 'admin',
            name: 'Admin',
            icon: Shield,
            color: 'from-red-500 to-orange-500',
            description: 'Full system access',
            permissions: ['Create', 'Edit', 'Delete', 'Manage Users']
        },
        {
            id: 'manager',
            name: 'Manager',
            icon: Users,
            color: 'from-teal-500 to-emerald-500',
            description: 'Manage schedules',
            permissions: ['View All', 'Edit Schedules', 'Export']
        },
        {
            id: 'employee',
            name: 'Employee',
            icon: User,
            color: 'from-blue-500 to-indigo-500',
            description: 'View own schedule',
            permissions: ['View Only', 'Personal Schedule']
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                await account.createEmailPasswordSession(formData.email, formData.password);
                setSuccess('Login successful! Redirecting...');
                
                // Get user data
                const user = await account.get();
                setTimeout(() => {
                    onAuthSuccess({ ...user, role: 'admin' }); // Get role from prefs later
                }, 1000);
            } else {
                // Signup
                const user = await account.create(
                    ID.unique(),
                    formData.email,
                    formData.password,
                    formData.name
                );
                
                // Store role in user preferences
                await account.updatePrefs({ role: formData.role });
                
                // Auto login after signup
                await account.createEmailPasswordSession(formData.email, formData.password);
                
                setSuccess('Account created! Welcome aboard! 🎉');
                setTimeout(() => {
                    onAuthSuccess({ ...user, role: formData.role });
                }, 1500);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl relative z-10"
            >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:block"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <img src={logo} alt="RotaBase" className="w-16 h-16 rounded-2xl shadow-2xl" />
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight">RotaBase</h1>
                                <p className="text-teal-400 font-bold text-sm">Smart Scheduling Platform</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-slate-300">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white mb-1">AI-Powered Scheduling</h3>
                                    <p className="text-sm text-slate-400">Generate fair, balanced rotas in seconds</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white mb-1">Role-Based Access</h3>
                                    <p className="text-sm text-slate-400">Admin, Manager, or Employee views</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white mb-1">Premium Experience</h3>
                                    <p className="text-sm text-slate-400">Beautiful UI with smooth animations</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Auth Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
                    >
                        {/* Toggle Login/Signup */}
                        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-black text-sm transition-all ${
                                    isLogin
                                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <LogIn size={16} className="inline mr-2" />
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-black text-sm transition-all ${
                                    !isLogin
                                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <UserPlus size={16} className="inline mr-2" />
                                Sign Up
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                            {isLogin ? 'Sign in to manage your schedules' : 'Join the smart scheduling revolution'}
                        </p>

                        {/* Error/Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name (Signup only) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                        placeholder="you@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                {!isLogin && (
                                    <p className="text-xs text-slate-500 mt-1.5">Minimum 8 characters</p>
                                )}
                            </div>

                            {/* Role Selection (Signup only) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-3">Select Your Role</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {roles.map((role) => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: role.id })}
                                                className={`p-3 rounded-xl border-2 transition-all ${
                                                    formData.role === role.id
                                                        ? `bg-gradient-to-br ${role.color} border-transparent text-white shadow-lg scale-105`
                                                        : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }`}
                                            >
                                                <role.icon size={20} className="mx-auto mb-1" />
                                                <div className="text-xs font-black">{role.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                    {formData.role && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700"
                                        >
                                            <p className="text-xs text-slate-400 mb-2">
                                                {roles.find(r => r.id === formData.role)?.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {roles.find(r => r.id === formData.role)?.permissions.map((perm, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold">
                                                        {perm}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-black shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </span>
                                ) : (
                                    <span>{isLogin ? 'Sign In' : 'Create Account'} →</span>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-xs text-slate-500 mt-6">
                            By continuing, you agree to our Terms & Privacy Policy
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
