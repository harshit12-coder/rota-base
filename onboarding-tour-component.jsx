{/* ==================== ONBOARDING TOUR 🗺️ ==================== */}
{/* Add this before the closing </div> of your main return, after the Shortcuts Menu */}

<AnimatePresence>
    {showOnboarding && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
                onClick={() => {
                    setShowOnboarding(false);
                    localStorage.setItem('rota_onboarding_done', 'true');
                }}
            />
            
            {onboardingStep === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                    <div className={`p-8 rounded-3xl border shadow-2xl max-w-md ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-3xl">
                                👋
                            </div>
                            <div>
                                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Welcome to RotaBase!
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Let's get you started</p>
                            </div>
                        </div>
                        <p className={`mb-6 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Create fair, balanced schedules in seconds with AI-powered auto-generation and drag-drop simplicity.
                        </p>
                        <button
                            onClick={() => setOnboardingStep(1)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-black hover:shadow-lg transition-all"
                        >
                            Start Tour →
                        </button>
                        <button
                            onClick={() => {
                                setShowOnboarding(false);
                                localStorage.setItem('rota_onboarding_done', 'true');
                            }}
                            className="w-full mt-2 px-6 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Skip tour
                        </button>
                    </div>
                </motion.div>
            )}
            
            {onboardingStep === 1 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-[320px] top-[200px] pointer-events-auto"
                >
                    <div className={`p-6 rounded-2xl border-2 shadow-xl max-w-sm ${isDarkMode ? 'bg-slate-900 border-teal-500' : 'bg-white border-teal-400'}`}>
                        <div className="mb-4">
                            <span className="text-xs font-black text-teal-600 uppercase tracking-wider">Step 1/3</span>
                            <h3 className={`text-lg font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Add Team Members
                            </h3>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Click <strong>"+ Add Employee"</strong> in the sidebar to add your team. Assign them shifts (A, B, or C).
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOnboardingStep(2)}
                                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700"
                            >
                                Next →
                            </button>
                            <button
                                onClick={() => setOnboardingStep(0)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                    <div className="absolute -left-4 top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-teal-500"></div>
                </motion.div>
            )}
            
            {onboardingStep === 2 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-[320px] top-[120px] pointer-events-auto"
                >
                    <div className={`p-6 rounded-2xl border-2 shadow-xl max-w-sm ${isDarkMode ? 'bg-slate-900 border-teal-500' : 'bg-white border-teal-400'}`}>
                        <div className="mb-4">
                            <span className="text-xs font-black text-teal-600 uppercase tracking-wider">Step 2/3</span>
                            <h3 className={`text-lg font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Generate Schedule
                            </h3>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Click "Generate ROTA" or press <kbd className="px-2 py-1 rounded bg-slate-700 text-white text-xs font-mono">Ctrl+G</kbd> to auto-create a balanced schedule.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOnboardingStep(3)}
                                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700"
                            >
                                Next →
                            </button>
                            <button
                                onClick={() => setOnboardingStep(1)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                    <div className="absolute -left-4 top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-teal-500"></div>
                </motion.div>
            )}
            
            {onboardingStep === 3 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                    <div className={`p-8 rounded-3xl border shadow-2xl max-w-md ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="text-5xl mb-4 text-center">🎉</div>
                        <h2 className={`text-2xl font-black mb-4 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            You're All Set!
                        </h2>
                        <div className={`space-y-2.5 mb-6 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            <p className="flex items-center gap-2">✅ Drag & drop employees to schedule</p>
                            <p className="flex items-center gap-2">✅ Press <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-white text-xs">?</kbd> for keyboard shortcuts</p>
                            <p className="flex items-center gap-2">✅ Export to Excel or share via Outlook</p>
                            <p className="flex items-center gap-2">✅ View stats with <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-white text-xs">Ctrl+I</kbd></p>
                        </div>
                        <button
                            onClick={() => {
                                setShowOnboarding(false);
                                localStorage.setItem('rota_onboarding_done', 'true');
                                celebrate('epic');
                                playSound('success');
                                showNotification('🎊 Welcome aboard! Let\'s create amazing schedules!', 'success');
                            }}
                            className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-black hover:shadow-lg transition-all"
                        >
                            Start Scheduling! 🚀
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )}
</AnimatePresence>
