import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, Loader2, ShieldCheck, User, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityMascot from './SecurityMascot';

export default function Login() {
    const { login, signup } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    
    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('rota_theme') === 'dark');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;
        if (isSignup) {
            result = await signup(email, password, name);
        } else {
            result = await login(email, password);
        }
        if (!result.success) {
            setError(result.error || 'Failed to login');
            setLoading(false);
        }
        // If success, AuthContext will update user and redirect automatically due to App.jsx logic we will add
    };

    // Theme Effect & Zoom Check
    React.useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            document.body.style.backgroundColor = '#0f172a'; // slate-900
        } else {
            root.classList.remove('dark');
            document.body.style.backgroundColor = '#f8fafc'; // slate-50
        }
        localStorage.setItem('rota_theme', isDarkMode ? 'dark' : 'light');
        
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div className={`min-h-[111.12vh] w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
            
            {/* Theme Toggle Button */}
            <button 
                onClick={toggleTheme}
                className={`absolute top-6 right-6 p-3 rounded-full transition-all z-50 ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 shadow-lg shadow-black/20' : 'bg-white text-orange-500 hover:bg-slate-100 shadow-md border border-slate-200'}`}
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} className="text-indigo-600" />}
            </button>

            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {isDarkMode ? (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_800px_at_center,transparent_40%,#020617_100%)]"></div>
                    </>
                ) : (
                    <>
                         <div className="absolute top-0 left-0 w-full h-full bg-[#f8fafc]"></div>
                         <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
                         <div className="absolute -bottom-40 -left-60 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_800px_at_center,transparent_40%,#f8fafc_100%)]"></div>
                    </>
                )}
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`z-10 w-full max-w-md p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl relative transition-all duration-300 ${isDarkMode 
                    ? 'bg-slate-800/40 border-slate-700/50' 
                    : 'bg-white/70 border-white/50 shadow-slate-200/50'}`}
            >
                {/* Glossy overlay */}
                <div className={`absolute inset-0 rounded-3xl pointer-events-none ${isDarkMode ? 'bg-gradient-to-b from-white/5 to-transparent' : 'bg-gradient-to-b from-white/40 to-transparent'}`}></div>

                <div className="text-center mb-8 relative">
                    {/* Replaced Icon with Mascot */}
                    <div className="flex justify-center -mt-4 mb-2">
                         <SecurityMascot isPasswordFocused={isPasswordFocused} />
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </h1>
                    {/* <p className={`mt-3 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isSignup ? "Create your access credentials" : "Authenticate to access the Rota System"}
                    </p> */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            {error}
                        </motion.div>
                    )}

                    <AnimatePresence>
                    {isSignup && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Full Name</label>
                            <div className="relative group">
                                <User className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-4 transition-all font-medium ${isDarkMode 
                                        ? 'bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/10' 
                                        : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/30 focus:ring-emerald-500/5'}`}
                                    placeholder="John Doe"
                                    required={isSignup}
                                />
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</label>
                        <div className="relative group">
                            <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-4 transition-all font-medium ${isDarkMode 
                                    ? 'bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/10' 
                                    : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/30 focus:ring-emerald-500/5'}`}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Password</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-4 transition-all font-medium tracking-widest ${isDarkMode 
                                    ? 'bg-slate-950/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/10' 
                                    : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/30 focus:ring-emerald-500/5'}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="animate-pulse">Verifying...</span>
                            </>
                        ) : (
                            <>
                                <span>{isSignup ? "Create Account" : "Access Dashboard"}</span>
                                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                            }}
                            className={`text-xs font-semibold uppercase tracking-wide transition-colors ${isDarkMode ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}
                        >
                            {isSignup 
                                ? "Already a member? Sign In" 
                                : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </motion.div>
            
            {/* <div className={`absolute bottom-6 text-center w-full z-10 ${isDarkMode ? 'opacity-40 text-slate-500' : 'opacity-60 text-slate-400'}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Secure Rota Management System v2.0</p>
            </div> */}
        </div>
    );
}
