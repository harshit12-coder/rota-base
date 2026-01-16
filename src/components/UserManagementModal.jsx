import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shield, ShieldAlert, Trash2, Mail, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserManagementModal({ isOpen, onClose, isDarkMode }) {
    const { getTeamMembers, addToRole, removeFromRole } = useAuth();
    
    const [activeTab, setActiveTab] = useState('employee'); // 'admin', 'manager', 'employee'
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Add User State
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg: '' }

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            setFeedback(null);
        }
    }, [isOpen, activeTab]);

    const fetchMembers = async () => {
        setLoading(true);
        const list = await getTeamMembers(activeTab);
        setMembers(list);
        setLoading(false);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        setFeedback(null);
        
        const result = await addToRole(newUserEmail, activeTab, newUserName);
        
        if (result.success) {
            setFeedback({ type: 'success', msg: `Invited ${newUserEmail} to ${activeTab} team` });
            setNewUserEmail('');
            setNewUserName('');
            fetchMembers(); // Refresh list
        } else {
            setFeedback({ type: 'error', msg: result.error });
        }
        setIsAdding(false);
    };

    const handleRemoveUser = async (membershipId, email) => {
        if (!window.confirm(`Are you sure you want to remove ${email} from ${activeTab}s?`)) return;
        
        const result = await removeFromRole(activeTab, membershipId);
        if (result.success) {
            setMembers(members.filter(m => m.$id !== membershipId));
        } else {
            alert("Failed to remove: " + result.error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
            >
                {/* Header */}
                <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Manage Roles
                            </h2>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Control Access Permissions
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={() => setActiveTab('employee')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'employee' 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                                : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <Users size={14} />
                            Employees
                        </button>
                        <button
                            onClick={() => setActiveTab('manager')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'manager' 
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                                : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <Shield size={14} />
                            Managers
                        </button>
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'admin' 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                                : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <ShieldAlert size={14} />
                            Admins
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Add User Form */}
                    <form onSubmit={handleAddUser} className={`p-4 rounded-xl border mb-6 ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="text-xs font-black uppercase text-slate-500 mb-3 flex items-center gap-2">
                            <Plus size={12} /> Add New {activeTab}
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <input 
                                    type="email"
                                    placeholder="User Email"
                                    value={newUserEmail}
                                    onChange={e => setNewUserEmail(e.target.value)}
                                    required
                                    className={`flex-[2] bg-transparent border rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'border-slate-600 text-slate-200' : 'border-slate-300 text-slate-700'}`}
                                />
                                <input 
                                    type="text"
                                    placeholder="Name (Optional)"
                                    value={newUserName}
                                    onChange={e => setNewUserName(e.target.value)}
                                    className={`flex-1 bg-transparent border rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'border-slate-600 text-slate-200' : 'border-slate-300 text-slate-700'}`}
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isAdding}
                                className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 text-white transition-all ${isAdding ? 'opacity-70 cursor-wait' : ''} ${activeTab === 'admin' ? 'bg-red-500 hover:bg-red-600' : activeTab === 'manager' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                                {isAdding ? 'Processing...' : `Invite & Add to ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s`}
                            </button>
                        </div>
                        
                        {/* Feedback Message */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className={`mt-3 text-[10px] font-bold flex items-center gap-1.5 ${feedback.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}
                                >
                                    {feedback.type === 'success' ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                                    {feedback.msg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Member List */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 px-1 mb-2">
                            <span>Current Members ({members.length})</span>
                            {loading && <Loader2 size={12} className="animate-spin" />}
                        </div>
                        
                        <div className="max-h-[240px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
                            {members.length === 0 && !loading ? (
                                <div className="text-center py-6 text-slate-500 text-xs italic">
                                    No members found in this team.
                                </div>
                            ) : (
                                members.map(member => (
                                    <div key={member.$id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${activeTab === 'admin' ? 'bg-red-500' : activeTab === 'manager' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                                                {(member.userName || member.name)?.[0]?.toUpperCase() || (member.userEmail || member.email)?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className={`text-xs font-bold leading-none mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    {member.userName || (member.userEmail && member.userEmail.includes('@') ? member.userEmail.split('@')[0] : 'User')}
                                                </div>
                                                <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                                    {member.userEmail || <span className="text-slate-600 italic">No Email</span>}
                                                    {member.confirm && <span className="text-emerald-500 font-bold ml-1">• Verified</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveUser(member.$id, member.userEmail)}
                                            title="Remove from role"
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
