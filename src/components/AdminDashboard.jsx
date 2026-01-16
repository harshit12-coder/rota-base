import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shield, ShieldAlert, Loader2, CheckCircle2, ChevronRight, Search, LayoutGrid, List, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard({ isOpen, onClose, isDarkMode }) {
    const { getAllMembers, changeUserRole } = useAuth();
    
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        const list = await getAllMembers();
        setMembers(list);
        setLoading(false);
    };

    const handleRoleChange = async (member, newRole) => {
        if (member.role === newRole) return;
        if (!window.confirm(`Are you sure you want to change ${member.name || member.email}'s role from ${member.role} to ${newRole}?`)) return;

        // Optimistic Update
        const oldRole = member.role;
        setMembers(prev => prev.map(m => m.userId === member.userId ? { ...m, role: newRole, updating: true } : m));

        const result = await changeUserRole(member.$id, member.userEmail || member.email, member.userName || member.name, oldRole, newRole);

        if (result.success) {
            // Success: remove loading state
            setMembers(prev => prev.map(m => m.userId === member.userId ? { ...m, updating: false } : m));
        } else {
            // Revert
            alert("Failed to update role: " + result.error);
            setMembers(prev => prev.map(m => m.userId === member.userId ? { ...m, role: oldRole, updating: false } : m));
        }
    };

    const filteredMembers = members.filter(m => 
        (m.name || m.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (m.email || m.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full max-w-5xl h-[80vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
            >
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                            <LayoutGrid className="text-indigo-500 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Admin Dashboard
                            </h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Manage Users & Roles
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         <div className={`relative px-4 py-2 rounded-xl border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            <Search size={16} className="text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-xs font-bold w-48 placeholder:font-medium"
                            />
                        </div>

                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Users Table */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
                                <Loader2 size={32} className="animate-spin text-indigo-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">Loading Users...</span>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
                                <Users size={32} />
                                <span className="text-xs font-bold">No users found. Start by inviting someone!</span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="grid grid-cols-[auto_1fr_1fr_1fr_120px] gap-4 pb-4 border-b text-[10px] font-bold uppercase text-slate-500 px-4">
                                    <div className="w-8"></div>
                                    <div>User</div>
                                    <div>Email</div>
                                    <div>Status</div>
                                    <div>Role</div>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {filteredMembers.map(member => (
                                        <div key={member.userId} className={`grid grid-cols-[auto_1fr_1fr_1fr_120px] gap-4 items-center p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                                                member.role === 'admin' ? 'bg-red-500' : 
                                                member.role === 'manager' ? 'bg-indigo-500' : 'bg-emerald-500'
                                            }`}>
                                                {(member.userName || member.name)?.[0]?.toUpperCase() || (member.userEmail || member.email)?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            
                                            <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {member.userName || member.name || 'Unknown User'}
                                            </div>

                                            <div className="text-xs font-medium text-slate-500 truncate" title={member.userEmail || member.email}>
                                                {member.userEmail || member.email}
                                            </div>

                                            <div>
                                                {member.confirm ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                                                        <CheckCircle2 size={10} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div>
                                                {member.updating ? (
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                        <Loader2 size={10} className="animate-spin" /> Updating...
                                                    </div>
                                                ) : (
                                                    <div className="relative group">
                                                        <select
                                                            value={member.role}
                                                            onChange={(e) => handleRoleChange(member, e.target.value)}
                                                            className={`appearance-none w-full pl-3 pr-8 py-1.5 rounded-lg text-[10px] font-bold outline-none border cursor-pointer transition-all ${
                                                                member.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 
                                                                member.role === 'manager' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/20' : 
                                                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                                                            }`}
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="manager">Manager</option>
                                                            <option value="employee">Employee</option>
                                                        </select>
                                                        <ChevronRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
