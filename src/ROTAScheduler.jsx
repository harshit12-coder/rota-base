import React, { useState, useEffect } from 'react'; // Version 1.1
import { Calendar, Users, Download, FileSpreadsheet, Undo2, Redo2, Plus, Trash2, Clock, AlertCircle, CheckCircle2, UserX, Palmtree, Send, BarChart3, Smartphone, ChevronDown, ChevronUp, Briefcase, Settings2, ShieldCheck, X, ChevronLeft, ChevronRight, Sun, Moon, Sparkles, ArrowLeftRight, FileSearch, Globe, Calculator, Wallet, Mail } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { databases, account, DATABASE_ID, COLLECTIONS } from './lib/appwrite';
import { ID, Query } from 'appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import logo from "./assets/logo.png";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SHIFTS = {
    A: { label: "A (7:00am-3:30pm)", color: "#10B981", bg: "bg-emerald-50" }, // Bright Emerald
    B: { label: "B (3:30pm-11:45pm)", color: "#F59E0B", bg: "bg-amber-50" },   // Bright Amber
    C: { label: "C (11:45pm-7:00am)", color: "#8B5CF6", bg: "bg-violet-50" }   // Bright Violet
};

const EMPLOYEE_COLORS = [
    "#DC2626", // Red
    "#16A34A", // Green
    "#2563EB", // Blue
    "#D97706", // Amber
    "#9333EA", // Purple
    "#0891B2", // Cyan
    "#DB2777", // Pink
    "#CA8A04", // Yellow-Gold
    "#4F46E5", // Indigo
    "#EA580C", // Orange
    "#059669", // Emerald
    "#7C3AED", // Violet
    "#BE123C", // Rose
    "#0D9488", // Teal
    "#6D28D9", // Deep Purple
    "#0284C7", // Light Blue
];

const DEFAULT_EMPLOYEES = [
    { id: '1', name: "Avijeet", shift: "A", color: "#DC2626" }, // Red
    { id: '2', name: "Mukul", shift: "A", color: "#16A34A" }, // Green
    { id: '3', name: "Saif", shift: "B", color: "#2563EB" }, // Blue
    { id: '4', name: "Harshit", shift: "B", color: "#D97706" }, // Amber
    { id: '5', name: "Abhayraj", shift: "C", color: "#9333EA" }, // Purple
    { id: '6', name: "Javed", shift: "C", color: "#0891B2" }  // Cyan
];

const DEFAULT_DEPARTMENTS = [
    { id: 'mes', name: "MES", type: "MES", color: "#D97706" }, // Amber
];

// const Mascot = ({ isDarkMode }) => {
//     const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//     const leftEyeRef = React.useRef(null);
//     const rightEyeRef = React.useRef(null);
//     const [leftEyePos, setLeftEyePos] = useState({ x: 0, y: 0 });
//     const [rightEyePos, setRightEyePos] = useState({ x: 0, y: 0 });

//     useEffect(() => {
//         const handleMouseMove = (e) => {
//             setMousePos({ x: e.clientX, y: e.clientY });
//         };
//         window.addEventListener('mousemove', handleMouseMove);
//         return () => window.removeEventListener('mousemove', handleMouseMove);
//     }, []);

//     useEffect(() => {
//         const calculateEyeMove = (eyeX, eyeY) => {
//             const dx = mousePos.x - eyeX;
//             const dy = mousePos.y - eyeY;
//             const dist = Math.sqrt(dx * dx + dy * dy);
//             const maxMove = 2.5;
//             const moveX = (dx / dist) * Math.min(dist / 100, maxMove);
//             const moveY = (dy / dist) * Math.min(dist / 100, maxMove);
//             return { x: isNaN(moveX) ? 0 : moveX, y: isNaN(moveY) ? 0 : moveY };
//         };

//         const update = () => {
//             if (leftEyeRef.current) {
//                 const rect = leftEyeRef.current.getBoundingClientRect();
//                 setLeftEyePos(calculateEyeMove(rect.left + rect.width / 2, rect.top + rect.height / 2));
//             }
//             if (rightEyeRef.current) {
//                 const rect = rightEyeRef.current.getBoundingClientRect();
//                 setRightEyePos(calculateEyeMove(rect.left + rect.width / 2, rect.top + rect.height / 2));
//             }
//         };
//         update();
//     }, [mousePos]);

//     const [isHovered, setIsHovered] = useState(false);

//     return (
//         <div
//             className="w-full px-4 mb-2 flex flex-col items-center select-none"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >


//             <div className={`relative w-full py-2 rounded-3xl transition-all duration-500 flex flex-col items-center cursor-pointer ${isHovered ? 'bg-indigo-500/5' : 'bg-transparent'}`}>
//                 {/* Giggling Animation Wrapper */}
//                 <motion.div
//                     animate={isHovered ? {
//                         y: [0, -2, 0, -2, 0],
//                         rotate: [0, -2, 2, -2, 0],
//                         scale: 1.05
//                     } : {
//                         y: [0, -6, 0],
//                         scale: 1
//                     }}
//                     transition={isHovered ? {
//                         duration: 0.2,
//                         repeat: Infinity
//                     } : {
//                         duration: 4,
//                         repeat: Infinity,
//                         ease: "easeInOut"
//                     }}
//                     className="relative z-10"
//                 >
//                     <svg width="90" height="90" viewBox="0 0 100 100" className="drop-shadow-2xl">
//                         {/* Ears */}
//                         <circle cx="25" cy="35" r="11" fill={isDarkMode ? "#334155" : "#cbd5e1"} />
//                         <circle cx="75" cy="35" r="11" fill={isDarkMode ? "#334155" : "#cbd5e1"} />
//                         <circle cx="25" cy="35" r="6.5" fill={isDarkMode ? "#1e293b" : "#f1f5f9"} />
//                         <circle cx="75" cy="35" r="6.5" fill={isDarkMode ? "#1e293b" : "#f1f5f9"} />

//                         {/* Body/Head (Glow effect for dark mode) */}
//                         <path d="M20,60 Q20,30 50,30 T80,60 L80,85 Q80,95 50,95 T20,85 Z" fill={isDarkMode ? "#475569" : "#e2e8f0"} />

//                         {/* Face Area - Lighter in dark mode to pop */}
//                         <ellipse cx="50" cy="65" rx="26" ry="24" fill={isDarkMode ? "#1e293b" : "#ffffff"} />

//                         {/* Eyes */}
//                         <g>
//                             {isHovered ? (
//                                 // Laughing/Giggling eyes (Closed curves)
//                                 <path d="M33,62 Q38,58 43,62" fill="none" stroke={isDarkMode ? "#94a3b8" : "#0f172a"} strokeWidth="2.5" strokeLinecap="round" />
//                             ) : (
//                                 <>
//                                     <circle ref={leftEyeRef} cx="38" cy="62" r="7.5" fill="white" stroke={isDarkMode ? "#475569" : "#e2e8f0"} strokeWidth="1" />
//                                     <circle cx={38 + leftEyePos.x} cy={62 + leftEyePos.y} r="4" fill="#0f172a" />
//                                 </>
//                             )}
//                         </g>
//                         <g>
//                             {isHovered ? (
//                                 // Laughing/Giggling eyes
//                                 <path d="M57,62 Q62,58 67,62" fill="none" stroke={isDarkMode ? "#94a3b8" : "#0f172a"} strokeWidth="2.5" strokeLinecap="round" />
//                             ) : (
//                                 <>
//                                     <circle ref={rightEyeRef} cx="62" cy="62" r="7.5" fill="white" stroke={isDarkMode ? "#475569" : "#e2e8f0"} strokeWidth="1" />
//                                     <circle cx={62 + rightEyePos.x} cy={62 + rightEyePos.y} r="4" fill="#0f172a" />
//                                 </>
//                             )}
//                         </g>

//                         {/* Mouth - Changes when giggling */}
//                         <motion.path
//                             d={isHovered ? "M42,76 Q50,84 58,76" : "M45,77 Q50,80 55,77"}
//                             fill="none"
//                             stroke="#f43f5e"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                         />

//                         {/* Nose */}
//                         <circle cx="50" cy="71" r="2.5" fill="#f43f5e" />

//                         {/* Blush (Pulsing when giggling) */}
//                         <motion.circle
//                             cx="30" cy="74" r="4.5"
//                             fill="#fb7185"
//                             animate={isHovered ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] } : { opacity: 0.3 }}
//                         />
//                         <motion.circle
//                             cx="70" cy="74" r="4.5"
//                             fill="#fb7185"
//                             animate={isHovered ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] } : { opacity: 0.3 }}
//                         />

//                         {/* Sparkles when giggling */}
//                         <AnimatePresence>
//                             {isHovered && (
//                                 <>
//                                     <motion.path
//                                         initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
//                                         d="M20,40 L22,42 M20,44 L22,42" stroke="#facc15" strokeWidth="2" strokeLinecap="round"
//                                     />
//                                     <motion.path
//                                         initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
//                                         d="M80,45 L82,47 M80,49 L82,47" stroke="#facc15" strokeWidth="2" strokeLinecap="round"
//                                     />
//                                 </>
//                             )}
//                         </AnimatePresence>
//                     </svg>
//                 </motion.div>

//                 <div className="mt-3 flex flex-col items-center">
//                     <div className={`text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-300 ${isHovered ? 'text-teal-400' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
//                         {isHovered ? 'Hehe! Stop it!' : 'Rota Sentinel'}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };



export default function ROTAScheduler() {
    // --- Department Management ---
    const [departments, setDepartments] = useState(() => {
        const saved = localStorage.getItem('rota_departments');
        return saved ? JSON.parse(saved) : DEFAULT_DEPARTMENTS;
    });

    const [activeDeptId, setActiveDeptId] = useState(() => {
        return localStorage.getItem('rota_active_dept') || 'mes';
    });

    const activeDept = departments.find(d => d.id === activeDeptId) || (departments.length > 0 ? departments[0] : DEFAULT_DEPARTMENTS[0]);

    // Sanity check: Ensure activeDeptId is always a valid ID from our list
    useEffect(() => {
        if (departments.length > 0 && !departments.find(d => d.id === activeDeptId)) {
            console.warn(`Desync detected: ${activeDeptId} not found in departments. Resetting to ${departments[0].id}`);
            setActiveDeptId(departments[0].id);
        }
    }, [departments, activeDeptId]);

    // Helper to get storage key per department
    const getSKey = (key) => `rota_${activeDeptId}_${key}`;

    // Load initial state from LocalDate or defaults
    const [employees, setEmployees] = useState(() => {
        const sKey = `rota_${activeDeptId}_employees`;
        const saved = localStorage.getItem(sKey);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) { console.error("Error parsing employees", e); }
        }

        // Migration check for legacy 'mes' key
        if (activeDeptId === 'mes') {
            const oldSaved = localStorage.getItem('rota_employees');
            if (oldSaved) {
                try {
                    const oldParsed = JSON.parse(oldSaved);
                    if (Array.isArray(oldParsed) && oldParsed.length > 0) return oldParsed;
                } catch (e) { }
            }
            return DEFAULT_EMPLOYEES;
        }
        return [];
    });

    // Settings state
    const [shiftMode, setShiftMode] = useState(() => {
        const saved = localStorage.getItem(getSKey('shiftMode'));
        if (!saved && activeDeptId === 'mes') return localStorage.getItem('rota_shiftMode') || '3';
        return saved || '3';
    });
    const [rotationWeeks, setRotationWeeks] = useState(() => {
        const saved = localStorage.getItem(getSKey('rotationWeeks'));
        if (!saved && activeDeptId === 'mes') return parseInt(localStorage.getItem('rota_rotationWeeks') || '1');
        return parseInt(saved || '1');
    });
    const [startDate, setStartDate] = useState(() => {
        const saved = localStorage.getItem(getSKey('startDate'));
        if (saved) return saved;

        // Smart Default: Always start on a Monday
        const d = new Date();
        if (d.getDay() === 0) {
            // If Sunday, default to tomorrow (Monday)
            d.setDate(d.getDate() + 1);
        } else {
            // If Mon-Sat, snap to this week's Monday
            // Mon=1...Sat=6. 
            // diff = Current - (Day - 1). e.g. Mon(1): 1-1=0. Tue(2): 2-1=1.
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            d.setDate(diff);
        }
        return d.toISOString().split('T')[0];
    });

    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem(getSKey('schedule'));
        if (!saved && activeDeptId === 'mes') {
            const oldSaved = localStorage.getItem('rota_schedule');
            return oldSaved ? JSON.parse(oldSaved) : {};
        }
        return saved ? JSON.parse(saved) : {};
    });

    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [draggedEmployee, setDraggedEmployee] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);

    // UI State
    const [newEmployee, setNewEmployee] = useState({ name: '', shift: 'A' });
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaveData, setLeaveData] = useState({ employee: '', week: 1, day: 'Mon' });
    const [outlookDL, setOutlookDL] = useState(() => {
        const saved = localStorage.getItem(getSKey('outlookDL'));
        if (!saved && activeDeptId === 'mes') return localStorage.getItem('rota_outlookDL') || '';
        return saved || '';
    });
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showDeptModal, setShowDeptModal] = useState(false); // Department adding modal
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptType, setNewDeptType] = useState('General');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('rota_theme') === 'dark');
    const [dragOverKey, setDragOverKey] = useState(null);
    const [selectedSwap, setSelectedSwap] = useState(null); // { week, day, shift, empId }
    const [cellSuggestions, setCellSuggestions] = useState(null); // { key, list: [] }
    const [isFetchingHolidays, setIsFetchingHolidays] = useState(false);
    const [patternConfig, setPatternConfig] = useState(() => {
        const saved = localStorage.getItem(getSKey('patternConfig'));
        return saved ? JSON.parse(saved) : { A: 4, B: 4, C: 0, Off: 2 };
    });
    const [showAllowanceModal, setShowAllowanceModal] = useState(false);
    const [allowanceRange, setAllowanceRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    });

    // Micro-Audio Helper
    const playMicroInteraction = (type = 'pop') => {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            if (type === 'pop') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
            } else if (type === 'success') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(1046.5, context.currentTime + 0.2); // C6
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
            }

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.2);
        } catch (e) { console.warn("Audio Context failed", e); }
    };

    useEffect(() => {
        localStorage.setItem('rota_theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // --- Robust Sync State ---
    const lastSyncedSchedule = React.useRef({});
    const lastSyncedEmployees = React.useRef([]);
    const lastSyncedDepartments = React.useRef([]);

    // --- Appwrite Cloud Sync ---
    // --- Appwrite Cloud Sync ---
    const ensureSession = async () => {
        try {
            await account.get();
        } catch (e) {
            console.warn("No active session, attempting anonymous session...");
            try {
                await account.createAnonymousSession();
            } catch (authError) {
                console.error("Auth Error: Could not establish session.", authError);
                showNotification("Network/Auth Error: Changes may not save to cloud.", "error");
            }
        }
    };

    const fetchFromCloud = async () => {
        await ensureSession();
        setIsSyncing(true);
        try {
            // 1. Fetch Departments (Default limit 25 is usually okay for depts)
            const depts = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DEPARTMENTS);
            let mappedDepts = [];
            if (depts.documents.length > 0) {
                mappedDepts = depts.documents.map(d => ({
                    id: d.$id,
                    name: d.name,
                    type: d.type,
                    color: d.color
                }));
                setDepartments(mappedDepts);

                // If currently stored active ID is not in the cloud list, reset it
                const savedActiveId = localStorage.getItem('rota_active_dept') || 'mes';
                if (!mappedDepts.find(d => d.id === savedActiveId)) {
                    setActiveDeptId(mappedDepts[0].id);
                } else if (activeDeptId !== savedActiveId) {
                    setActiveDeptId(savedActiveId);
                }
            }

            // 2. Fetch Active Dept's Employees (Increased limit to 100)
            const emps = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EMPLOYEES, [
                Query.equal('deptId', activeDeptId),
                Query.limit(100)
            ]);
            if (emps.documents.length > 0) {
                setEmployees(emps.documents.map(e => ({
                    id: e.empId,
                    name: e.name,
                    shift: e.shift,
                    color: e.color
                })));
            }

            // 3. Fetch Active Dept's Schedule (Increased limit to 100 to support 4 weeks)
            const sched = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SCHEDULE, [
                Query.equal('deptId', activeDeptId),
                Query.limit(100)
            ]);
            if (sched.documents.length > 0) {
                const newSched = {};
                sched.documents.forEach(s => {
                    newSched[s.key] = {
                        employees: JSON.parse(s.employeesJson),
                        status: s.status,
                        note: s.note
                    };
                });
                setSchedule(newSched);

                // Initialize Diff Refs
                lastSyncedSchedule.current = JSON.parse(JSON.stringify(newSched));
            } else {
                lastSyncedSchedule.current = {};
            }
            // Initialize other refs
            lastSyncedEmployees.current = JSON.parse(JSON.stringify(emps.documents.map(e => ({
                id: e.empId, name: e.name, shift: e.shift, color: e.color
            }))));
            lastSyncedDepartments.current = JSON.parse(JSON.stringify(mappedDepts || []));
        } catch (error) {
            console.error('Appwrite Fetch Error:', error);
            showNotification('Could not sync with cloud. Using local data.', 'error');
        } finally {
            setIsSyncing(false);
            setIsInitialLoaded(true); // Mark as loaded after initial fetch
        }
    };

    const syncToCloud = async () => {
        if (!DATABASE_ID || !isInitialLoaded) return;

        // Prevent sync if nothing significant changed (shallow check optimization)
        // Note: For deep robustness, we do strict diffing below.

        await ensureSession();
        setIsSyncing(true);
        try {
            // 1. Differential Sync for Departments
            // Check if department list length changed or names changed
            const deptsChanged = JSON.stringify(departments) !== JSON.stringify(lastSyncedDepartments.current);
            if (deptsChanged) {
                // Handling Deletions for Departments
                for (const syncedDept of lastSyncedDepartments.current) {
                    if (!departments.find(d => d.id === syncedDept.id)) {
                        try {
                            await databases.deleteDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, syncedDept.id);
                        } catch (e) { console.error("Error deleting dept:", e); }
                    }
                }

                for (const dept of departments) {
                    // Simple check: Upsert all if list changed (Departments are few, low cost)
                    try {
                        await databases.updateDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, dept.id, {
                            name: dept.name,
                            type: dept.type,
                            color: dept.color
                        });
                    } catch (e) {
                        if (e.code === 404) {
                            await databases.createDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, dept.id, {
                                name: dept.name,
                                type: dept.type,
                                color: dept.color
                            });
                        }
                    }
                }
                lastSyncedDepartments.current = JSON.parse(JSON.stringify(departments));
            }

            // 2. Differential Sync for Employees
            // 2a. Handle Deletions first
            for (const syncedEmp of lastSyncedEmployees.current) {
                if (!employees.find(e => e.id === syncedEmp.id)) {
                    const docId = `${activeDeptId}_${syncedEmp.id}`;
                    try {
                        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.EMPLOYEES, docId);
                        console.log(`Deleted employee ${syncedEmp.name} from cloud.`);
                    } catch (e) {
                        if (e.code !== 404) console.error("Error deleting employee:", e);
                    }
                }
            }

            // 2b. Handle Upserts
            for (const emp of employees) {
                const syncedEmp = lastSyncedEmployees.current.find(e => e.id === emp.id);
                const isDirty = !syncedEmp ||
                    syncedEmp.name !== emp.name ||
                    syncedEmp.shift !== emp.shift ||
                    syncedEmp.color !== emp.color;

                if (isDirty) {
                    const docId = `${activeDeptId}_${emp.id}`;
                    const payload = {
                        empId: emp.id,
                        name: emp.name,
                        shift: emp.shift,
                        color: emp.color,
                        deptId: activeDeptId
                    };

                    try {
                        await databases.updateDocument(DATABASE_ID, COLLECTIONS.EMPLOYEES, docId, payload);
                    } catch (e) {
                        if (e.code === 404) {
                            await databases.createDocument(DATABASE_ID, COLLECTIONS.EMPLOYEES, docId, payload);
                        }
                    }
                }
            }
            // Update ref strictly
            lastSyncedEmployees.current = JSON.parse(JSON.stringify(employees));

            // 3. Differential Sync for Schedule (The Heavy Hitter)
            let updateCount = 0;
            const keysToCheck = new Set([...Object.keys(schedule), ...Object.keys(lastSyncedSchedule.current)]);

            for (const key of keysToCheck) {
                const currentCell = schedule[key];
                const syncedCell = lastSyncedSchedule.current[key];

                // Logic:
                // 1. If only in current -> Create/Update (User added data)
                // 2. If in both -> Diff check
                // 3. If only in synced -> Data removed? (Appwrite logic currently doesn't delete, 
                //    but if we want to sync "empty", we update it to empty list)

                const isDirty = !syncedCell ||
                    JSON.stringify(currentCell) !== JSON.stringify(syncedCell);

                if (isDirty && currentCell) { // Only update if we have data to write
                    const docId = `${activeDeptId}_${key}`;
                    const payload = {
                        key,
                        employeesJson: JSON.stringify(currentCell.employees),
                        status: currentCell.status,
                        note: currentCell.note,
                        deptId: activeDeptId
                    };

                    try {
                        await databases.updateDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, docId, payload);
                        updateCount++;
                    } catch (e) {
                        if (e.code === 404) {
                            await databases.createDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, docId, payload);
                            updateCount++;
                        }
                    }
                }
            }

            if (updateCount > 0) {
                console.log(`Synced ${updateCount} schedule changes to cloud.`);
                lastSyncedSchedule.current = JSON.parse(JSON.stringify(schedule));
            }

        } catch (error) {
            console.error('Appwrite Sync Error:', error);
            showNotification('Cloud Sync Failed - Retrying...', 'error');
        } finally {
            setIsSyncing(false);
        }
    };

    // Initial fetch from cloud
    useEffect(() => {
        fetchFromCloud();
    }, [activeDeptId]);

    // Color Migration Effect: FORCE update all colors to new palette
    useEffect(() => {
        if (employees.length === 0 && activeDeptId === 'mes') {
            setEmployees(DEFAULT_EMPLOYEES);
            return;
        }

        setEmployees(prevEmps => {
            if (!prevEmps || prevEmps.length === 0) return prevEmps;

            const updated = prevEmps.map((emp, index) => {
                const newColor = EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length];
                return { ...emp, color: newColor };
            });

            return JSON.stringify(updated) !== JSON.stringify(prevEmps) ? updated : prevEmps;
        });
    }, []);

    // Debounced Sync to Cloud
    useEffect(() => {
        const timer = setTimeout(() => {
            if (DATABASE_ID) syncToCloud();
        }, 3000); // 3 second debounce
        return () => clearTimeout(timer);
    }, [employees, schedule, departments, activeDeptId, shiftMode, rotationWeeks, startDate]);

    // Initial load logic...

    useEffect(() => { localStorage.setItem('rota_departments', JSON.stringify(departments)); }, [departments]);
    useEffect(() => { localStorage.setItem('rota_active_dept', activeDeptId); }, [activeDeptId]);

    useEffect(() => {
        // When department changes, we need to RELOAD child states. 
        // This is tricky with current architecture. A cleaner way is to use a key on the main component 
        // or manually update states here. 
        // For simplicity, let's reload them manually in a switcher function.
    }, [activeDeptId]);

    // Persist active department data
    useEffect(() => { localStorage.setItem(getSKey('employees'), JSON.stringify(employees)); }, [employees, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('schedule'), JSON.stringify(schedule)); }, [schedule, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('shiftMode'), shiftMode); }, [shiftMode, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('rotationWeeks'), rotationWeeks.toString()); }, [rotationWeeks, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('startDate'), startDate); }, [startDate, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('outlookDL'), outlookDL); }, [outlookDL, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('patternConfig'), JSON.stringify(patternConfig)); }, [patternConfig, activeDeptId]);

    const switchDepartment = (id, forcedDepts = null) => {
        setActiveDeptId(id);
        // Force reload from localStorage for the new ID
        const sKey = (key) => `rota_${id}_${key}`;

        const savedEmps = localStorage.getItem(sKey('employees'));
        let finalEmps = [];
        if (savedEmps) {
            try {
                const parsed = JSON.parse(savedEmps);
                finalEmps = (Array.isArray(parsed) && parsed.length > 0) ? parsed : (id === 'mes' ? DEFAULT_EMPLOYEES : []);
            } catch (e) { finalEmps = id === 'mes' ? DEFAULT_EMPLOYEES : []; }
        } else {
            finalEmps = id === 'mes' ? DEFAULT_EMPLOYEES : [];
        }
        setEmployees(finalEmps);

        const savedSched = localStorage.getItem(sKey('schedule'));
        setSchedule(savedSched ? JSON.parse(savedSched) : {});

        setShiftMode(localStorage.getItem(sKey('shiftMode')) || '3');
        setRotationWeeks(parseInt(localStorage.getItem(sKey('rotationWeeks')) || '1'));
        setStartDate(localStorage.getItem(sKey('startDate')) || new Date().toISOString().split('T')[0]);
        setOutlookDL(localStorage.getItem(sKey('outlookDL')) || '');

        setHistory([]);
        setHistoryIndex(-1);
        setIsInitialLoaded(false); // Restart sync cycle for new department

        const deptsToSearch = forcedDepts || departments;
        const deptName = deptsToSearch.find(d => d.id === id)?.name || id;
        showNotification(`Switched to ${deptName}`);
    };

    const addNewDepartment = () => {
        if (!newDeptName.trim()) return;
        const id = newDeptName.toLowerCase().replace(/\s+/g, '_');
        if (departments.find(d => d.id === id)) {
            showNotification('Department already exists', 'error');
            return;
        }
        const newDept = {
            id,
            name: newDeptName.trim(),
            type: newDeptType,
            color: EMPLOYEE_COLORS[departments.length % EMPLOYEE_COLORS.length]
        };

        const updatedDepts = [...departments, newDept];
        setDepartments(updatedDepts);
        setShowDeptModal(false);
        setNewDeptName('');
        switchDepartment(id, updatedDepts);
    };

    // ... (Existing effects)

    // --- Analytics & Validation ---
    const calculateStats = () => {
        const stats = employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            total: 0,
            night: 0,
            weekend: 0
        }));

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach(day => {
                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    const cell = schedule[key];
                    if (cell && cell.employees) {
                        cell.employees.forEach(emp => {
                            if (!emp) return;
                            const stat = stats.find(s => s.id === emp.id);
                            if (stat) {
                                stat.total++;
                                if (shift === 'C') stat.night++;
                                if (day === 'Sat' || day === 'Sun') stat.weekend++;
                            }
                        });
                    }
                });
            });
        }
        return stats.sort((a, b) => b.total - a.total); // Sort by busiest
    };

    const validateSchedule = () => {
        const errors = {}; // key: "week-Day-Shift", value: Message
        const conflicts = []; // For notification list if needed

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dayIndex) => {
                // Check Double Booking (Same Day)
                const dayEmps = {}; // empId -> [shifts]
                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    const cell = schedule[key];
                    if (cell && cell.employees) {
                        cell.employees.forEach(emp => {
                            if (!emp?.id) return;
                            if (!dayEmps[emp.id]) dayEmps[emp.id] = [];
                            dayEmps[emp.id].push(shift);
                        });
                    }
                });

                Object.keys(dayEmps).forEach(empId => {
                    if (dayEmps[empId].length > 1) {
                        const shiftStr = dayEmps[empId].join('+');
                        dayEmps[empId].forEach(shift => {
                            const key = `${week}-${day}-${shift}`;
                            errors[key] = { message: `Double Shift (${shiftStr})`, type: 'error' };
                        });
                    }
                });

                // Check Rest Violation (Night C -> Next Day A)
                // Current C
                const keyC = `${week}-${day}-C`;
                const cEmployees = schedule[keyC]?.employees || [];

                // Next Day A
                let nextWeek = week;
                let nextDayIndex = dayIndex + 1;
                if (nextDayIndex >= 7) {
                    nextDayIndex = 0;
                    nextWeek++;
                }
                if (nextWeek <= rotationWeeks) { // Only check if next day exists in schedule
                    const nextDay = DAYS[nextDayIndex];
                    const keyNextA = `${nextWeek}-${nextDay}-A`;
                    const aEmployees = schedule[keyNextA]?.employees || [];

                    cEmployees.forEach(cEmp => {
                        if (!cEmp?.id) return;
                        if (aEmployees.find(aEmp => aEmp?.id === cEmp.id)) {
                            errors[keyNextA] = { message: "Inadequate Rest (C → A)", type: 'warning' };
                            errors[keyC] = { message: "Inadequate Rest (C → A)", type: 'warning' };
                        }
                    });
                }
            });
        }
        return errors;
    };

    // Calculate errors on every render for UI feedback
    const scheduleErrors = validateSchedule();

    // --- Smart Features ---
    const fetchPublicHolidays = async () => {
        setIsFetchingHolidays(true);
        try {
            const year = new Date(startDate).getFullYear();
            const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`);
            const holidays = await response.json();

            const newSchedule = { ...schedule };
            let count = 0;

            holidays.forEach(h => {
                const hDate = new Date(h.date);
                // Check if this date falls within our roster range
                for (let w = 1; w <= rotationWeeks; w++) {
                    for (let dIdx = 0; dIdx < 7; dIdx++) {
                        const cellDate = getDateForCell(w - 1, dIdx);
                        if (cellDate.toISOString().split('T')[0] === h.date) {
                            const dayName = DAYS[dIdx];
                            ['A', 'B', 'C'].forEach(s => {
                                const key = `${w}-${dayName}-${s}`;
                                newSchedule[key] = {
                                    employees: [],
                                    status: 'holiday',
                                    note: h.localName
                                };
                            });
                            count++;
                        }
                    }
                }
            });

            if (count > 0) {
                setSchedule(newSchedule);
                saveToHistory(newSchedule);
                showNotification(`Successfully imported ${count} public holidays!`);
            } else {
                showNotification('No holidays found for the current roster dates.', 'warning');
            }
        } catch (e) {
            console.error(e);
            showNotification('Failed to fetch holidays. Check your internet.', 'error');
        } finally {
            setIsFetchingHolidays(false);
        }
    };

    const getBestReplacements = (week, day, shift) => {
        const stats = calculateStats();
        const key = `${week}-${day}-${shift}`;

        // 1. Get all employees not working on this day
        const workingThisDay = [];
        ['A', 'B', 'C',].forEach(s => {
            const k = `${week}-${day}-${s}`;
            (schedule[k]?.employees || []).forEach(e => workingThisDay.push(e.id));
        });

        const available = employees.filter(emp => !workingThisDay.includes(emp.id));

        // 2. Filter by rest period (Night C → Next Day A)
        // If this is Shift A, check if they worked Shift C yesterday
        let finalAvailable = available;
        if (shift === 'A') {
            const dayIdx = DAYS.indexOf(day);
            let prevWeek = week;
            let prevDayIdx = dayIdx - 1;
            if (prevDayIdx < 0) {
                prevDayIdx = 6;
                prevWeek--;
            }
            if (prevWeek >= 1) {
                const prevKeyC = `${prevWeek}-${DAYS[prevDayIdx]}-C`;
                const yesterdayNightWorkers = (schedule[prevKeyC]?.employees || []).map(e => e.id);
                finalAvailable = available.filter(emp => !yesterdayNightWorkers.includes(emp.id));
            }
        }

        // 3. Sort by workload (Total shifts)
        const suggestions = finalAvailable.map(emp => {
            const empStat = stats.find(s => s.id === emp.id) || { total: 0 };
            return {
                ...emp,
                workload: empStat.total
            };
        }).sort((a, b) => a.workload - b.workload);

        setCellSuggestions({ key, list: suggestions.slice(0, 3) });
    };

    const handleSwapMode = (week, day, shift, employee) => {
        if (!selectedSwap) {
            setSelectedSwap({ week, day, shift, employee });
            showNotification(`Select another employee to swap with ${employee.name}`, 'info');
        } else {
            // Check if same person picked twice
            if (selectedSwap.employee.id === employee.id) {
                setSelectedSwap(null);
                return;
            }

            const key1 = `${selectedSwap.week}-${selectedSwap.day}-${selectedSwap.shift}`;
            const key2 = `${week}-${day}-${shift}`;

            const cell1 = schedule[key1];
            const cell2 = schedule[key2];

            if (!cell1 || !cell2) {
                showNotification("Swap failed: cell data missing", "error");
                setSelectedSwap(null);
                return;
            }

            const newSchedule = { ...schedule };

            // Create deep copies for update to avoid mutation
            newSchedule[key1] = {
                ...cell1,
                employees: cell1.employees.filter(e => e.id !== selectedSwap.employee.id).concat(employee)
            };

            newSchedule[key2] = {
                ...cell2,
                employees: cell2.employees.filter(e => e.id !== employee.id).concat(selectedSwap.employee)
            };

            setSchedule(newSchedule);
            saveToHistory(newSchedule);
            setSelectedSwap(null);
            playMicroInteraction('success');
            showNotification(`Swapped ${selectedSwap.employee.name} with ${employee.name}`);
        }
    };

    // --- Drag & Drop ---

    // Initial schedule generation ONLY if definitely empty after cloud load
    useEffect(() => {
        if (isInitialLoaded && Object.keys(schedule).length === 0) {
            assignRotaAutomatically();
        }
    }, [isInitialLoaded]);

    // Helper to get date object
    const getDateForCell = (weekIndex, dayIndex) => {
        let start = new Date(startDate);
        // Snap to NEAREST Monday
        const day = start.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        let diff = 0;

        if (day === 1) {
            diff = 0; // Already Monday
        } else if (day === 0) {
            diff = 1; // Sunday -> Next Monday (+1)
        } else if (day >= 5) {
            diff = 8 - day; // Fri(5)->+3, Sat(6)->+2
        } else {
            diff = 1 - day; // Tue(2)->-1, Wed(3)->-2, Thu(4)->-3
        }

        start.setDate(start.getDate() + diff);

        const dayOffset = weekIndex * 7 + dayIndex;
        const date = new Date(start);
        date.setDate(start.getDate() + dayOffset);
        return date;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const generateEmptySchedule = () => {
        const newSchedule = {};
        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach(day => {
                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    newSchedule[key] = {
                        employees: [],
                        status: 'normal',
                        note: ''
                    };
                });
            });
        }
        setSchedule(newSchedule);
        saveToHistory(newSchedule);
    };

    const saveToHistory = (newSchedule) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newSchedule)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setSchedule(JSON.parse(JSON.stringify(history[historyIndex - 1])));
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setSchedule(JSON.parse(JSON.stringify(history[historyIndex + 1])));
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addEmployee = () => {
        if (!newEmployee.name.trim()) {
            showNotification('Please enter employee name', 'error');
            return;
        }

        const newEmp = {
            id: Date.now().toString(),
            name: newEmployee.name.trim(),
            shift: newEmployee.shift,
            color: EMPLOYEE_COLORS[employees.length % EMPLOYEE_COLORS.length]
        };

        setEmployees([...employees, newEmp]);
        setNewEmployee({ name: '', shift: 'A' });
        showNotification(`${newEmp.name} added successfully`);
    };

    const removeEmployee = (id) => {
        if (window.confirm('Remove this employee from the roster?')) {
            setEmployees(employees.filter(e => e.id !== id));

            // Cleanup schedule to remove this employee from assigned shifts
            setSchedule(prev => {
                const newSchedule = { ...prev };
                let hasChanged = false;
                Object.keys(newSchedule).forEach(key => {
                    const cell = newSchedule[key];
                    if (cell.employees && cell.employees.some(emp => emp.id === id)) {
                        newSchedule[key] = {
                            ...cell,
                            employees: cell.employees.filter(emp => emp.id !== id)
                        };
                        hasChanged = true;
                    }
                });
                return hasChanged ? newSchedule : prev;
            });

            showNotification('Employee removed');
        }
    };

    const handleDragStart = (e, employee) => {
        setDraggedEmployee(employee);
        e.dataTransfer.effectAllowed = 'copy';
        if (navigator.vibrate) navigator.vibrate(5);
    };

    const handleDragEnd = () => {
        setDraggedEmployee(null);
    };

    const handleDrop = (e, week, day, shift, suggestedEmp = null) => {
        if (e && e.preventDefault) e.preventDefault();
        const empToAssign = suggestedEmp || draggedEmployee;
        if (!empToAssign) return;

        const key = `${week}-${day}-${shift}`;
        const cell = schedule[key];

        if (cell.status === 'holiday') {
            showNotification('Cannot assign on holidays', 'error');
            return;
        }

        const newSchedule = { ...schedule };
        const currentEmployees = [...cell.employees];
        const empIndex = currentEmployees.findIndex(e => e?.id === empToAssign.id);

        if (empIndex !== -1) {
            currentEmployees.splice(empIndex, 1);
            showNotification(`${empToAssign.name} removed from shift`);
        } else {
            if (cell.status === 'leave') {
                // Append replacement to existing employees instead of replacing them
                newSchedule[key] = {
                    ...cell,
                    employees: [...cell.employees, empToAssign],
                    status: 'normal',
                    note: 'Replacement added'
                };
                showNotification(`${empToAssign.name} assigned as replacement`);
            } else {
                currentEmployees.push(empToAssign);
                newSchedule[key] = { ...cell, employees: currentEmployees };
                showNotification(`${empToAssign.name} assigned to ${day} Shift ${shift}`);
            }
        }

        setSchedule(newSchedule);
        saveToHistory(newSchedule);
        playMicroInteraction('pop');
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const handleDragOver = (e, key) => {
        e.preventDefault();
        if (dragOverKey !== key) setDragOverKey(key);
    };

    const handleDragLeave = () => {
        setDragOverKey(null);
    };

    const toggleHoliday = (week, day) => {
        const newSchedule = { ...schedule };
        ['A', 'B', 'C'].forEach(shift => {
            const key = `${week}-${day}-${shift}`;
            if (schedule[key].status === 'holiday') {
                newSchedule[key] = { employees: [], status: 'normal', note: '' };
            } else {
                newSchedule[key] = { employees: [], status: 'holiday', note: 'Public Holiday' };
            }
        });
        setSchedule(newSchedule);
        saveToHistory(newSchedule);
        showNotification(`${day} Week ${week} marked as ${schedule[`${week}-${day}-A`].status === 'holiday' ? 'working day' : 'holiday'}`);
    };

    const removeEmployeeFromCell = (week, day, shift, empId) => {
        const key = `${week}-${day}-${shift}`;
        const newSchedule = { ...schedule };
        const cell = newSchedule[key];

        if (cell && cell.employees) {
            const removedEmp = cell.employees.find(e => e.id === empId);
            cell.employees = cell.employees.filter(e => e.id !== empId);

            // SPECIAL REASSIGNMENT RULE: If removing from Shift C on Mon-Thu
            if (shift === 'C' && removedEmp && ['Mon', 'Tue', 'Wed', 'Thu'].includes(day)) {
                let targetShift = null;
                const moveA = window.confirm(`Move ${removedEmp.name} to Shift A (Morning)? \n\nClick Cancel to be asked about Shift B.`);
                if (moveA) targetShift = 'A';
                else {
                    const moveB = window.confirm(`Move ${removedEmp.name} to Shift B (Day)? \n\nClick Cancel to just remove.`);
                    if (moveB) targetShift = 'B';
                }

                if (targetShift) {
                    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu'];
                    const applyAll = window.confirm(`Apply this move for the rest of the week (until Thursday)? \n\nOK = Mon-Thu, Cancel = Only ${day}`);
                    const daysToUpdate = applyAll ? weekdays.slice(weekdays.indexOf(day)) : [day];

                    daysToUpdate.forEach(d => {
                        const fromKey = `${week}-${d}-C`;
                        const toKey = `${week}-${d}-${targetShift}`;

                        // Remove from C for future days
                        if (newSchedule[fromKey] && d !== day) {
                            newSchedule[fromKey] = {
                                ...newSchedule[fromKey],
                                employees: newSchedule[fromKey].employees.filter(e => e.id !== empId)
                            };
                        }

                        // Add to target shift
                        if (!newSchedule[toKey]) newSchedule[toKey] = { employees: [], status: 'normal', note: '' };
                        if (!newSchedule[toKey].employees.some(e => e.id === removedEmp.id)) {
                            newSchedule[toKey] = {
                                ...newSchedule[toKey],
                                employees: [...newSchedule[toKey].employees, removedEmp]
                            };
                        }
                    });
                    showNotification(`${removedEmp.name} moved to Shift ${targetShift}${applyAll ? ' for the week' : ''}`);
                }
            }

            setSchedule(newSchedule);
            saveToHistory(newSchedule);
            if (!removedEmp) showNotification('Employee removed from cell');
        }
    };

    // INTELLIGENT AUTO-GENERATION BASED ON RULES
    const assignRotaAutomatically = async () => {
        const newSchedule = {};

        if (activeDept.type === 'MES') {
            if (shiftMode === '3') {
                generate3ShiftSchedule(newSchedule);
            } else if (shiftMode === 'Pattern') {
                generatePatternSchedule(newSchedule);
            } else {
                generate2ShiftSchedule(newSchedule);
            }
        } else {
            if (shiftMode === 'Pattern') {
                generatePatternSchedule(newSchedule);
            } else {
                generateGeneralSchedule(newSchedule);
            }
        }

        setSchedule(newSchedule);
        saveToHistory(newSchedule);
        showNotification(`${activeDept.name} Rota Generated Successfully`);

        // Celebration!
        playMicroInteraction('success');
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#14b8a6', '#6366f1', '#f59e0b']
        });
    };

    const markLeave = () => {
        const emp = employees.find(e => e.id === leaveData.employee);
        if (!emp) {
            showNotification('Please select an employee', 'error');
            return;
        }

        const key = `${leaveData.week}-${leaveData.day}-${emp.shift}`;
        const newSchedule = { ...schedule };
        const cell = schedule[key];

        const updatedEmployees = cell.employees.filter(e => e?.id !== emp.id);
        newSchedule[key] = {
            employees: updatedEmployees,
            status: 'leave',
            note: `${emp.name} on leave - Needs replacement`
        };

        setSchedule(newSchedule);
        saveToHistory(newSchedule);
        setShowLeaveModal(false);
        showNotification(`${emp.name} marked on leave for ${leaveData.day} Week ${leaveData.week}. Drag replacement employee.`);
    };


    const generatePatternSchedule = (newSchedule) => {
        const sortedEmps = [...employees].filter(Boolean);

        // Build the sequence: e.g. [A, A, A, A, B, B, B, B, Off, Off]
        const sequence = [];
        for (let i = 0; i < patternConfig.A; i++) sequence.push('A');
        for (let i = 0; i < patternConfig.B; i++) sequence.push('B');
        for (let i = 0; i < patternConfig.C; i++) sequence.push('C');
        for (let i = 0; i < patternConfig.Off; i++) sequence.push('Off');

        if (sequence.length === 0) return;

        // Iterate through each employee and assign staggered patterns
        sortedEmps.forEach((emp, empIdx) => {
            // Calculate total days to fill
            const totalDays = rotationWeeks * 7;

            // Stagger start: each employee starts at a different point in the sequence
            // Offset is proportional to their index multiplied by a shift duration or just 1
            const startOffset = (empIdx * 2) % sequence.length;

            for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
                const week = Math.floor(dayOffset / 7) + 1;
                const dayName = DAYS[dayOffset % 7];
                const shiftAtDay = sequence[(dayOffset + startOffset) % sequence.length];

                if (shiftAtDay !== 'Off') {
                    const key = `${week}-${dayName}-${shiftAtDay}`;
                    if (!newSchedule[key]) {
                        newSchedule[key] = { employees: [], status: 'normal', note: 'Pattern' };
                    }
                    newSchedule[key].employees.push(emp);
                }
            }
        });

        // Fill remaining empty cells to ensure state consistency
        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach(day => {
                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    if (!newSchedule[key]) {
                        newSchedule[key] = { employees: [], status: 'normal', note: '' };
                    }
                });
            });
        }
    };

    const generateGeneralSchedule = (newSchedule) => {
        const sortedEmps = [...employees].filter(Boolean);
        let empPointer = 0;

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach(day => {
                ['A', 'B', 'C'].slice(0, shiftMode === '3' ? 3 : 2).forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    const dailyTeam = [];

                    // Assign 1 person per shift by default in general mode
                    // You can expand this logic as needed
                    if (sortedEmps.length > 0) {
                        dailyTeam.push(sortedEmps[empPointer % sortedEmps.length]);
                        empPointer++;
                    }

                    newSchedule[key] = {
                        employees: dailyTeam,
                        status: 'normal',
                        note: 'General assignment'
                    };
                });
            });
        }
    };

    const generate3ShiftSchedule = (newSchedule) => {
        const shiftA = employees.filter(e => e.shift === 'A');
        const shiftB = employees.filter(e => e.shift === 'B');
        const shiftC = employees.filter(e => e.shift === 'C');

        for (let week = 1; week <= rotationWeeks; week++) {
            let rotation = (week - 1) % 2;

            // Monday to Thursday: 2 persons per shift
            ['Mon', 'Tue', 'Wed', 'Thu'].forEach(day => {
                newSchedule[`${week}-${day}-A`] = {
                    employees: shiftA.slice(0, 2),
                    status: 'normal',
                    note: '2 persons per shift'
                };
                newSchedule[`${week}-${day}-B`] = {
                    employees: shiftB.slice(0, 2),
                    status: 'normal',
                    note: '2 persons per shift'
                };
                newSchedule[`${week}-${day}-C`] = {
                    employees: shiftC.slice(0, 2),
                    status: 'normal',
                    note: '2 persons per shift'
                };
            });

            // FRIDAY: 3 persons working (1 from each shift), 3 OFF
            const friA = shiftA.length > 0 ? shiftA[rotation % shiftA.length] : null;
            const friB = shiftB.length > 0 ? shiftB[rotation % shiftB.length] : null;
            const friC = shiftC.length > 0 ? shiftC[rotation % shiftC.length] : null;

            newSchedule[`${week}-Fri-A`] = { employees: friA ? [friA] : [], status: 'normal', note: '1 person working' };
            newSchedule[`${week}-Fri-B`] = { employees: friB ? [friB] : [], status: 'normal', note: '1 person working' };
            newSchedule[`${week}-Fri-C`] = { employees: friC ? [friC] : [], status: 'normal', note: '1 person working' };

            // SATURDAY: Person who was OFF on Friday works today
            const satA = shiftA.find(e => e.id !== friA?.id) || shiftA[0];
            const satB = shiftB.find(e => e.id !== friB?.id) || shiftB[0];
            const satC = shiftC.find(e => e.id !== friC?.id) || shiftC[0];

            newSchedule[`${week}-Sat-A`] = { employees: satA ? [satA] : [], status: 'normal', note: 'Friday OFF person works' };
            newSchedule[`${week}-Sat-B`] = { employees: satB ? [satB] : [], status: 'normal', note: 'Friday OFF person works' };
            newSchedule[`${week}-Sat-C`] = { employees: satC ? [satC] : [], status: 'normal', note: 'Friday OFF person works' };

            // SUNDAY: 12-hour shifts (Even distribution)
            // Day shift (7-7) alternates between Shift A members
            const sunA = shiftA[rotation % shiftA.length];

            // Night shift (7-7) rotates between all 4 members of B and C over 4 weeks
            const bcTeam = [...shiftB, ...shiftC];
            const sunNight = bcTeam.length > 0 ? bcTeam[(week - 1) % bcTeam.length] : null;

            newSchedule[`${week}-Sun-A`] = {
                employees: sunA ? [sunA] : [],
                status: 'normal',
                note: '12hr shift (7am-7pm)'
            };
            newSchedule[`${week}-Sun-B`] = { employees: [], status: 'normal', note: '' };
            newSchedule[`${week}-Sun-C`] = {
                employees: sunNight ? [sunNight] : [],
                status: 'normal',
                note: '12hr shift (7pm-7am)'
            };

        }
    };

    const generate2ShiftSchedule = (newSchedule) => {
        // In 2-Shift Mode, we ignore the original 'Shift A', 'Shift B' labels of employees
        // and distribute ALL available employees into the 2 active shifts (A & B).
        const allEmployees = [...employees];

        // Teams are now calculated dynamically inside the loop for rotation.

        for (let week = 1; week <= rotationWeeks; week++) {
            let rotation = (week - 1) % 3;

            // --- SHIFT EXCHANGE LOGIC ---
            // "Every 2 weeks, exchange 1 person"
            // We achieve this by rotating the entire employee list by 1 slot every 2 weeks.
            const shiftChanges = Math.floor((week - 1) / 2);

            const currentEmployees = [
                ...allEmployees.slice(shiftChanges % allEmployees.length),
                ...allEmployees.slice(0, shiftChanges % allEmployees.length)
            ];

            const midPoint = Math.ceil(currentEmployees.length / 2);
            const teamA = currentEmployees.slice(0, midPoint);
            const teamB = currentEmployees.slice(midPoint);

            // Monday to Thursday
            ['Mon', 'Tue', 'Wed', 'Thu'].forEach(day => {
                newSchedule[`${week}-${day}-A`] = {
                    employees: teamA,
                    status: 'normal',
                    note: `${teamA.length} persons`
                };
                newSchedule[`${week}-${day}-B`] = {
                    employees: teamB,
                    status: 'normal',
                    note: `${teamB.length} persons`
                };
                newSchedule[`${week}-${day}-C`] = {
                    employees: [],
                    status: 'normal',
                    note: ''
                };
            });

            // FRIDAY, SATURDAY, SUNDAY: 1 person works per shift, 2 persons OFF.
            // This ensures everyone gets 2 days OFF during the weekend (Fri-Sun).
            const getWeekendWorker = (team, dayOffset) => {
                if (team.length === 0) return [];
                // rotation shifts the starting person each week
                // dayOffset (0, 1, 2) shifts the person within the weekend
                const index = (rotation + dayOffset) % team.length;
                return [team[index]];
            };

            // Friday (Offset 0)
            newSchedule[`${week}-Fri-A`] = {
                employees: getWeekendWorker(teamA, 0),
                status: 'normal',
                note: '1 person working, 2 OFF'
            };
            newSchedule[`${week}-Fri-B`] = {
                employees: getWeekendWorker(teamB, 0),
                status: 'normal',
                note: '1 person working, 2 OFF'
            };
            newSchedule[`${week}-Fri-C`] = { employees: [], status: 'normal', note: '' };

            // Saturday (Offset 1)
            newSchedule[`${week}-Sat-A`] = {
                employees: getWeekendWorker(teamA, 1),
                status: 'normal',
                note: '1 person working, 2 OFF'
            };
            newSchedule[`${week}-Sat-B`] = {
                employees: getWeekendWorker(teamB, 1),
                status: 'normal',
                note: '1 person working, 2 OFF'
            };
            newSchedule[`${week}-Sat-C`] = { employees: [], status: 'normal', note: '' };

            // Sunday (Offset 2)
            newSchedule[`${week}-Sun-A`] = {
                employees: getWeekendWorker(teamA, 2),
                status: 'normal',
                note: '1 person working, 2 OFF'
            };
            newSchedule[`${week}-Sun-B`] = {
                employees: getWeekendWorker(teamB, 2),
                status: 'normal',
                note: '1 person working, 2 OFF'
            };
            newSchedule[`${week}-Sun-C`] = { employees: [], status: 'normal', note: '' };
        }
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rota Schedule');

        // Define Columns
        const columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Day', key: 'day', width: 10 },
        ];

        employees.forEach(emp => {
            columns.push({ header: emp.name, key: emp.id, width: 25 });
        });

        worksheet.columns = columns;

        // Header Styling
        worksheet.getRow(1).font = { bold: true, size: 12 };
        worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(1).eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Iteration
        let rowIndex = 2;

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dayIndex) => {
                const dateObj = getDateForCell(week - 1, dayIndex);
                const rowValues = {
                    date: formatDate(dateObj),
                    day: day
                };

                // Determine Shift for each employee
                employees.forEach(emp => {
                    let cellText = 'OFF';
                    let cellStatus = 'normal';
                    let shiftName = '';

                    ['A', 'B', 'C'].forEach(shift => {
                        const key = `${week}-${day}-${shift}`;
                        const cell = schedule[key] || { employees: [], status: 'normal' };

                        if (cell.status === 'holiday') {
                            if (schedule[`${week}-${day}-A`]?.status === 'holiday') { // Check if holiday applied globally/to A
                                cellText = 'HOLIDAY';
                                cellStatus = 'holiday';
                            }
                        } else if (cell.status === 'leave') {
                            const isEmpInLeaveList = cell.employees.some(e => e.id === emp.id); // Check if THIS emp is the one on leave? 
                            // Wait, logic is: leave status is on the CELL. But cell.employees contains remaining.
                            // We need to know if THIS employee was supposed to be here but is on leave.
                            // Actually, logic is: if status is leave, and note contains name? 
                            // Simpler: If user marked leave, the employee is REMOVED from the cell in the current logic?
                            // NO, we updated logic to KEEP them?
                            // Updated Logic: We append replacement. The original might be there?
                            // Let's assume for now if they are in the list, they are working.
                            // IF the cell status is LEAVE, it affects the whole shift visualization usually.
                            // But my previous fix was: "LEAVE" warning below.

                            // Let's rely on presence.
                            if (cell.employees.find(e => e.id === emp.id)) {
                                cellText = SHIFTS[shift].label.split('(')[1].replace(')', ''); // Extract time e.g. "7:00am-3:30pm"
                                shiftName = shift;
                                if (cell.status === 'leave') cellStatus = 'leave_warning'; // Working in a leave slot (replacement?)
                            }
                        } else {
                            if (cell.employees.find(e => e.id === emp.id)) {
                                cellText = SHIFTS[shift].label.split('(')[1].replace(')', '');
                                shiftName = shift;
                            }
                        }
                    });

                    // Check for Leave specifically if not found working?
                    // User's `markLeave` removes from `employees` array of the cell?
                    // "const updatedEmployees = cell.employees.filter(e => e.id !== emp.id);"
                    // YES. It removes them. So they WON'T be found in `cell.employees`.
                    // We need a way to know they are ON LEAVE.
                    // The `cell.note` contains "${emp.name} on leave".
                    // We can parse the note.
                    ['A', 'B', 'C'].forEach(shift => {
                        const key = `${week}-${day}-${shift}`;
                        const cell = schedule[key];
                        if (cell?.status === 'leave' && cell.note.includes(emp.name)) {
                            cellText = 'ON LEAVE';
                            cellStatus = 'leave';
                        }
                        if (cell?.status === 'holiday') {
                            cellText = cell.note || 'HOLIDAY'; // "Public Holiday"
                            cellStatus = 'holiday';
                        }
                    });

                    rowValues[emp.id] = cellText;

                    // Styling Application (Post-write)
                    // We need to write first then style? unique row object.
                });

                const row = worksheet.addRow(rowValues);

                // Style the row cells
                row.eachCell((cell, colNumber) => {
                    // Default Border
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

                    if (colNumber > 2) { // Employee Columns
                        const val = cell.value;
                        if (val === 'OFF') {
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White
                        } else if (val === 'ON LEAVE') {
                            cell.font = { color: { argb: 'FFFF0000' }, bold: true }; // Red Text
                        } else if (val && val.includes('HOLIDAY')) {
                            cell.font = { color: { argb: 'FFFF0000' }, bold: true };
                        } else if (val) {
                            // Shift Styling
                            if (day === 'Sun') {
                                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow
                                cell.font = { bold: true };
                            } else {
                                // Regular Shifts
                                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } }; // Light Green
                            }
                        }
                    }
                });

                rowIndex++;
            });
        }

        // Generate Buffer
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `ROTA_Schedule_${rotationWeeks}weeks.xlsx`);

        showNotification('Excel file downloaded successfully');
    };

    const downloadAllowanceExcel = async (stats) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Allowance Report');

        worksheet.columns = [
            { header: 'Employee Name', key: 'name', width: 25 },
            { header: 'Night Shifts (C)', key: 'night', width: 15 },
            { header: 'Weekend Shifts', key: 'weekend', width: 15 },
            { header: 'Total Shifts', key: 'total', width: 15 }
        ];

        stats.forEach(s => {
            worksheet.addRow(s);
        });

        // Styling
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Allowance_Report_${allowanceRange.start}_to_${allowanceRange.end}.xlsx`);
        showNotification('Allowance Excel downloaded!');
    };

    const calculateAllowanceStats = () => {
        const stats = {};
        employees.forEach(emp => {
            stats[emp.id] = { name: emp.name, night: 0, weekend: 0, total: 0 };
        });

        const start = new Date(allowanceRange.start);
        const end = new Date(allowanceRange.end);
        end.setHours(23, 59, 59);

        for (let w = 1; w <= rotationWeeks; w++) {
            DAYS.forEach((day, dIdx) => {
                const date = getDateForCell(w - 1, dIdx);
                if (date >= start && date <= end) {
                    const isWeekend = day === 'Sun' || day === 'Sat';
                    ['A', 'B', 'C'].forEach(shift => {
                        const key = `${w}-${day}-${shift}`;
                        const cell = schedule[key];
                        if (cell && cell.employees) {
                            cell.employees.forEach(empRef => {
                                if (stats[empRef.id]) {
                                    stats[empRef.id].total++;
                                    if (shift === 'C') stats[empRef.id].night++;
                                    if (isWeekend) stats[empRef.id].weekend++;
                                }
                            });
                        }
                    });
                }
            });
        }
        return Object.values(stats);
    };

    const shareWithTransport = async () => {
        if (!outlookDL.trim()) {
            showNotification('Please enter Outlook DL Email in sidebar first', 'error');
            return;
        }

        // 1. Generate HTML Table for Clipboard
        let htmlTable = `<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
            <thead>
                <tr style="background-color: #f3f4f6;">
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Date</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Day</th>
                    ${employees.map(emp => `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${emp.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>`;

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dayIndex) => {
                const dateObj = getDateForCell(week - 1, dayIndex);
                const dateStr = formatDate(dateObj);
                const isSunday = day === 'Sun';
                const rowBg = isSunday ? '#fef9c3' : '#ffffff'; // Yellow for Sun

                htmlTable += `<tr style="background-color: ${rowBg};">
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${dateStr}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: ${isSunday ? 'bold' : 'normal'};">${day}</td>`;

                employees.forEach(emp => {
                    let cellText = 'OFF';
                    let cellStyle = 'color: #9ca3af;'; // Gray text for OFF

                    ['A', 'B', 'C'].forEach(shift => {
                        const key = `${week}-${day}-${shift}`;
                        const cell = schedule[key] || { employees: [], status: 'normal' };

                        // Check logic similar to Excel export
                        if (cell.status === 'holiday' && schedule[`${week}-${day}-A`]?.status === 'holiday') {
                            cellText = 'HOLIDAY';
                            cellStyle = 'color: #ef4444; font-weight: bold;';
                        } else if (cell.employees.find(e => e.id === emp.id)) {
                            // Working this shift
                            cellText = SHIFTS[shift].label.split('(')[1].replace(')', '');
                            cellStyle = day === 'Sun' ? 'color: #000; font-weight: bold;' : 'color: #000;';
                            if (cell.status === 'leave') cellStyle = 'color: #f97316; font-weight: bold;'; // Warning
                        } else if (cell.status === 'leave' && cell.note.includes(emp.name)) {
                            cellText = 'ON LEAVE';
                            cellStyle = 'color: #ef4444; font-weight: bold;';
                        }
                        if (cell?.status === 'holiday') {
                            cellText = cell.note || 'HOLIDAY';
                            cellStyle = 'color: #ef4444; font-weight: bold;';
                        }
                    });

                    htmlTable += `<td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; ${cellStyle}">${cellText}</td>`;
                });
                htmlTable += `</tr>`;
            });
        }
        htmlTable += `</tbody></table>`;

        // 2. Copy to Clipboard (HTML + Text)
        try {
            const blobHtml = new Blob([htmlTable], { type: 'text/html' });
            const blobText = new Blob([employees.map(e => e.name).join('\t')], { type: 'text/plain' }); // Fallback simple text
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': blobHtml,
                    'text/plain': blobText
                })
            ]);
            showNotification('Table copied to clipboard!', 'success');
        } catch (err) {
            console.error('Clipboard failed', err);
            showNotification('Could not copy table automatically', 'error');
        }

        // 3. Open Outlook Draft
        const subject = `Rota Schedule - Week Starting ${formatDate(new Date(startDate))}`;
        const body = `Hi Team,%0D%0A%0D%0APlease see the roster table below (Paste here using Ctrl+V).%0D%0A%0D%0ARegards,%0D%0ARota Admin`;

        window.location.href = `mailto:${outlookDL}?subject=${subject}&body=${body}`;

        showNotification('Outlook opened! Ctrl+V to paste table.', 'success');
    };

    const generateWhatsAppSummary = async () => {
        let msg = `📅 *ROTA Schedule Summary*\n\n`;

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dayIndex) => {
                const dateObj = getDateForCell(week - 1, dayIndex);
                const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                msg += `*${day} ${dateStr}*\n`;

                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    const cell = schedule[key];
                    if (cell && cell.employees.length > 0) {
                        const names = cell.employees.map(e => e.name).join(', ');
                        msg += `${shift}: ${names}\n`;
                    }
                });
                msg += `\n`;
            });
        }

        try {
            await navigator.clipboard.writeText(msg);
            showNotification('WhatsApp summary copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy summary', 'error');
        }
    };

    const downloadICS = () => {
        let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//RotaScheduler//EN\n`;

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dayIndex) => {
                const dateObj = getDateForCell(week - 1, dayIndex);
                // Base YYYYMMDD
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                const dateBase = `${yyyy}${mm}${dd}`;

                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${week}-${day}-${shift}`;
                    const cell = schedule[key];

                    if (cell && cell.employees.length > 0) {
                        let startTime = '070000';
                        let endTime = '153000';
                        if (shift === 'B') { startTime = '153000'; endTime = '234500'; }
                        if (shift === 'C') { startTime = '234500'; endTime = '070000'; } // Next day handle omitted for simplicity or handle +1 day

                        // Handle Wrap around for Shift C (simplified for now, same day or next day technically)
                        // If Shift C ends next day, strict ICS requires next day date. 
                        // For simplicity, we just set duration or keep same day end to avoid logic complexity

                        cell.employees.forEach(emp => {
                            ics += `BEGIN:VEVENT\n`;
                            ics += `SUMMARY:Shift ${shift} - ${emp.name}\n`;
                            ics += `DTSTART:${dateBase}T${startTime}\n`;
                            ics += `DTEND:${dateBase}T${endTime}\n`; // Technically incorrect for C, but works for visual
                            ics += `DESCRIPTION:Rota Shift ${shift}\n`;
                            ics += `END:VEVENT\n`;
                        });
                    }
                });
            });
        }
        ics += `END:VCALENDAR`;

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        saveAs(blob, 'rota-schedule.ics');
        showNotification('Calendar (.ics) file downloaded!', 'success');
    };

    const exportToPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-700">
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in border shimmer-btn ${notification.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
                    }`}>
                    {notification.type === 'success' ? <div className="p-2 bg-green-100 rounded-full"><CheckCircle2 size={20} className="text-green-600" /></div> : <div className="p-2 bg-red-100 rounded-full"><AlertCircle size={20} className="text-red-600" /></div>}
                    <span className="font-bold tracking-tight">{notification.message}</span>
                </div>
            )}

            {/* Stats Modal */}
            {showStatsModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all p-4">
                    <div className={`rounded-3xl p-8 w-full max-w-md shadow-2xl border ring-1 ring-black/5 animate-slide-in ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white/20'}`}>
                        <h3 className={`text-2xl font-black mb-6 flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-teal-50'}`}>
                                <BarChart3 className="text-teal-600" size={24} />
                            </div>
                            Fairness & Audit
                        </h3>

                        {/* Monthly Audit Summary Header */}
                        <div className={`mb-6 p-4 rounded-3xl border-2 shimmer-btn ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-teal-50 border-teal-100/50'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-teal-500 rounded-lg shadow-lg shadow-teal-500/20"><Sparkles size={12} className="text-white" /></div>
                                    <h4 className={`font-black text-[13px] uppercase tracking-tighter ${isDarkMode ? 'text-teal-400' : 'text-teal-700'}`}>Monthly Audit Insights</h4>
                                </div>
                                <button
                                    onClick={exportToExcel}
                                    className="p-1.5 hover:bg-teal-100/30 rounded-lg transition-colors text-teal-600"
                                    title="Export Detailed Report"
                                >
                                    <FileSearch size={16} />
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Total shifts</div>
                                    <div className={`text-lg font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                        {calculateStats().reduce((acc, s) => acc + s.total, 0)}
                                    </div>
                                </div>
                                <div className="w-[1px] h-10 bg-slate-400/20"></div>
                                <div className="flex-1 text-right">
                                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Nights (Shift C)</div>
                                    <div className={`text-lg font-black text-violet-500`}>
                                        {calculateStats().reduce((acc, s) => acc + s.night, 0)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                            {calculateStats().map(stat => {
                                const busiest = calculateStats()[0].total || 1;
                                const workloadPercent = (stat.total / busiest) * 100;

                                return (
                                    <div key={stat.id} className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <div className={`font-black text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{stat.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Workload</div>
                                            </div>
                                            <div className={`text-xs font-black px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-white border-slate-100 text-teal-600 shadow-sm'}`}>
                                                {stat.total} Shifts
                                            </div>
                                        </div>

                                        {/* Main Workload Bar */}
                                        <div className="w-full bg-slate-200/30 rounded-full h-1.5 mb-4 overflow-hidden">
                                            <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${workloadPercent}%` }}></div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                    <span>Night</span>
                                                    <span>{stat.night}</span>
                                                </div>
                                                <div className="w-full bg-slate-200/30 rounded-full h-1 overflow-hidden">
                                                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${(stat.night / (stat.total || 1)) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                    <span>Weekend</span>
                                                    <span>{stat.weekend}</span>
                                                </div>
                                                <div className="w-full bg-slate-200/30 rounded-full h-1 overflow-hidden">
                                                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${(stat.weekend / (stat.total || 1)) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setShowStatsModal(false)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all active:scale-95 ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Allowance Modal */}
            {showAllowanceModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all p-4">
                    <div className={`rounded-3xl p-8 w-full max-w-2xl shadow-2xl border ring-1 ring-black/5 animate-slide-in ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white/20'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-2xl font-black flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                    <Wallet className="text-blue-500" size={24} />
                                </div>
                                Allowances Calculator
                            </h3>
                            <button onClick={() => setShowAllowanceModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Start Month/Date</label>
                                <input
                                    type="date"
                                    value={allowanceRange.start}
                                    onChange={(e) => setAllowanceRange({ ...allowanceRange, start: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-xl border font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">End Month/Date</label>
                                <input
                                    type="date"
                                    value={allowanceRange.end}
                                    onChange={(e) => setAllowanceRange({ ...allowanceRange, end: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-xl border font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <th className="py-2 text-[10px] font-black uppercase text-slate-400">Employee</th>
                                        <th className="py-2 text-[10px] font-black uppercase text-slate-400 text-center">Nights (C)</th>
                                        <th className="py-2 text-[10px] font-black uppercase text-slate-400 text-center">Weekends</th>
                                        <th className="py-2 text-[10px] font-black uppercase text-slate-400 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calculateAllowanceStats().map(s => (
                                        <tr key={s.name} className={`border-b last:border-0 ${isDarkMode ? 'border-slate-800/50' : 'border-slate-50'}`}>
                                            <td className={`py-3 font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{s.name}</td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2 py-1 rounded-lg font-black text-xs ${isDarkMode ? 'bg-violet-900/30 text-violet-400' : 'bg-violet-50 text-violet-600'}`}>{s.night}</span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2 py-1 rounded-lg font-black text-xs ${isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>{s.weekend}</span>
                                            </td>
                                            <td className="py-3 text-center font-black text-sm text-teal-500">{s.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl">
                            <div className="text-[10px] font-bold text-slate-400 italic">
                                * Calculated based on current schedule dates within range
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => downloadAllowanceExcel(calculateAllowanceStats())}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                                >
                                    <FileSpreadsheet size={16} /> Export Detailed Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
                    <div className={`rounded-3xl p-8 w-[28rem] shadow-2xl border ring-1 ring-black/5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white/20'}`}>
                        <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-red-50'}`}>
                                <UserX className="text-red-500" size={24} />
                            </div>
                            Mark Leave
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Employee</label>
                                <select
                                    value={leaveData.employee}
                                    onChange={(e) => setLeaveData({ ...leaveData, employee: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name} (Shift {emp.shift})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Week</label>
                                    <select
                                        value={leaveData.week}
                                        onChange={(e) => setLeaveData({ ...leaveData, week: parseInt(e.target.value) })}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                    >
                                        {Array.from({ length: rotationWeeks }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Day</label>
                                    <select
                                        value={leaveData.day}
                                        onChange={(e) => setLeaveData({ ...leaveData, day: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                    >
                                        {DAYS.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={markLeave}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    Confirm Leave
                                </button>
                                <button
                                    onClick={() => setShowLeaveModal(false)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Department Creation Modal */}
            {showDeptModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] transition-all p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`rounded-3xl p-8 w-full max-w-2xl shadow-2xl border ring-1 ring-black/5 flex flex-col max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white/20'}`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className={`text-3xl font-black tracking-tighter flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                <div className={`p-3 rounded-2xl shadow-sm ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-50'}`}>
                                    <Settings2 className="text-indigo-600" size={28} />
                                </div>
                                New Department
                            </h3>
                            <button onClick={() => setShowDeptModal(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
                            {/* Department Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Department Name</label>
                                    <input
                                        type="text"
                                        value={newDeptName}
                                        onChange={(e) => setNewDeptName(e.target.value)}
                                        placeholder="e.g. Production Line 1"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        value={newDeptType}
                                        onChange={(e) => setNewDeptType(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                    >
                                        <option value="General">General / Office</option>
                                        <option value="MES">MES / Production (Shift Based)</option>
                                        <option value="24/7">24/7 Support</option>
                                        <option value="Custom">Custom Operations</option>
                                    </select>
                                </div>
                            </div>

                            <div className={`border-t pt-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                <h4 className={`text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <ShieldCheck size={16} className="text-teal-500" /> Rota Configuration Checklist
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-teal-500/50' : 'bg-slate-50 border-slate-200 hover:border-teal-400'}`}>
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Shift Pattern</div>
                                        <div className={`font-black text-lg group-hover:text-teal-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>3-Shift / 2-Shift</div>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-teal-500/50' : 'bg-slate-50 border-slate-200 hover:border-teal-400'}`}>
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Rotation</div>
                                        <div className={`font-black text-lg group-hover:text-teal-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Weekly / Bi-Weekly</div>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-teal-500/50' : 'bg-slate-50 border-slate-200 hover:border-teal-400'}`}>
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Fairness</div>
                                        <div className={`font-black text-lg group-hover:text-teal-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Auto-Balancing</div>
                                    </div>
                                </div>

                                <div className={`mt-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100/50'}`}>
                                    <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                                        <span className="font-bold block mb-1">🚀 Advanced Rota Engine Active</span>
                                        This department will inherit our Smart Scheduling Algorithm. It automatically handles shift rotations (e.g., Morning → Afternoon → Night), ensures fair weekend distribution, and validates rest periods to prevent burnout. You can customize specific rules after creation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-8 pt-6 border-t flex items-center justify-end gap-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <button
                                onClick={() => setShowDeptModal(false)}
                                className={`px-6 py-3 border rounded-xl font-bold transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addNewDepartment}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Create Department
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <motion.aside
                    initial={{ width: 320 }}
                    animate={{ width: isSidebarOpen ? 320 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`${isDarkMode ? 'bg-slate-900/95 border-r border-slate-800' : 'bg-white/80 border-r border-slate-200/60'} backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 flex flex-col h-screen overflow-hidden relative`}
                >
                    {/* Close Button Inside Sidebar */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className={`absolute top-4 right-4 p-2 rounded-lg transition-all z-50 ${isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-red-400' : 'bg-slate-100/50 text-slate-500 hover:bg-slate-200 hover:text-red-500'}`}
                        title="Close Sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar min-w-[320px]">
                        <div className="p-6 pb-2">
                            <h1 className={`text-3xl font-black tracking-tighter flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                <img
                                    src={logo}
                                    alt="RotaBase Logo"
                                    className="w-10 h-10 rounded-xl shadow-md object-cover"
                                />



                                <span className="sparkle-text">RotaBase</span><span className="text-teal-600">.</span>
                            </h1>

                            {/* Department Switcher */}
                            <div className="mb-6 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                                <div className="relative group fancy-card-border rounded-xl">
                                    <select
                                        value={activeDeptId}
                                        onChange={(e) => switchDepartment(e.target.value)}
                                        className={`w-full pl-4 pr-10 py-3 border rounded-xl font-bold focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                                    >
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" size={18} />
                                </div>
                                <button
                                    onClick={() => setShowDeptModal(true)}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
                                >
                                    <Plus size={14} /> Add New Department
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Footer Controls */}
                        <div className={`p-6 border-t space-y-3 flex-1 overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200/60 bg-slate-50/50'}`}>
                            {/* <Mascot isDarkMode={isDarkMode} /> */}
                            <button
                                onClick={assignRotaAutomatically}
                                className="w-full px-4 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] transition-all font-semibold flex items-center justify-center gap-2 active:scale-95 shimmer-btn"
                            >
                                <Calendar size={18} />
                                Generate {activeDept.name} ROTA
                            </button>

                            <button
                                onClick={() => setShowStatsModal(true)}
                                className={`w-full px-4 py-3 border rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-sm shimmer-btn ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                            >
                                <BarChart3 size={18} className="text-teal-500" />
                                View Stats & Fairness
                            </button>

                            <div className={`relative flex items-center group transition-all duration-300 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 focus-within:border-orange-500/50 focus-within:bg-slate-800' : 'bg-white border-slate-200/60 focus-within:border-orange-400 focus-within:shadow-md'}`}>
                                <div className={`pl-3 pr-2 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-orange-400' : 'text-slate-400 group-focus-within:text-orange-500'}`}>
                                    <Mail size={14} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Transport DL Email"
                                    value={outlookDL}
                                    onChange={(e) => setOutlookDL(e.target.value)}
                                    className={`w-full bg-transparent border-none py-2.5 pr-10 text-[11px] font-bold focus:ring-0 outline-none transition-all ${isDarkMode ? 'text-slate-200 placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-300'}`}
                                />
                                <button
                                    onClick={shareWithTransport}
                                    title="Open Outlook Draft"
                                    className={`absolute right-1.5 p-1.5 rounded-lg transition-all active:scale-90 ${isDarkMode ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                                >
                                    <Send size={14} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setShowLeaveModal(true)}
                                    className={`px-3 py-2 border rounded-xl transition-all font-bold text-[11px] flex items-center justify-center gap-2 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                >
                                    <UserX size={14} className="text-red-500" />
                                    Leave
                                </button>
                                <button
                                    onClick={() => setShowAllowanceModal(true)}
                                    className={`px-3 py-2 border rounded-xl transition-all font-bold text-[11px] flex items-center justify-center gap-2 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                >
                                    <Calculator size={14} className="text-blue-500" />
                                    Allowance
                                </button>
                            </div>

                            <button
                                onClick={exportToExcel}
                                className={`w-full px-3 py-2 border rounded-xl transition-all font-bold text-[11px] flex items-center justify-center gap-2 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                            >
                                <FileSpreadsheet size={14} className="text-green-600" />
                                Excel
                            </button>



                            <button
                                onClick={exportToPDF}
                                className={`w-full px-3 py-2 border rounded-xl transition-all font-bold text-[11px] flex items-center justify-center gap-2 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                            >
                                <Download size={14} className="text-slate-500" />
                                PDF
                            </button>

                            <div className="flex gap-3 pt-2">
                                {/* Sync Status Indicator */}
                                <div className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isSyncing ? 'text-teal-500 bg-teal-500/10' : 'text-slate-400 bg-slate-100/50'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                    {isSyncing ? 'Syncing...' : 'Saved to Cloud'}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-1">
                                <button
                                    onClick={undo}
                                    disabled={historyIndex <= 0}
                                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                >
                                    <Redo2 size={16} />
                                </button>
                                <button
                                    onClick={redo}
                                    disabled={historyIndex >= history.length - 1}
                                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                >
                                    <Undo2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className={`flex-1 relative overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    {/* Header Controls */}
                    <div className={`backdrop-blur-md border-b px-6 py-2.5 z-20 flex justify-between items-center shadow-sm ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200/60'}`}>
                        <div className="flex items-center gap-4">
                            {/* Hamburger Button (Visible when sidebar closed) */}
                            {!isSidebarOpen && (
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className={`p-2 border rounded-lg shadow-sm transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-teal-400 hover:border-teal-500' : 'bg-white border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300'}`}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            )}

                            {isSyncing && (
                                <div className="flex items-center gap-2 px-2.5 py-1 bg-teal-50 text-[10px] font-bold text-teal-600 rounded-lg animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                    Syncing...
                                </div>
                            )}

                            <div className={`flex items-center gap-2 p-1 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-100/80 border-slate-200/50 hover:bg-slate-100'}`}>
                                <div className={`px-3 py-1 rounded-lg shadow-sm border flex items-center gap-2 text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-slate-700'}`}>
                                    <Clock size={14} className="text-teal-500" />
                                    Mode
                                </div>
                                <select
                                    value={shiftMode}
                                    onChange={(e) => setShiftMode(e.target.value)}
                                    className={`
    text-xs font-bold cursor-pointer pr-8 py-1
    bg-transparent border-none focus:ring-0
    ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
  `}
                                >
                                    <option value="3">3 Shifts (A+B+C)</option>
                                    <option value="2">2 Shifts (A+B)</option>
                                    <option value="Pattern">Cyclic Pattern (Custom)</option>
                                </select>

                            </div>

                            {shiftMode === 'Pattern' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-center gap-2 p-1 rounded-xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700/50' : 'bg-teal-50/50 border-teal-200/50'}`}
                                >
                                    <div className="px-2 py-0.5 text-[9px] font-black uppercase text-teal-600 tracking-tighter flex items-center gap-1">
                                        <ArrowLeftRight size={10} /> Pattern (Days)
                                    </div>
                                    <div className="flex gap-1.5 px-1">
                                        {['A', 'B', 'C', 'Off'].map(type => (
                                            <div key={type} className="flex flex-col items-center">
                                                <span className={`text-[8px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{type}</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={patternConfig[type]}
                                                    onChange={(e) => setPatternConfig({ ...patternConfig, [type]: parseInt(e.target.value) || 0 })}
                                                    className={`w-8 h-6 p-0 text-center text-xs font-black border rounded-md focus:ring-0 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="group relative">
                                        <AlertCircle size={14} className="text-slate-400 cursor-help" />
                                        <div className={`absolute left-0 top-full mt-2 w-48 p-2 rounded-lg shadow-xl text-[10px] font-medium z-50 invisible group-hover:visible ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'} border border-slate-200`}>
                                            Example: 4A-4B-0C-2Off will rotate 4 days morning, 4 days evening, then 2 days break. Staggered for each employee.
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className={`flex items-center gap-2 p-1 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-100/80 border-slate-200/50 hover:bg-slate-100'}`}>
                                <div className={`px-3 py-1 rounded-lg shadow-sm border flex items-center gap-2 text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-slate-700'}`}>
                                    <FileSpreadsheet size={14} className="text-purple-500" />
                                    Rotation
                                </div>
                                <select
                                    value={rotationWeeks}
                                    onChange={(e) => setRotationWeeks(parseInt(e.target.value))}
                                    className={`bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer pr-8 py-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                                >
                                    {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w} {w === 1 ? 'Week' : 'Weeks'}</option>)}
                                </select>
                            </div>

                            <div className={`flex items-center gap-2 p-1 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-100/80 border-slate-200/50 hover:bg-slate-100'}`}>
                                <div className={`px-3 py-1 rounded-lg shadow-sm border flex items-center gap-2 text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-slate-700'}`}>
                                    <Calendar size={14} className="text-pink-500" />
                                    Current Date
                                </div>
                                <input
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="
    bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer py-1
    text-slate-700 dark:text-slate-200
  "
                                    style={{
                                        color: '#334155',
                                        fontWeight: 600,
                                        filter: isDarkMode ? 'invert(1)' : 'none'
                                    }}
                                />

                            </div>


                            <button
                                onClick={fetchPublicHolidays}
                                disabled={isFetchingHolidays}
                                className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-teal-400' : 'bg-white border-slate-200 text-teal-600'} ${isFetchingHolidays ? 'animate-spin' : ''}`}
                                title="Auto-Import Indian Holidays"
                            >
                                <Globe size={18} />
                            </button>

                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 shadow-sm'}`}
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>

                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
                            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 lg:p-6 custom-scrollbar scroll-smooth">
                        {/* Week Navigation bar */}
                        <div className={`sticky top-0 z-30 mb-6 flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md shadow-lg ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200/60'}`}>
                            <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-700/20 mr-1">Quick Nav</div>
                            {Array.from({ length: rotationWeeks }, (_, i) => (
                                <a
                                    key={i}
                                    href={`#week-${i + 1}`}
                                    className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:scale-105 active:scale-95 ${isDarkMode ? 'text-slate-400 hover:text-teal-400 hover:bg-slate-800' : 'text-slate-500 hover:text-teal-600 hover:bg-teal-50'}`}
                                >
                                    W{i + 1}
                                </a>
                            ))}
                        </div>
                        <div className={`mb-4 p-3 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/50 border-slate-200/60'}`}>
                            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-teal-100'}`}><Users size={12} className="text-teal-600" /></div>
                                Team Members <span className="text-slate-300 font-normal">({employees.length})</span>
                            </h3>

                            <div className="relative group/slider px-1">
                                <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 pretty-scrollbar scroll-smooth">
                                    {employees.map(emp => (
                                        <div
                                            key={emp.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, emp)}
                                            onDragEnd={handleDragEnd}
                                            className={`group pl-1.5 pr-3 py-1.5 rounded-xl border shadow-sm cursor-move hover:shadow-md transition-all flex items-center gap-2.5 shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-teal-500' : 'bg-white border-slate-200 hover:border-teal-300'}`}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shadow-inner"
                                                style={{ backgroundColor: emp.color }}
                                            >
                                                {emp.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-bold text-xs leading-none mb-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{emp.name}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Shift {emp.shift}</div>
                                            </div>
                                            <button
                                                onClick={() => removeEmployee(emp.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    <div className={`h-10 w-[1px] mx-1 shrink-0 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`}></div>

                                    {/* Inline Add Member */}
                                    <div className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl border min-w-[280px] shrink-0 h-10 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                        <input
                                            type="text"
                                            placeholder="New Member Name..."
                                            value={newEmployee.name}
                                            onChange={(e) =>
                                                setNewEmployee({ ...newEmployee, name: e.target.value })
                                            }
                                            className={`w-full bg-transparent border-none py-2.5 pr-10 text-[11px] font-bold focus:ring-0 outline-none transition-all 
    ${isDarkMode
                                                    ? 'text-slate-200 placeholder:text-slate-400'
                                                    : 'text-slate-700 placeholder:text-slate-500'
                                                }`}
                                        />

                                        <div className={`h-5 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                        <select
                                            value={newEmployee.shift}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
                                            className={`bg-transparent border-none text-[10px] font-black focus:ring-0 py-0 pr-6 cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-500'}`}
                                        >
                                            {['A', 'B', 'C'].slice(0, shiftMode === '3' ? 3 : 2).map(s => (
                                                <option key={s} value={s}>Shift {s}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={addEmployee}
                                            className="
                                                    w-8 h-8 shrink-0
                                                    bg-teal-600 text-white rounded-lg
                                                    hover:bg-teal-700 transition-all shadow-sm
                                                    flex items-center justify-center
                                                    active:scale-95
                                                "
                                        >
                                            <Plus size={16} />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`mb-4 rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/50 border-slate-200/60'}`}>
                            <div
                                className={`
                                    px-4 py-2 flex items-center justify-between cursor-pointer
                                    transition-colors
                                    ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}
                                `}
                                onClick={() => setShowRules(!showRules)}
                            >
                                <h3 className="font-bold text-[11px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <div
                                        className={`w-6 h-6 rounded flex items-center justify-center
                                            ${isDarkMode ? 'bg-slate-700' : 'bg-teal-100'}
                                        `}
                                    >
                                        <Users size={12} className="text-teal-600" />
                                    </div>

                                    Shift Rules
                                </h3>

                                {showRules
                                    ? <ChevronUp className="text-slate-500" />
                                    : <ChevronDown className="text-slate-500" />
                                }
                            </div>


                            {showRules && (
                                <div className="px-6 pb-6 pt-2">
                                    {activeDept.type === 'MES' ? (
                                        shiftMode === '3' ? (
                                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <div className="space-y-2">
                                                    <p>
                                                        <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                            Mon-Thu:
                                                        </strong>
                                                        {' '}
                                                        2 persons per shift (A, B, C)
                                                    </p>

                                                    <p>
                                                        <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                            Friday:
                                                        </strong>
                                                        {' '}
                                                        1 person from each shift works (3 total), 3 OFF
                                                    </p>

                                                    <p>
                                                        <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                            Saturday:
                                                        </strong>
                                                        {' '}
                                                        Friday OFF people work, Friday workers OFF
                                                    </p>

                                                </div>
                                                <div className="space-y-2">
                                                    <p>
                                                        <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                            Sunday:
                                                        </strong>
                                                        {' '}
                                                        12-hour shifts (1 from A: 7am–7pm, 1 from B/C: 7pm–7am)
                                                    </p>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className={`text-sm space-y-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                <p>
                                                    <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                        Mon-Thu:
                                                    </strong>
                                                    {' '}
                                                    3 persons per shift (A & B)
                                                </p>

                                                <p>
                                                    <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                        Friday:
                                                    </strong>
                                                    {' '}
                                                    2 from each shift work (4 total), 2 OFF
                                                </p>

                                                <p>
                                                    <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                        Saturday:
                                                    </strong>
                                                    {' '}
                                                    Different 2 people (Fri workers + 2 Fri OFF get OFF)
                                                </p>

                                                <p>
                                                    <strong className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>
                                                        Sunday:
                                                    </strong>
                                                    {' '}
                                                    Fri+Sat OFF people work in their shifts
                                                </p>
                                            </div>

                                        )
                                    ) : (
                                        <div className="text-sm text-slate-600 space-y-2 font-medium">
                                            <p><strong className="text-slate-800">General Distribution:</strong> Employees are assigned in a balanced round-robin manner.</p>
                                            <p>Supports any number of employees and ensures equal shift distribution over time.</p>
                                            <p>No special weekend or holiday constraints are applied by default.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Schedule Table */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                            {
                                Array.from({ length: rotationWeeks }, (_, weekIndex) => {
                                    const week = weekIndex + 1;
                                    const weekStartDate = getDateForCell(weekIndex, 0);
                                    const weekEndDate = getDateForCell(weekIndex, 6);

                                    return (
                                        <div key={week} id={`week-${week}`} className={`border-b last:border-b-0 scroll-mt-24 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                            <div className="bg-[#1e293b] text-white px-4 py-2 flex items-center justify-between">
                                                <h3 className="text-sm font-black tracking-tight">Week {week} <span className="text-[10px] font-bold opacity-60 ml-2">({formatDate(weekStartDate)} - {formatDate(weekEndDate)})</span></h3>
                                                <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                                                    {employees.length} employees • {shiftMode} shifts
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className={`text-[11px] uppercase tracking-widest text-white ${isDarkMode ? 'bg-slate-950' : 'bg-slate-800'}`}>
                                                            <th className={`px-4 py-3 text-left font-black border-r w-24 ${isDarkMode ? 'border-slate-800' : 'border-slate-700'}`}>Date</th>
                                                            <th className={`px-4 py-3 text-center font-black border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-700'}`}>
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                                    Shift A
                                                                </div>
                                                            </th>
                                                            <th className={`px-4 py-3 text-center font-black border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-700'}`}>
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                                                                    Shift B
                                                                </div>
                                                            </th>
                                                            {shiftMode === '3' && (
                                                                <th className="px-4 py-3 text-center font-black">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                                                                        Shift C
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {DAYS.map((day, dayIndex) => {
                                                            const date = getDateForCell(weekIndex, dayIndex);
                                                            const isToday = formatDate(date) === formatDate(new Date());

                                                            return (
                                                                <tr key={day} className={`border-t group transition-all duration-200 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'} ${isToday ? 'bg-teal-50/10' : ''}`}>
                                                                    <td className={`px-3 py-2 border-r ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                                                                        <div className="flex flex-col items-center">
                                                                            <div className={`text-sm font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{date.getDate()}</div>
                                                                            <div className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>{date.toLocaleDateString('en-GB', { month: 'short' })}</div>
                                                                            <div className="text-[9px] font-bold text-slate-400 mt-0.5">{day}</div>
                                                                            <button
                                                                                onClick={() => toggleHoliday(week, day)}
                                                                                className="mt-2 text-slate-300 hover:text-green-500 transition-colors p-1"
                                                                                title="Mark as holiday"
                                                                            >
                                                                                <Palmtree size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    {['A', 'B', 'C'].slice(0, shiftMode === '3' ? 3 : 2).map(shift => {
                                                                        const key = `${week}-${day}-${shift}`;
                                                                        const cell = schedule[key] || { employees: [], status: 'normal', note: '' };
                                                                        const error = scheduleErrors[key];

                                                                        return (
                                                                            <td
                                                                                key={shift}
                                                                                onDrop={(e) => {
                                                                                    setDragOverKey(null);
                                                                                    handleDrop(e, week, day, shift);
                                                                                }}
                                                                                onDragOver={(e) => handleDragOver(e, key)}
                                                                                onDragLeave={handleDragLeave}
                                                                                className={`px-3 py-2 border-r last:border-r-0 transition-all cursor-pointer relative group-hover:bg-opacity-50 drag-target-cell ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} 
                                                                            ${dragOverKey === key ? 'drag-over-active' : ''}
                                                                            ${error?.type === 'error' ? 'bg-red-50 ring-1 ring-red-500 ring-inset' :
                                                                                        error?.type === 'warning' ? 'bg-amber-50/30 conflict-pulse' :
                                                                                            cell.status === 'holiday' ? 'bg-green-50/20' :
                                                                                                cell.status === 'leave' ? 'bg-orange-50/20' :
                                                                                                    isDarkMode ? 'bg-slate-900/50' : 'bg-white'
                                                                                    }`}
                                                                            >
                                                                                {cell.status === 'holiday' ? (
                                                                                    <div className="flex flex-col items-center justify-center h-full opacity-60">
                                                                                        <Palmtree size={16} className="text-green-500 mb-1" />
                                                                                        <div className="text-[8px] font-bold uppercase tracking-tighter text-green-600">Holiday</div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="min-h-[44px] flex flex-col justify-center">
                                                                                        <div className="flex flex-wrap gap-1 mb-1">
                                                                                            <AnimatePresence mode='popLayout'>
                                                                                                {cell.employees.filter(Boolean).map(emp => {
                                                                                                    const liveEmp = employees.find(e => e.id === emp.id) || emp;
                                                                                                    return (
                                                                                                        <motion.div
                                                                                                            layout
                                                                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                                                            exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                                                                                                            key={liveEmp.id}
                                                                                                            className={`group/tag px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm ring-1 ring-black/5 flex items-center gap-1 pr-1 cursor-default ${selectedSwap?.employee?.id === liveEmp.id ? 'ring-2 ring-white ring-offset-1 animate-pulse' : ''}`}
                                                                                                            style={{ backgroundColor: liveEmp.color }}
                                                                                                            onClick={(e) => e.stopPropagation()} // Prevent cell click/drag issues
                                                                                                        >
                                                                                                            {liveEmp.name}
                                                                                                            <div className="hidden group-hover/tag:flex items-center gap-0.5 ml-1">
                                                                                                                <button
                                                                                                                    onClick={(e) => {
                                                                                                                        e.stopPropagation();
                                                                                                                        handleSwapMode(week, day, shift, liveEmp);
                                                                                                                    }}
                                                                                                                    className={`rounded-full p-0.5 transition-all flex items-center justify-center w-3.5 h-3.5 ${selectedSwap?.employee?.id === liveEmp.id ? 'bg-white text-black' : 'bg-black/20 hover:bg-black/40'}`}
                                                                                                                    title="Swap Shift"
                                                                                                                >
                                                                                                                    <ArrowLeftRight size={8} strokeWidth={4} />
                                                                                                                </button>
                                                                                                                <button
                                                                                                                    onClick={(e) => {
                                                                                                                        e.stopPropagation();
                                                                                                                        removeEmployeeFromCell(week, day, shift, liveEmp.id);
                                                                                                                    }}
                                                                                                                    className="bg-black/20 hover:bg-black/40 rounded-full p-0.5 transition-all flex items-center justify-center w-3.5 h-3.5"
                                                                                                                >
                                                                                                                    <X size={8} strokeWidth={4} />
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        </motion.div>
                                                                                                    );
                                                                                                })}
                                                                                            </AnimatePresence>
                                                                                            {cell.employees.length === 0 && cell.status !== 'leave' && (
                                                                                                <div className={`text-[10px] font-bold italic ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>Drop here</div>
                                                                                            )}
                                                                                        </div>

                                                                                        {cell.status === 'leave' && (
                                                                                            <div className="mt-1 p-1 bg-orange-100 rounded border border-orange-200">
                                                                                                <div className="text-orange-700 font-bold text-[8px] uppercase">Leave: {cell.note}</div>
                                                                                            </div>
                                                                                        )}

                                                                                        {(cell.employees.length < (shiftMode === '3' ? 2 : 3) || cell.status === 'leave') && cell.status !== 'holiday' && (
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    getBestReplacements(week, day, shift);
                                                                                                }}
                                                                                                className="mt-1 flex items-center gap-1 text-[8px] font-black text-teal-600 uppercase hover:text-teal-700 transition-colors"
                                                                                            >
                                                                                                <Sparkles size={10} /> Suggest
                                                                                            </button>
                                                                                        )}

                                                                                        {/* Suggestion Popover */}
                                                                                        {cellSuggestions?.key === key && (
                                                                                            <motion.div
                                                                                                initial={{ opacity: 0, y: 5 }}
                                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                                className={`absolute top-full left-0 z-50 w-full min-w-[120px] shadow-2xl border-2 border-teal-500 rounded-xl p-2 mt-1 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
                                                                                            >
                                                                                                <div className="flex items-center justify-between mb-2">
                                                                                                    <span className="text-[9px] font-black uppercase text-teal-500 flex items-center gap-1"><Sparkles size={10} /> Best Matches</span>
                                                                                                    <button onClick={(e) => { e.stopPropagation(); setCellSuggestions(null); }} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>
                                                                                                </div>
                                                                                                <div className="space-y-1.5 pointer-events-auto">
                                                                                                    {cellSuggestions.list.length > 0 ? cellSuggestions.list.map(sEmp => (
                                                                                                        <button
                                                                                                            key={sEmp.id}
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation();
                                                                                                                handleDrop(null, week, day, shift, sEmp);
                                                                                                                setCellSuggestions(null);
                                                                                                            }}
                                                                                                            className={`w-full text-left p-1.5 text-[10px] font-bold rounded-lg flex items-center justify-between transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-teal-50 text-slate-700'}`}
                                                                                                        >
                                                                                                            <div className="flex items-center gap-2">
                                                                                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sEmp.color }}></div>
                                                                                                                {sEmp.name}
                                                                                                            </div>
                                                                                                            <div className="text-[8px] opacity-60 font-black">LOAD: {sEmp.workload}</div>
                                                                                                        </button>
                                                                                                    )) : (
                                                                                                        <div className="text-[9px] font-bold text-slate-400 p-2 text-center">No safe replacements found.</div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </motion.div>
                                                                                        )}

                                                                                        {(cell.note || SHIFTS[shift]?.label) && cell.status !== 'leave' && !error && (
                                                                                            <div className="text-[9px] font-bold text-slate-400 leading-tight">
                                                                                                {cell.note || SHIFTS[shift]?.label.split(' ')[1]}
                                                                                            </div>
                                                                                        )}

                                                                                        {error && (
                                                                                            <div className={`mt-1 flex items-center gap-1 font-black text-[9px] uppercase tracking-tighter ${error.type === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                                                                                                <AlertCircle size={10} /> {error.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div >

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                            <div className={`text-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200/60 text-slate-600'}`}>
                                <strong className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-blue-50'}`}><AlertCircle size={16} className="text-blue-600" /></div>
                                    How to Use:
                                </strong>
                                <ul className="space-y-2 ml-2 list-none">
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400">Drag employees from sidebar to assign shifts</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400">Click "Auto Generate" for intelligent scheduling</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400">Click 🏖️ to mark holidays</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400">Use "Mark Leave" to handle employee absences</li>
                                </ul>
                            </div>

                            <div className={`text-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200/60 text-slate-600'}`}>
                                <strong className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-purple-50'}`}><CheckCircle2 size={16} className="text-purple-600" /></div>
                                    features:
                                </strong>
                                <ul className="space-y-2 ml-2 list-none">
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400">Automatic rotation based on shift rules</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400">Excel export for easy sharing</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400">PDF generation for transport department</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400">Undo/Redo for mistake correction</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div >

            <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @media print {
          aside {
            display: none;
          }
          main {
            padding: 0;
          }
          button {
            display: none;
          }
        }
      `}</style>
        </div >
    );
}
