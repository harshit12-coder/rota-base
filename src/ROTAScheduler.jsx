import React, { useState, useEffect, useRef } from 'react'; // Version 1.1 
import { Calendar, Users, Download, FileSpreadsheet, Undo2, Redo2, Plus, Trash2, Clock, AlertCircle, CheckCircle2, UserX, Palmtree, Send, BarChart3, Smartphone, ChevronDown, ChevronUp, Briefcase, Settings2, ShieldCheck, X, ChevronLeft, ChevronRight, Sun, Moon, Sparkles, ArrowLeftRight, FileSearch, Globe, Calculator, Wallet, Mail, Grab, Wand2, MessageCircle, ScanEye, Maximize2, Minimize2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { databases, account, DATABASE_ID, COLLECTIONS } from './lib/appwrite';
import { ID, Query } from 'appwrite';
import { motion, AnimatePresence, useMotionValue, useSpring as useFramerSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import logo from "./assets/logo.png";
import {
    animateScheduleGridIn,
    animateSidebarIn,
    animateHeaderControls,
    createEmployeeTagHover,
    createButtonPress,
    animateDragStart,
    animateDragEnd,
    animateCellDrop,
    animateModalIn,
    animateModalOut,
    animateNotificationIn,
    animateNotificationOut,
    animateScheduleGeneration,
    createMagneticHover,
    animateCounter,
    cleanupGSAP
} from './utils/gsapAnimations';
import './gsapAnimations.css';
import { useAuth } from './contexts/AuthContext';
import { usePermissions } from './utils/permissions';
import { LogOut, Lock, HelpCircle } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';

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








// --- Magic Cursor Component (High-Performance Sparkles) ---
const MagicCursor = ({ isActive }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const cursor = useRef({ x: 0, y: 0 });
    const cursorHistory = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!isActive) return; // Stop if disabled

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const onMouseMove = (e) => {
            cursor.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMouseMove);

        let animationFrameId;
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen

            // Initial cursor sync
            if (cursorHistory.current.x === 0 && cursorHistory.current.y === 0) {
                cursorHistory.current.x = cursor.current.x;
                cursorHistory.current.y = cursor.current.y;
            }

            // Interpolate for smoothness
            const dx = cursor.current.x - cursorHistory.current.x;
            const dy = cursor.current.y - cursorHistory.current.y;
            cursorHistory.current.x += dx * 0.25;
            cursorHistory.current.y += dy * 0.25;

            // Emit particles based on movement - REDUCED QUANTITY & DARK MODE ONLY logic handled by parent prop
            if ((Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) && Math.random() > 0.7) { // 70% throttle (less particles)
                const count = 1; // Always 1 particle at a time, no bursts
                for (let i = 0; i < count; i++) {
                     // Colors: Gold, Emerald, Violet, Blue, Rose
                    const colors = ['#F59E0B', '#10B981', '#8B5CF6', '#3B82F6', '#F43F5E'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const isSparkle = Math.random() > 0.85; // 15% chance of star (cleaner)

                    particles.current.push({
                        x: cursor.current.x + (Math.random() - 0.5) * 15,
                        y: cursor.current.y + (Math.random() - 0.5) * 15,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5 + 0.3, // Gravity down
                        life: 1.0,
                        decay: Math.random() * 0.02 + 0.02, // Faster decay
                        color: color,
                        size: isSparkle ? Math.random() * 4 + 2 : Math.random() * 2 + 1, // Smaller size
                        type: isSparkle ? 'star' : 'circle',
                        rotation: Math.random() * Math.PI * 2,
                        rotateSpeed: (Math.random() - 0.5) * 0.1
                    });
                }
            }

            // Draw Loop
            particles.current.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotateSpeed;
                p.life -= p.decay;
                p.size *= 0.96;

                if (p.life <= 0 || p.size < 0.2) {
                    particles.current.splice(index, 1);
                } else {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    
                    // Add glow - slightly reduced
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color;

                    if (p.type === 'star') {
                        // Draw 4-point star
                        ctx.beginPath();
                        const spikes = 4;
                        const outerRadius = p.size;
                        const innerRadius = p.size * 0.4;
                        for (let i = 0; i < spikes * 2; i++) {
                            const r = (i % 2 === 0) ? outerRadius : innerRadius;
                            const angle = (Math.PI / spikes) * i;
                            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                        }
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        // Draw Circle
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.restore();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive]);

    if (!isActive) return null;

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[99999]" />;
};

export default function ROTAScheduler() {
    const { user, role, logout } = useAuth();
    const perms = usePermissions(role);

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

    const [generationMeta, setGenerationMeta] = useState(() => {
        const saved = localStorage.getItem(getSKey('generationMeta'));
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) { return []; }
        }
        return [];
    });

    const [startDate, setStartDate] = useState(() => {
        const saved = localStorage.getItem(getSKey('startDate'));
        if (saved) return saved;

        // Smart Default: Always start on a Monday of the CURRENT week
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        d.setDate(diff);
        return d.toISOString().split('T')[0];
    });

    // Helper to get date object
    const getDateForCell = (weekIndex, dayIndex) => {
        let start = new Date(startDate);
        // Snap to NEAREST Monday
        const day = start.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        // Snap to NEAREST Monday (Start of the current week Standard Logic)
        // Mon(1) -> 0. Tue(2) -> -1 ... Sun(0) -> -6
        const diff = (day + 6) % 7; 
        start.setDate(start.getDate() - diff);

        const dayOffset = weekIndex * 7 + dayIndex;
        const date = new Date(start);
        date.setDate(start.getDate() + dayOffset);
        return date;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

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

    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const [isSyncing, setIsSyncing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('rota_theme') === 'dark');
    // Sync dark class to HTML element for global styles
    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('rota_theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const [isMagicEnabled, setIsMagicEnabled] = useState(() => localStorage.getItem('rota_magic_cursor') !== 'false');
    useEffect(() => {
        localStorage.setItem('rota_magic_cursor', isMagicEnabled);
        if (isMagicEnabled) showNotification('✨ Magic Effects Enabled', 'success');
        else showNotification('Magic Effects Disabled', 'default');
    }, [isMagicEnabled]);

    const [isAutoTheme, setIsAutoTheme] = useState(() => localStorage.getItem('rota_auto_theme') === 'true');
    const [dragOverKey, setDragOverKey] = useState(null);
    const [selectedSwap, setSelectedSwap] = useState(null); // { week, day, shift, empId }
    const [highlightedEmpId, setHighlightedEmpId] = useState(null); // Focus Mode State
    const [cellSuggestions, setCellSuggestions] = useState(null); // { key, list: [] }
    const [isFetchingHolidays, setIsFetchingHolidays] = useState(false);
    const [patternConfig, setPatternConfig] = useState(() => {
        const saved = localStorage.getItem(getSKey('patternConfig'));
        return saved ? JSON.parse(saved) : { A: 4, B: 4, C: 0, Off: 2 };
    });
    const [showAllowanceModal, setShowAllowanceModal] = useState(false);
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
    const [allowanceRange, setAllowanceRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    });

    // View Navigation State (Paginated Weeks)
    const [viewOffset, setViewOffset] = useState(() => {
        const start = new Date(startDate);
        // Snap start to its calculated Monday logic same as getDateForCell
        const day = start.getDay();
        let diff = 0;
        if (day === 1) diff = 0;
        else if (day === 0) diff = 1;
        else if (day >= 5) diff = 8 - day;
        else diff = 1 - day;
        start.setDate(start.getDate() + diff);

        const now = new Date();
        // Calculate full weeks difference
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const diffWeeks = Math.floor((now - start) / oneWeek);
        
        // Return max(0, diffWeeks) ?? No, allow negative for past checking if user wants?
        // But keys are usually positive 1-based index if generated relative to start.
        // If user creates fresh, week 1 is start.
        // We default to "Current Week" relative to Start Date.
        return diffWeeks < 0 ? 0 : diffWeeks;
    });

    const jumpToWeek = (offset) => setViewOffset(offset);
    const jumpToToday = () => {
         const start = new Date(startDate);
         const day = start.getDay();
         let diff = (day === 1 ? 0 : (day === 0 ? 1 : (day >= 5 ? 8 - day : 1 - day)));
         start.setDate(start.getDate() + diff);
         const now = new Date();
         const weekDiff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
         setViewOffset(weekDiff < 0 ? 0 : weekDiff);
    };
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        onConfirm: () => { }
    });

    // --- Live Clock & Shift Logic ---
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    const getShiftStatus = (date) => {
        const h = date.getHours();
        if (h >= 6 && h < 14) return { label: 'Shift A (Morning)', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
        if (h >= 14 && h < 22) return { label: 'Shift B (Evening)', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
        return { label: 'Shift C (Night)', color: 'text-violet-500', bg: 'bg-violet-500/10 border-violet-500/20' };
    };
    const currentShiftStatus = getShiftStatus(now);


    const [isZenMode, setIsZenMode] = useState(false);

    const toggleZenMode = React.useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.log(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
            });
            setIsZenMode(true);
            setIsSidebarOpen(false); // Close sidebar for focus
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsZenMode(false);
            setIsSidebarOpen(true); // Restore sidebar
        }
    }, []);

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                setIsDarkMode(prev => !prev);
            }
            if (e.altKey && e.code === 'KeyZ') { // Alt + Z for Zen Mode
                e.preventDefault();
                toggleZenMode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [historyIndex, history, toggleZenMode]); // Dependencies for undo/redo access





    const [showShortcutsMenu, setShowShortcutsMenu] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('rota_sound') !== 'false');
    // Zen Mode State moved up for shortcuts access
    const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('rota_onboarding_done'));
    const [onboardingStep, setOnboardingStep] = useState(0);

    const [scrolled, setScrolled] = useState(false);
    const [isFloatingTeamOpen, setIsFloatingTeamOpen] = useState(false);

    // --- High Performance Mouse Tracking (No Re-renders) ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Very responsive spring for the drag preview - high stiffness, high damping
    const springX = useFramerSpring(mouseX, { damping: 30, stiffness: 500, mass: 0.1 });
    const springY = useFramerSpring(mouseY, { damping: 30, stiffness: 500, mass: 0.1 });

    useEffect(() => {
        const handleMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        const handleDrag = (e) => {
            if (e.clientX === 0 && e.clientY === 0) return; // Ignore end of drag resets
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        const handleDragEndGlobal = () => {
            setDraggedEmployee(null);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('drag', handleDrag);
        window.addEventListener('dragover', handleDrag); // Crucial for native drag sync
        window.addEventListener('dragend', handleDragEndGlobal);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('drag', handleDrag);
            window.removeEventListener('dragover', handleDrag);
            window.removeEventListener('dragend', handleDragEndGlobal);
        };
    }, [mouseX, mouseY]);

    // Micro-Audio Helper
    const playMicroInteraction = (type = 'pop') => {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            let duration = 0.2;

            if (type === 'pop') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
                duration = 0.1;
                if (navigator.vibrate) navigator.vibrate(10);
            } else if (type === 'lift') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(220, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.05, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
                duration = 0.1;
                if (navigator.vibrate) navigator.vibrate(5);
            } else if (type === 'trash') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(10, context.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
                duration = 0.2;
                if (navigator.vibrate) navigator.vibrate([20, 10, 20]);
            } else if (type === 'success') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(1046.5, context.currentTime + 0.2); // C6
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
                duration = 0.2;
                if (navigator.vibrate) navigator.vibrate(30);
            } else if (type === 'magic') {
                oscillator.type = 'sine';
                // Triple chime effect
                oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(783.99, context.currentTime + 0.15); // G5
                oscillator.frequency.exponentialRampToValueAtTime(1046.5, context.currentTime + 0.35); // C6
                gainNode.gain.setValueAtTime(0.15, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
                duration = 0.4;
                if (navigator.vibrate) navigator.vibrate([40, 80, 40]);
            }

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration);
        } catch (e) { console.warn("Audio Context failed", e); }
    };

    useEffect(() => {
        localStorage.setItem('rota_theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Persist auto-theme preference
    useEffect(() => {
        localStorage.setItem('rota_auto_theme', isAutoTheme.toString());
    }, [isAutoTheme]);

    // Auto Dark Mode based on time 🌙
    useEffect(() => {
        if (!isAutoTheme) return; // Only run if auto-theme is enabled

        const checkTimeAndUpdateTheme = () => {
            const now = new Date();
            const hour = now.getHours();
            
            // Dark mode: 6 PM (18:00) to 6 AM (06:00)
            const shouldBeDark = hour >= 18 || hour < 6;
            
            if (shouldBeDark !== isDarkMode) {
                console.log(`🌓 Auto-switching to ${shouldBeDark ? 'dark' : 'light'} mode at ${hour}:00`);
                setIsDarkMode(shouldBeDark);
                
                // Show subtle notification
                showNotification(
                    `Auto-switched to ${shouldBeDark ? 'dark 🌙' : 'light ☀️'} mode`,
                    'success'
                );
            }
        };

        // Check immediately
        checkTimeAndUpdateTheme();

        // Check every minute
        const interval = setInterval(checkTimeAndUpdateTheme, 60000);

        return () => clearInterval(interval);
    }, [isAutoTheme, isDarkMode]);

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

            // 2. Fetch Active Dept's Employees (Increased limit to 5000)
            const emps = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EMPLOYEES, [
                Query.equal('deptId', activeDeptId),
                Query.limit(5000)
            ]);
            if (emps.documents.length > 0) {
                setEmployees(emps.documents.map(e => ({
                    id: e.empId,
                    name: e.name,
                    shift: e.shift,
                    color: e.color
                })));
            }

            // 3. Fetch Active Dept's Schedule (Increased limit to 5000 to support 4 weeks)
            const sched = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SCHEDULE, [
                Query.equal('deptId', activeDeptId),
                Query.limit(5000)
            ]);
            if (sched.documents.length > 0) {
                const newSched = {};
                sched.documents.forEach(s => {
                    if (s.key === 'CONFIG') {
                        try {
                            const conf = JSON.parse(s.employeesJson);
                            // Only update if value is present to allow graceful fallback
                            if (conf.startDate) setStartDate(conf.startDate);
                            if (conf.rotationWeeks) setRotationWeeks(conf.rotationWeeks);
                            if (conf.shiftMode) setShiftMode(conf.shiftMode);
                            if (conf.patternConfig) setPatternConfig(conf.patternConfig);
                        } catch (e) { console.error("Config parse error", e); }
                    } else {
                        newSched[s.key] = {
                            employees: JSON.parse(s.employeesJson),
                            status: s.status,
                            note: s.note
                        };
                    }
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

    const syncToCloud = async (scheduleOverride = null) => {
        if (!DATABASE_ID || !isInitialLoaded) return;

        // Prevent sync if nothing significant changed (shallow check optimization)
        // Note: For deep robustness, we do strict diffing below.

        await ensureSession();
        setIsSyncing(true);
        try {
            const promises = [];

            // 1. Differential Sync for Departments
            const deptsChanged = JSON.stringify(departments) !== JSON.stringify(lastSyncedDepartments.current);
            if (deptsChanged) {
                // Handling Deletions for Departments
                for (const syncedDept of lastSyncedDepartments.current) {
                    if (!departments.find(d => d.id === syncedDept.id)) {
                        promises.push(
                            databases.deleteDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, syncedDept.id)
                                .catch(e => console.error("Error deleting dept:", e))
                        );
                    }
                }

                for (const dept of departments) {
                    promises.push(
                        databases.updateDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, dept.id, {
                            name: dept.name,
                            type: dept.type,
                            color: dept.color
                        }).catch(async (e) => {
                            if (e.code === 404) {
                                await databases.createDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, dept.id, {
                                    name: dept.name,
                                    type: dept.type,
                                    color: dept.color
                                }).catch(err => console.error("Error creating dept:", err));
                            }
                        })
                    );
                }
                lastSyncedDepartments.current = JSON.parse(JSON.stringify(departments));
            }

            // 2. Differential Sync for Employees
            // 2a. Handle Deletions first
            for (const syncedEmp of lastSyncedEmployees.current) {
                if (!employees.find(e => e.id === syncedEmp.id)) {
                    const docId = `${activeDeptId}_${syncedEmp.id}`;
                    promises.push(
                        databases.deleteDocument(DATABASE_ID, COLLECTIONS.EMPLOYEES, docId)
                            .catch(e => { if (e.code !== 404) console.error("Error deleting employee:", e); })
                    );
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
                    promises.push(
                        databases.updateDocument(DATABASE_ID, COLLECTIONS.EMPLOYEES, docId, payload)
                            .catch(async (e) => {
                                if (e.code === 404) {
                                    await databases.createDocument(DATABASE_ID, COLLECTIONS.EMPLOYEES, docId, payload)
                                        .catch(err => console.error("Error creating employee:", err));
                                }
                            })
                    );
                }
            }
            // Update ref strictly
            lastSyncedEmployees.current = JSON.parse(JSON.stringify(employees));

            // 3. Differential Sync for Schedule (The Heavy Hitter)
            let updateCount = 0;
            const currentScheduleState = scheduleOverride || schedule;
            const keysToCheck = new Set([...Object.keys(currentScheduleState), ...Object.keys(lastSyncedSchedule.current)]);

            for (const key of keysToCheck) {
                const currentCell = currentScheduleState[key];
                const syncedCell = lastSyncedSchedule.current[key];
                const isDirty = !syncedCell || JSON.stringify(currentCell) !== JSON.stringify(syncedCell);

                if (isDirty) {
                    const docId = `${activeDeptId}_${key}`;
                    
                    if (currentCell) {
                        // Case: Update or Create
                        const payload = {
                            key,
                            employeesJson: JSON.stringify(currentCell.employees),
                            status: currentCell.status,
                            note: currentCell.note,
                            deptId: activeDeptId
                        };
                        
                        updateCount++;
                        promises.push(
                            databases.updateDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, docId, payload)
                                .catch(async (e) => {
                                    if (e.code === 404) {
                                        await databases.createDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, docId, payload)
                                            .catch(err => console.error("Error creating schedule:", err));
                                    } else {
                                         console.warn(`Failed to sync cell ${key}`, e);
                                    }
                                })
                        );
                    } else {
                        // Case: Delete (Key no longer exists in current schedule)
                        promises.push(
                            databases.deleteDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, docId)
                                .catch(e => { 
                                    // If 404, it's already gone, which is fine
                                    if (e.code !== 404) console.error("Error deleting old schedule cell:", e); 
                                })
                        );
                    }
                }
            }

            // 4. Sync Config Metadata (Start Date, Rotation, etc.)
            const configPayload = {
                key: 'CONFIG',
                deptId: activeDeptId,
                employeesJson: JSON.stringify({
                    startDate,
                    rotationWeeks,
                    shiftMode,
                    patternConfig
                }),
                status: 'CONFIG',
                note: 'System Metadata'
            };
            const configDocId = `${activeDeptId}_CONFIG`;
            promises.push(
                databases.updateDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, configDocId, configPayload)
                .catch(async (e) => {
                     if (e.code === 404) await databases.createDocument(DATABASE_ID, COLLECTIONS.SCHEDULE, configDocId, configPayload);
                })
            );
            
            if (promises.length > 0) {
                 await Promise.all(promises);
                 if (updateCount > 0) {
                     console.log(`Synced ${updateCount} changes to cloud.`);
                     lastSyncedSchedule.current = JSON.parse(JSON.stringify(currentScheduleState));
                 }
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
        }, 1000); // 1 second debounce
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

    useEffect(() => { localStorage.setItem(getSKey('patternConfig'), JSON.stringify(patternConfig)); }, [patternConfig, activeDeptId]);
    useEffect(() => { localStorage.setItem(getSKey('generationMeta'), JSON.stringify(generationMeta)); }, [generationMeta, activeDeptId]);

    // ==================== GSAP ANIMATIONS ====================
    
    // NOTE: Page load animations disabled to prevent conflicts with Framer Motion
    // Framer Motion already handles sidebar, header, and grid animations beautifully!
    
    // Employee tag hover effects - SMOOTH LIFT ANIMATION
    useEffect(() => {
        const employeeTags = document.querySelectorAll('.employee-tag');
        const cleanupFns = [];
        
        employeeTags.forEach(tag => {
            const cleanup = createEmployeeTagHover(tag);
            if (cleanup) cleanupFns.push(cleanup);
        });
        
        // Cleanup on unmount or when schedule/employees change
        return () => {
            cleanupFns.forEach(fn => fn());
        };
    }, [schedule, employees]);

    // Button press effects for all clickable buttons - SATISFYING PRESS
    useEffect(() => {
        const buttons = document.querySelectorAll('button:not(.no-animation)');
        const cleanupFns = [];
        
        buttons.forEach(btn => {
            const cleanup = createButtonPress(btn);
            if (cleanup) cleanupFns.push(cleanup);
        });
        
        return () => {
            cleanupFns.forEach(fn => fn());
        };
    }, [employees.length, rotationWeeks]); // Re-apply when UI structure might change

    // Magnetic hover for important action buttons - FUTURISTIC EFFECT
    useEffect(() => {
        const magneticBtns = document.querySelectorAll('.btn-magnetic');
        const cleanupFns = [];
        
        magneticBtns.forEach(btn => {
            const cleanup = createMagneticHover(btn, 0.15);
            if (cleanup) cleanupFns.push(cleanup);
        });
        
        return () => {
            cleanupFns.forEach(fn => fn());
        };
    }, []);

    // Stats counter animation - Numbers count up from 0! 📊 ⭐⭐⭐⭐
    useEffect(() => {
        if (showStatsModal) {
            const stats = calculateStats();
            
            // Small delay to let modal render first
            setTimeout(() => {
                // 1. Animate Fairness Score (big number)
                const scoreElement = document.querySelector('.fairness-score-number');
                if (scoreElement) {
                    animateCounter(scoreElement, parseInt(stats.score), 1.2);
                }
                
                // 2. Animate each employee's stats (staggered for smooth effect)
                stats.details.forEach((stat, index) => {
                    setTimeout(() => {
                        // Total shifts
                        const totalElement = document.querySelector(`#stat-total-${stat.id}`);
                        if (totalElement) {
                            animateCounter(totalElement, stat.total, 0.8);
                        }
                        
                        // Night shifts
                        const nightElement = document.querySelector(`#stat-night-${stat.id}`);
                        if (nightElement) {
                            animateCounter(nightElement, stat.night, 0.6);
                        }
                        
                        // Weekend shifts
                        const weekendElement = document.querySelector(`#stat-weekend-${stat.id}`);
                        if (weekendElement) {
                            animateCounter(weekendElement, stat.weekend, 0.6);
                        }
                    }, index * 80); // Stagger each employee card by 80ms
                });
            }, 300); // Wait for modal animation to start
        }
    }, [showStatsModal]);


    // Clear Schedule Handler
    const clearSchedule = () => {
        if (Object.keys(schedule).length === 0) {
            showNotification("Schedule is already empty", "info");
            return;
        }

        // Confirm Action
        if (!window.confirm("Clear visible schedule? This only affects your local view. Refreshing will restore saved data from cloud.")) {
            return;
        }
        
        // Add to history
        const newHistory = [...history.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(schedule))];
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setSchedule({}); // Clear local state
        showNotification("Schedule cleared locally", "success");
        playMicroInteraction('trash');
    };

    // ==================== KEYBOARD SHORTCUTS ⌨️ ====================
    useEffect(() => {
        const handleKeyboardShortcut = (e) => {
            // Ignore shortcuts when typing in input fields
            const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
            

            // Escape - Close any open modal
            if (e.key === 'Escape') {
                if (showStatsModal) setShowStatsModal(false);
                else if (showLeaveModal) setShowLeaveModal(false);

                else if (showAllowanceModal) setShowAllowanceModal(false);
                else if (showAdminDashboard) setShowAdminDashboard(false); // Changed from showUserModal
                else if (showRules) setShowRules(false);
                else if (showShortcutsMenu) setShowShortcutsMenu(false);
                else if (confirmDialog.isOpen) setConfirmDialog({ ...confirmDialog, isOpen: false });
                return;
            }

            // ? - Show shortcuts help menu
            if (e.key === '?' && !isInputActive) {
                e.preventDefault();
                setShowShortcutsMenu(true);
                playMicroInteraction('pop');
                return;
            }

            // Don't process Ctrl shortcuts in input fields (except Ctrl+S)
            if (isInputActive && e.key !== 's') return;

            // Ctrl/Cmd shortcuts
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            if (modifier) {
                switch (e.key.toLowerCase()) {
                    case 'g':
                        // Ctrl+G - Generate Schedule
                        e.preventDefault();
                        assignRotaAutomatically();
                        showNotification('⌨️ Generated schedule (Ctrl+G)', 'success');
                        break;

                    case 's':
                        // Ctrl+S - Save feedback (already auto-saves)
                        e.preventDefault();
                        showNotification('✅ Auto-saved! (Ctrl+S)', 'success');
                        playMicroInteraction('success');
                        break;

                    case 'z':
                        // Ctrl+Z - Undo (already handled by button)
                        if (!e.shiftKey && historyIndex < history.length - 1) {
                            e.preventDefault();
                            undo();
                            showNotification('↶ Undo (Ctrl+Z)', 'success');
                        }
                        break;

                    case 'y':
                        // Ctrl+Y - Redo
                        if (historyIndex > 0) {
                            e.preventDefault();
                            redo();
                            showNotification('↷ Redo (Ctrl+Y)', 'success');
                        }
                        break;

                    case 'k':
                        // Ctrl+K - Show shortcuts menu
                        e.preventDefault();
                        setShowShortcutsMenu(!showShortcutsMenu);
                        playMicroInteraction('pop');
                        break;

                    case 'p':
                        // Ctrl+P - Print (browser default, but show message)
                        showNotification('🖨️ Opening print dialog...', 'success');
                        break;

                    case 'd':
                        // Ctrl+D - Toggle dark mode
                        e.preventDefault();
                        setIsDarkMode(!isDarkMode);
                        showNotification(`🌓 ${!isDarkMode ? 'Dark' : 'Light'} mode (Ctrl+D)`, 'success');
                        break;

                    case 'b':
                        // Ctrl+B - Toggle sidebar
                        e.preventDefault();
                        setIsSidebarOpen(!isSidebarOpen);
                        showNotification(`Sidebar ${!isSidebarOpen ? 'shown' : 'hidden'} (Ctrl+B)`, 'success');
                        break;

                    case 'i':
                        // Ctrl+I - Open Stats/Info
                        e.preventDefault();
                        setShowStatsModal(true);
                        showNotification('📊 Stats opened (Ctrl+I)', 'success');
                        playMicroInteraction('pop');
                        break;

                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyboardShortcut);
        return () => window.removeEventListener('keydown', handleKeyboardShortcut);
    }, [
        showStatsModal, showLeaveModal, showAllowanceModal,
        showRules, showShortcutsMenu, confirmDialog, historyIndex,
        history.length, isDarkMode, isSidebarOpen, showAdminDashboard // Changed from showUserModal
    ]);


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
        const savedMeta = localStorage.getItem(sKey('generationMeta'));
        if (savedMeta) {
            try {
                const parsed = JSON.parse(savedMeta);
                setGenerationMeta(Array.isArray(parsed) ? parsed : []);
            } catch (e) { setGenerationMeta([]); }
        } else {
            setGenerationMeta([]);
        }

        setHistory([]);
        setHistoryIndex(-1);
        setIsInitialLoaded(false); // Restart sync cycle for new department

        const deptsToSearch = forcedDepts || departments;
        const deptName = deptsToSearch.find(d => d.id === id)?.name || id;
        showNotification(`Switched to ${deptName}`);
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

        // Calculate Average
        const totalAll = stats.reduce((a, b) => a + b.total, 0);
        const avg = totalAll / (stats.length || 1);

        // Calculate Variance and StdDev for Fairness Score
        const variance = stats.reduce((a, b) => a + Math.pow(b.total - avg, 2), 0) / (stats.length || 1);
        const stdDev = Math.sqrt(variance);

        // Fairness Score: 100 is perfect, drops as stdDev increases relative to avg
        const fairnessScore = Math.max(0, Math.min(100, 100 - (stdDev / (avg || 1) * 100)));

        // Outlier detection: > 1.5 standard deviation from average is significant
        const outlierThreshold = 1.5 * stdDev;
        const sortedStats = [...stats].sort((a, b) => b.total - a.total);
        const highest = sortedStats[0];
        const lowest = sortedStats[sortedStats.length - 1];

        // Only mark as outlier if it actually deviates significantly and StdDev > 0.5
        const busiestOutlier = highest && (highest.total - avg) > outlierThreshold && stdDev > 0.5 ? highest : null;
        const leastOutlier = lowest && (avg - lowest.total) > outlierThreshold && stdDev > 0.5 ? lowest : null;

        return {
            details: sortedStats,
            avg: avg.toFixed(1),
            score: fairnessScore.toFixed(0),
            stdDev: stdDev.toFixed(2),
            isBalanced: stdDev < 0.8,
            busiestResource: busiestOutlier,
            leastResource: leastOutlier,
            status: stdDev < 0.3 ? "Perfectly Fair" : stdDev < 0.8 ? "Good Balance" : "Needs Improvement"
        };
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
                const keyC = `${week}-${day}-C`;
                const cEmployees = schedule[keyC]?.employees || [];

                let nextWeek = week;
                let nextDayIndex = dayIndex + 1;
                if (nextDayIndex >= 7) {
                    nextDayIndex = 0;
                    nextWeek++;
                }

                if (nextWeek <= rotationWeeks) {
                    const nextDay = DAYS[nextDayIndex];
                    const keyNextA = `${nextWeek}-${nextDay}-A`;
                    const aEmployees = schedule[keyNextA]?.employees || [];

                    cEmployees.forEach(cEmp => {
                        if (!cEmp?.id) return;
                        if (aEmployees.find(aEmp => aEmp?.id === cEmp.id)) {
                            errors[keyNextA] = { message: "Inadequate Rest (C - A)", type: 'warning' };
                            errors[keyC] = { message: "Inadequate Rest (C - A)", type: 'warning' };
                        }
                    });
                }
            });
        }
        return errors;
    };

    // --- Department creation logic ---


    // Predictive Conflict Checker for Drag & Drop
    const checkPotentialConflict = (emp, targetWeek, targetDay, targetShift) => {
        if (!emp) return null;

        // 1. Double Booking Check (Same Day)
        const dayShifts = ['A', 'B', 'C'].filter(s => {
            const key = `${targetWeek}-${targetDay}-${s}`;
            return schedule[key]?.employees?.some(e => e.id === emp.id);
        });

        // If dragging to a shift where they ALREADY are, ignore
        if (dayShifts.includes(targetShift)) return 'existing';
        if (dayShifts.length > 0) return 'error'; // Already working another shift today

        // 2. Rest Violation Check (C -> Next Day A)
        if (targetShift === 'C') {
            let nextWeek = targetWeek;
            let nextDayIndex = DAYS.indexOf(targetDay) + 1;
            if (nextDayIndex >= 7) { nextDayIndex = 0; nextWeek++; }

            if (nextWeek <= rotationWeeks) {
                const nextDayName = DAYS[nextDayIndex];
                const nextKeyA = `${nextWeek}-${nextDayName}-A`;
                if (schedule[nextKeyA]?.employees?.some(e => e.id === emp.id)) return 'warning';
            }
        }

        if (targetShift === 'A') {
            let prevWeek = targetWeek;
            let prevDayIndex = DAYS.indexOf(targetDay) - 1;
            if (prevDayIndex < 0) { prevDayIndex = 6; prevWeek--; }

            if (prevWeek >= 1) {
                const prevDayName = DAYS[prevDayIndex];
                const prevKeyC = `${prevWeek}-${prevDayName}-C`;
                if (schedule[prevKeyC]?.employees?.some(e => e.id === emp.id)) return 'warning';
            }
        }

        return 'safe';
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

        // 2. Filter by rest period (Night C ??? Next Day A)
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
        if (!perms.canEdit) return;
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

    const generateEmptySchedule = () => {
        const newSchedule = {};
        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dIdx) => {
                const date = getDateForCell(week - 1, dIdx);

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
        if (!perms.canAddEmployee) return;
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
        if (!perms.canDelete) return;
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

            playMicroInteraction('trash');
            showNotification('Employee removed');
        }
    };

    const handleDragStart = (e, employee) => {
        if (!perms.canEdit) return;
        setDraggedEmployee(employee);
        e.dataTransfer.effectAllowed = 'copy';

        // Hide default ghost image
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);

        playMicroInteraction('lift');
        if (navigator.vibrate) navigator.vibrate(5);
    };

    const handleDragEnd = () => {
        setDraggedEmployee(null);
    };

    const handleDrop = (e, week, day, shift, suggestedEmp = null) => {
        if (!perms.canEdit) return;
        if (e && e.preventDefault) e.preventDefault();
        const empToAssign = suggestedEmp || draggedEmployee;
        if (!empToAssign) return;

        const key = `${week}-${day}-${shift}`;
        // Robustness: If key doesn't exist (after clear), verify structure
        const cell = schedule[key] || { employees: [], status: 'normal', note: '' };

        if (cell.status === 'holiday') {
            if (!window.confirm('This is a marked holiday. Assign employee anyway for holiday allowance?')) {
                return;
            }
        }

        const newSchedule = { ...schedule };
        const currentEmployees = [...cell.employees];
        const empIndex = currentEmployees.findIndex(e => e?.id === empToAssign.id);

        if (empIndex !== -1) {
            // User requested specific feedback if already present
            showNotification(`${empToAssign.name} is already present in this shift`, 'info'); 
            playMicroInteraction('pop'); // Feedback sound
            return; 
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
        setDraggedEmployee(null);
        playMicroInteraction('pop');
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const handleDragOver = (e, key) => {
        e.preventDefault();
        if (dragOverKey !== key) setDragOverKey(key);
    };

    const handleDragLeave = () => setDragOverKey(null);

    const toggleHoliday = (week, day) => {
        if (!perms.canEdit) return;
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
        if (!perms.canEdit) return;
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
            playMicroInteraction('trash');
            if (!removedEmp) showNotification('Employee removed from cell');
        }
    };

    // Greater Noida 2026 Holiday List
    const GREATER_NOIDA_HOLIDAYS_2026 = [
        { date: '2026-01-01', name: 'New Year' },
        { date: '2026-01-26', name: 'Republic Day' },
        { date: '2026-03-04', name: 'Holi' },
        { date: '2026-03-21', name: 'Eid ul Fitr' },
        { date: '2026-08-15', name: 'Independence Day' },
        { date: '2026-08-28', name: 'Rakshabandan' },
        { date: '2026-10-02', name: 'Gandhi Jayanti' },
        { date: '2026-10-20', name: 'Dussehra' },
        { date: '2026-11-07', name: 'Choti Diwali' },
        { date: '2026-11-08', name: 'Diwali' },
        { date: '2026-11-09', name: 'Govardhan Puja' },
        { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
        { date: '2026-12-25', name: 'Christmas' }
    ];

    // Apply holidays to schedule
    const applyHolidaysToSchedule = (scheduleObj) => {
        const updatedSchedule = { ...scheduleObj };
        let holidayCount = 0;

        // Check all weeks and days in the rota
        for (let w = 1; w <= rotationWeeks; w++) {
            for (let dIdx = 0; dIdx < 7; dIdx++) {
                const cellDate = getDateForCell(w - 1, dIdx);
                const dateStr = cellDate.toISOString().split('T')[0];

                const holiday = GREATER_NOIDA_HOLIDAYS_2026.find(h => h.date === dateStr);

                if (holiday) {
                    const dayName = DAYS[dIdx];
                    // Apply holiday to all shifts for this day
                    ['A', 'B', 'C'].forEach(shift => {
                        const key = `${w}-${dayName}-${shift}`;
                        updatedSchedule[key] = {
                            employees: [],
                            status: 'holiday',
                            note: holiday.name
                        };
                    });
                    holidayCount++;
                }
            }
        }

        return { updatedSchedule, holidayCount };
    };

    const assignRotaAutomatically = async (targetWeek = null) => {
        if (!perms.canCreate) return;
        // Validation: Ensure generationMeta is an array (Safety check for legacy data)
        const currentMeta = Array.isArray(generationMeta) ? generationMeta : [];

        // Overwrite Protection & Overlap Detection (Skip for single week updates usually, or keep simple)
        // If updating single week, we are explicitly overwriting it.
        const targetStart = new Date(startDate);
        if (targetWeek) {
             targetStart.setDate(targetStart.getDate() + ((targetWeek - 1) * 7));
        }
        const targetEnd = new Date(targetStart);
        targetEnd.setDate(targetEnd.getDate() + (targetWeek ? 6 : (rotationWeeks * 7) - 1));

        const overlappingGen = currentMeta.find(gen => {
            const genStart = new Date(gen.start);
            const genEnd = new Date(gen.end);
            // Check if periods overlap
            return (targetStart <= genEnd && targetEnd >= genStart);
        });

        if (overlappingGen && !targetWeek) { // Only warn for full generation, single week is explicit action
            const lastTime = new Date(overlappingGen.timestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            setConfirmDialog({
                isOpen: true,
                title: 'Overwrite Detection',
                type: 'warning',
                message: `This period (or part of it) was already generated on ${lastTime}. Re-generating will overwrite ALL existing assignments for these dates to ensure accurate calculations. Do you want to proceed?`,
                onConfirm: () => executeAutoGeneration(targetWeek)
            });
            return;
        }

        executeAutoGeneration(targetWeek);
    };

    const executeAutoGeneration = async (targetWeek = null) => {
        // Validation: Ensure generationMeta is an array (Safety check for legacy data)
        const currentMeta = Array.isArray(generationMeta) ? generationMeta : [];
        const targetStart = new Date(startDate);
        if (targetWeek) {
            targetStart.setDate(targetStart.getDate() + ((targetWeek - 1) * 7));
        }
        const targetEnd = new Date(targetStart);
        targetEnd.setDate(targetEnd.getDate() + (targetWeek ? 6 : (rotationWeeks * 7) - 1));

        // If targetWeek exists, we start with CURRENT schedule to preserve other weeks
        const newSchedule = targetWeek ? { ...schedule } : {};

        if (activeDept.type === 'MES') {
            if (shiftMode === '3') {
                generate3ShiftSchedule(newSchedule, targetWeek);
            } else if (shiftMode === 'Pattern') {
                generatePatternSchedule(newSchedule, targetWeek);
            } else {
                generate2ShiftSchedule(newSchedule, targetWeek);
            }
        } else {
            if (shiftMode === 'Pattern') {
                generatePatternSchedule(newSchedule, targetWeek);
            } else {
                generateGeneralSchedule(newSchedule, targetWeek);
            }
        }

        // Apply holidays automatically
        // Note: applyHolidaysToSchedule currently iterates ALL weeks. 
        // We should strictly only apply to the generated weeks to avoid weird side effects? 
        // Actually, reapplying holidays to existing weeks is harmless (idempotent).
        const { updatedSchedule: autoSchedule, holidayCount } = applyHolidaysToSchedule(newSchedule);

        // Smart Merge: Merge new generated part into existing schedule
        const mergedSchedule = { ...schedule, ...autoSchedule };

        // Update Generation Meta (Remove previous overlaps and add new one)
        const filteredMeta = currentMeta.filter(gen => {
            const genStart = new Date(gen.start);
            const genEnd = new Date(gen.end);
            return !(targetStart <= genEnd && targetEnd >= genStart);
        });

        const newMeta = [
            ...filteredMeta,
            {
                start: targetStart.toISOString(),
                end: targetEnd.toISOString(),
                timestamp: new Date().toISOString()
            }
        ];

        setGenerationMeta(newMeta);
        setSchedule(mergedSchedule);
        saveToHistory(mergedSchedule);
        
        // Force immediate sync to cloud to prevent data loss on reload
        syncToCloud(mergedSchedule);

        const holidayMsg = holidayCount > 0 ? ` with holidays applied` : '';
        const weekMsg = targetWeek ? `Week ${targetWeek}` : `${activeDept.name} Rota`;
        showNotification(`${weekMsg} Updated Successfully${holidayMsg}`);

        // Close dialog if it was open
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));

        // Celebration!
        confetti({
            particleCount: targetWeek ? 50 : 150, // Less confetti for small update
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


    const generatePatternSchedule = (newSchedule, targetWeek = null) => {
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
            // Stagger start: each employee starts at a different point in the sequence
            const startOffset = (empIdx * 2) % sequence.length;

            for (let week = 1; week <= rotationWeeks; week++) {
                if (targetWeek && week !== targetWeek) continue;

                DAYS.forEach((day, dIdx) => {
                    const dayOffset = (week - 1) * 7 + dIdx;
                    const shiftAtDay = sequence[(dayOffset + startOffset) % sequence.length];

                    if (shiftAtDay !== 'Off') {
                        const key = `${week}-${day}-${shiftAtDay}`;
                        if (!newSchedule[key]) {
                            newSchedule[key] = { employees: [], status: 'normal', note: 'Pattern' };
                        }
                        newSchedule[key].employees.push(emp);
                    }
                });
            }
        });

        // Fill remaining empty cells to ensure state consistency
        for (let week = 1; week <= rotationWeeks; week++) {
            if (targetWeek && week !== targetWeek) continue;
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

    const generateGeneralSchedule = (newSchedule, targetWeek = null) => {
        const sortedEmps = [...employees].filter(Boolean);
        let empPointer = 0;

        for (let week = 1; week <= rotationWeeks; week++) {
            if (targetWeek && week !== targetWeek) {
                // Advance pointer even if skipping, to maintain cycle consistency? 
                // Decision: For general round-robin, if we regenerate only Week 3, 
                // we probably want "fresh" randomness or standard cycle. 
                // Let's just continue loop but not write. 
                // Actually, to maintain true continuity, we need the pointer to evolve.
                // But simplified: Just skipping write is safer.
                
                // Correction: Round robin relies on state. If we skip writing, empPointer still increments 
                // if we iterate. So we MUST iterate logic but not write?
                // Or better: Just calculate normally, but check targetWeek before writing.
            }
            // Simple logic:
            
            DAYS.forEach(day => {
                ['A', 'B', 'C'].slice(0, shiftMode === '3' ? 3 : 2).forEach(shift => {
                   
                    const dailyTeam = [];
                    if (sortedEmps.length > 0) {
                        dailyTeam.push(sortedEmps[empPointer % sortedEmps.length]);
                        empPointer++;
                    }

                    if (targetWeek && week !== targetWeek) return;

                    const key = `${week}-${day}-${shift}`;
                    newSchedule[key] = {
                        employees: dailyTeam,
                        status: 'normal',
                        note: 'General assignment'
                    };
                });
            });
        }
    };

    const generate3ShiftSchedule = (newSchedule, targetWeek = null) => {
        // 1. Identify Teams based on default verification
        const teamA = employees.filter(e => e.shift === 'A');
        const teamB = employees.filter(e => e.shift === 'B');
        const teamC = employees.filter(e => e.shift === 'C');

        for (let week = 1; week <= rotationWeeks; week++) {
            if (targetWeek && week !== targetWeek) continue;
            
            // 2. Determine Rotation for this week (Team Rotation: A -> B -> C)
            // Changed to rotate every 2 WEEKS
            const teamRotation = Math.floor((week - 1) / 2) % 3;
            let shiftA, shiftB, shiftC;

            if (teamRotation === 0) {
                // Shift A = Team A, Shift B = Team B, Shift C = Team C
                shiftA = teamA; shiftB = teamB; shiftC = teamC;
            } else if (teamRotation === 1) {
                // ROTATION 1: Shift A = Team B, Shift B = Team C, Shift C = Team A
                shiftA = teamB; shiftB = teamC; shiftC = teamA;
            } else {
                // ROTATION 2: Shift A = Team C, Shift B = Team A, Shift C = Team B
                shiftA = teamC; shiftB = teamA; shiftC = teamB;
            }

            // 3. Internal Rotation for Weekends (Who works within the team)
            let rotation = (week - 1) % 2;

            // Monday to Thursday
            ['Mon', 'Tue', 'Wed', 'Thu'].forEach((day) => {
                newSchedule[`${week}-${day}-A`] = { employees: shiftA.slice(0, 2), status: 'normal', note: '2 persons per shift' };
                newSchedule[`${week}-${day}-B`] = { employees: shiftB.slice(0, 2), status: 'normal', note: '2 persons per shift' };
                newSchedule[`${week}-${day}-C`] = { employees: shiftC.slice(0, 2), status: 'normal', note: '2 persons per shift' };
            });

            // FRIDAY
            const friA = shiftA.length > 0 ? shiftA[rotation % shiftA.length] : null;
            const friB = shiftB.length > 0 ? shiftB[rotation % shiftB.length] : null;
            const friC = shiftC.length > 0 ? shiftC[rotation % shiftC.length] : null;
            newSchedule[`${week}-Fri-A`] = { employees: friA ? [friA] : [], status: 'normal', note: '1 person working' };
            newSchedule[`${week}-Fri-B`] = { employees: friB ? [friB] : [], status: 'normal', note: '1 person working' };
            newSchedule[`${week}-Fri-C`] = { employees: friC ? [friC] : [], status: 'normal', note: '1 person working' };

            // SATURDAY
            const satA = shiftA.find(e => e.id !== friA?.id) || shiftA[0];
            const satB = shiftB.find(e => e.id !== friB?.id) || shiftB[0];
            const satC = shiftC.find(e => e.id !== friC?.id) || shiftC[0];
            newSchedule[`${week}-Sat-A`] = { employees: satA ? [satA] : [], status: 'normal', note: 'Friday OFF person works' };
            newSchedule[`${week}-Sat-B`] = { employees: satB ? [satB] : [], status: 'normal', note: 'Friday OFF person works' };
            newSchedule[`${week}-Sat-C`] = { employees: satC ? [satC] : [], status: 'normal', note: 'Friday OFF person works' };

            // SUNDAY
            // SUNDAY
            const sunA = shiftA[rotation % shiftA.length];
            
            // Critical Rotation Check: 
            // If Week X Sunday Night (ends Mon 7am) -> leads to Week X+1 Mon Morning (starts Mon 7am)
            // We must ensure the person working Sunday Night is NOT in the team assigned to Shift A next week.
            
            const nextWeek = week + 1;
            const nextRotIndex = Math.floor((nextWeek - 1) / 2) % 3;
            let nextShiftATeam = [];
            
            if (nextRotIndex === 0) nextShiftATeam = teamA;
            else if (nextRotIndex === 1) nextShiftATeam = teamB; // Matches Rotation 1 above
            else nextShiftATeam = teamC; // Matches Rotation 2 above

            const nextShiftAIds = nextShiftATeam.map(e => e.id);

            // Candidates for Sunday Night (Usually from B and C teams)
            const bcTeam = [...shiftB, ...shiftC];
            
            // Filter out anyone who has Morning shift next Monday
            const safeNightCandidates = bcTeam.filter(e => !nextShiftAIds.includes(e.id));
            
            // Fallback to bcTeam just in case (shouldn't happen with standard rotation but safety first)
            const pool = safeNightCandidates.length > 0 ? safeNightCandidates : bcTeam;
            
            const sunNight = pool.length > 0 ? pool[(week - 1) % pool.length] : null;

            newSchedule[`${week}-Sun-A`] = { employees: sunA ? [sunA] : [], status: 'normal', note: '12hr shift (7am-7pm)' };
            newSchedule[`${week}-Sun-B`] = { employees: [], status: 'normal', note: '' };
            newSchedule[`${week}-Sun-C`] = { employees: sunNight ? [sunNight] : [], status: 'normal', note: '12hr shift (7pm-7am)' };
        }
    };

    const generate2ShiftSchedule = (newSchedule, targetWeek = null) => {
        let allEmployees = [...employees];

        const abhayraj = allEmployees.find(e => e.name === "Abhayraj");
        const javed = allEmployees.find(e => e.name === "Javed");

        if (abhayraj && javed) {
            const others = allEmployees.filter(e => e.name !== "Abhayraj" && e.name !== "Javed");
            const mid = Math.ceil(allEmployees.length / 2);
            allEmployees = [abhayraj, ...others.slice(0, mid - 1), javed, ...others.slice(mid - 1)];
        }

        for (let week = 1; week <= rotationWeeks; week++) {
            if (targetWeek && week !== targetWeek) continue;
            if (targetWeek && week !== targetWeek) continue;
            let rotation = (week - 1) % 3;
            const midPoint = Math.ceil(allEmployees.length / 2);
            const cycle = Math.floor((week - 1) / 2) % 2;
            const shiftAmount = cycle * midPoint;
            const currentEmployees = [...allEmployees.slice(shiftAmount), ...allEmployees.slice(0, shiftAmount)];
            const teamA = currentEmployees.slice(0, midPoint);
            const teamB = currentEmployees.slice(midPoint);

            // Mon-Thu
            ['Mon', 'Tue', 'Wed', 'Thu'].forEach(day => {
                newSchedule[`${week}-${day}-A`] = { employees: teamA, status: 'normal', note: `${teamA.length} persons` };
                newSchedule[`${week}-${day}-B`] = { employees: teamB, status: 'normal', note: `${teamB.length} persons` };
                newSchedule[`${week}-${day}-C`] = { employees: [], status: 'normal', note: '' };
            });

            const getWeekendWorker = (team, dayOffset) => {
                if (team.length === 0) return [];
                const index = (rotation + dayOffset) % team.length;
                return [team[index]];
            };

            // Fri-Sun
            ['Fri', 'Sat', 'Sun'].forEach((day, idx) => {
                newSchedule[`${week}-${day}-A`] = { employees: getWeekendWorker(teamA, idx), status: 'normal', note: '1 person working, 2 OFF' };
                newSchedule[`${week}-${day}-B`] = { employees: getWeekendWorker(teamB, idx), status: 'normal', note: '1 person working, 2 OFF' };
                newSchedule[`${week}-${day}-C`] = { employees: [], status: 'normal', note: '' };
            });
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
            { header: 'Weekend Shifts', key: 'weekend', width: 15 }
        ];

        stats.forEach(s => {
            worksheet.addRow({
                name: s.name,
                night: s.night,
                weekend: s.weekend
            });
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
            stats[emp.id] = { name: emp.name, evening: 0, night: 0, weekend: 0, holiday: 0, total: 0 };
        });

        const startRange = new Date(allowanceRange.start);
        const endRange = new Date(allowanceRange.end);
        endRange.setHours(23, 59, 59);

        // Iterate through every single day in the selected range
        let currentDate = new Date(startRange);
        while (currentDate <= endRange) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayOfW = currentDate.getDay(); // 0-Sun, 1-Mon...
            const dayName = DAYS[(dayOfW + 6) % 7];
            const isWeekend = dayName === 'Sun' || dayName === 'Sat';
            const isHoliday = GREATER_NOIDA_HOLIDAYS_2026.some(h => h.date === dateStr);

            // Calculate rotation week based on startDate
            const startAnchor = new Date(startDate);
            // Normalize both to UTC midnight for day diff
            const d1 = Date.UTC(startAnchor.getFullYear(), startAnchor.getMonth(), startAnchor.getDate());
            const d2 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));

            if (diffDays >= 0) {
                // Determine which week of the rotation we are in (1-indexed)
                const effectiveWeek = (Math.floor(diffDays / 7) % rotationWeeks) + 1;

                ['A', 'B', 'C'].forEach(shift => {
                    const key = `${effectiveWeek}-${dayName}-${shift}`;
                    const cell = schedule[key];
                    if (cell && cell.employees) {
                        cell.employees.forEach(empRef => {
                            if (stats[empRef.id]) {
                                stats[empRef.id].total++;
                                if (shift === 'B') stats[empRef.id].evening++;
                                if (shift === 'C') stats[empRef.id].night++;
                                if (isWeekend) stats[empRef.id].weekend++;
                                if (isHoliday) stats[empRef.id].holiday++;
                            }
                        });
                    }
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
        return Object.values(stats);
    };

    const shareWithTransport = async () => {
        // --- CONFIGURATION: UPDATE THESE EMAILS ---
        const RECIPIENT_EMAIL = "transport@kimbal.io,ram.swarth@kimbal.io,transport.help@kimbal.io"; 
        const CC_EMAILS = "mes.support@kimbal.io,naveen.kumar@kimbal.io";
        // ------------------------------------------

        // 1. Generate Premium HTML Table for Clipboard
        const headerBg = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
        const accentColor = "#14b8a6"; // Teal

        let htmlTable = `
        <div style="font-family: 'Segoe UI', user-select: none; Helvetica, Arial, sans-serif; max-width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: ${headerBg}; padding: 24px 32px; color: white;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">ROTA Schedule</h2>
                <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Week Starting: <strong>${formatDate(new Date(startDate))}</strong> • ${activeDept.name}</p>
            </div>

            <!-- Table Container -->
            <div style="padding: 0; background-color: white;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 16px; text-align: left; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Date</th>
                            <th style="padding: 16px; text-align: left; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Day</th>
                            ${employees.map(emp => `<th style="padding: 16px; text-align: center; color: #475569; font-weight: 700; border-left: 1px solid #f1f5f9;">${emp.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>`;

        // Filter Config: Start filter from the 'startDate' selected by user
        // Note: getDateForCell snaps to Monday, so grid always starts Monday.
        // We filter rows that are strictly BEFORE the user's selected date.
        const exportStart = new Date(startDate);
        exportStart.setHours(0, 0, 0, 0);

        for (let week = 1; week <= rotationWeeks; week++) {
            DAYS.forEach((day, dayIndex) => {
                const dateObj = getDateForCell(week - 1, dayIndex);
                
                // --- FILTER LOGIC ---
                const checkDate = new Date(dateObj);
                checkDate.setHours(0, 0, 0, 0);
                if (checkDate < exportStart) return; // Skip days before selected start
                // --------------------

                const dateStr = formatDate(dateObj);
                const isSunday = day === 'Sun';
                const rowBg = isSunday ? '#fffbeb' : (dayIndex % 2 === 0 ? '#ffffff' : '#fcfcfc'); // Subtle stripe
                
                htmlTable += `<tr style="background-color: ${rowBg}; border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px 16px; color: #334155; font-weight: 600; border-right: 1px solid #f1f5f9;">${dateStr}</td>
                    <td style="padding: 12px 16px; color: ${isSunday ? '#ef4444' : '#64748b'}; font-weight: ${isSunday ? '800' : '600'}; border-right: 1px solid #f1f5f9;">${day}</td>`;

                employees.forEach(emp => {
                    let cellContent = `<span style="opacity: 0.3; font-weight: 500;">OFF</span>`;
                    
                    ['A', 'B', 'C'].forEach(shift => {
                        const key = `${week}-${day}-${shift}`;
                        const cell = schedule[key] || { employees: [], status: 'normal' };

                        const isWorking = cell.employees.some(e => e.id === emp.id);
                        
                        if (isWorking) {
                            let badgeColor = "#94a3b8"; // Default
                            let badgeText = SHIFTS[shift].label.match(/\((.*?)\)/)?.[1] || shift;
                            
                            if (shift === 'A') badgeColor = "#059669"; // Emerald
                            if (shift === 'B') badgeColor = "#d97706"; // Amber
                            if (shift === 'C') badgeColor = "#6366f1"; // Indigo
                            if (day === 'Sun') { badgeColor = "#dc2626"; badgeText += "*"; } // Red for Sunday

                            cellContent = `<span style="display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: ${badgeColor}; color: white; font-family: sans-serif; font-weight: bold; font-size: 11px; text-decoration: none; border: 1px solid ${badgeColor}; mso-hide: all;">${badgeText}</span><!--[if mso]><i style="background-color:${badgeColor}; color:white; font-style:normal; font-weight:bold; padding:4px 12px; border-radius:4px;">${badgeText}</i><![endif]-->`;
                        } else if (cell.status === 'leave' && cell.note.includes(emp.name)) {
                             cellContent = `<span style="color: #f97316; font-weight: 700; font-size: 11px;">LEAVE</span>`;
                        }
                    });

                    // Holiday Override
                     if (schedule[`${week}-${day}-A`]?.status === 'holiday') {
                         // Only override if not working
                         if (cellContent.includes('OFF')) cellContent = `<span style="color: #ef4444; font-weight: 700; font-size: 10px; letter-spacing: 0.5px;">HOLIDAY</span>`;
                     }

                    htmlTable += `<td style="padding: 8px; text-align: center; border-left: 1px solid #f1f5f9;">${cellContent}</td>`;
                });
                htmlTable += `</tr>`;
            });
        }
        htmlTable += `
                    </tbody>
                </table>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: right;">
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">Generated by <strong>Rota-Base</strong> • <a href="#" style="color: #14b8a6; text-decoration: none;">View Live</a></p>
            </div>
        </div>`;

        // 2. Copy to Clipboard (Rich HTML)
        try {
            const blobHtml = new Blob([htmlTable], { type: 'text/html' });
            // Plain text fallback
            const blobText = new Blob(["Please check the Rota Schedule in HTML format."], { type: 'text/plain' }); 
            
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': blobHtml,
                    'text/plain': blobText
                })
            ]);
            showNotification('✨ Premium Table copied!', 'success');
        } catch (err) {
            console.error('Clipboard failed', err);
            showNotification('Could not update clipboard', 'error');
        }

        // 3. Open Outlook
        const startObj = new Date(startDate);
        // End Date is determined by Grid Logic (Anchor + Weeks)
        const gridEndDate = getDateForCell(rotationWeeks - 1, 6);
        const dateRangeStr = `${startObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${gridEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
        
        const subject = `Rota Schedule (${activeDept.name}): ${dateRangeStr}`;
        const body = `Hi Team,%0D%0A%0D%0AHere is the updated roster schedule.%0D%0A%0D%0A[PASTE TABLE HERE by pressing Ctrl+V]%0D%0A%0D%0ARegards,%0D%0A${user?.name || 'Rota Admin'}`;
        
        // Construct mailto link with CC
        let mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
        if (CC_EMAILS && CC_EMAILS.trim()) {
            mailtoLink += `&cc=${CC_EMAILS}`;
        }

        window.location.href = mailtoLink;
        showNotification('Outlook opened! Ctrl+V to paste table.', 'success');
    };



    const generateWhatsAppSummary = async () => {
        let msg = `???? *ROTA Schedule Summary*\n\n`;

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
                <div
                    className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in border shimmer-btn ${notification.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
                        }`}
                    style={{
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        contain: 'layout style paint',
                        position: 'fixed',
                        top: '1.5rem',
                        right: '1.5rem',
                        pointerEvents: 'auto'
                    }}
                >
                    {notification.type === 'success' ? <div className="p-2 bg-green-100 rounded-full"><CheckCircle2 size={20} className="text-green-600" /></div> : <div className="p-2 bg-red-100 rounded-full"><AlertCircle size={20} className="text-red-600" /></div>}
                    <span className="font-bold tracking-tight">{notification.message}</span>
                </div>
            )}

            {/* Stats Modal / Fairness Index Dashboard */}
            {showStatsModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center z-[110] transition-all p-2 md:p-3 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`rounded-[1.5rem] p-4 md:p-5 w-full max-w-[920px] max-h-[96vh] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border relative overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-950/90 border-white/10' : 'bg-white/95 border-slate-200'}`}
                    >
                        {/* Decorative Premium Background Elements */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full -ml-48 -mb-48 pointer-events-none"></div>
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:32px_32px]"></div>

                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-[1.25rem] shadow-xl relative group ${isDarkMode ? 'bg-slate-900 text-teal-400 border border-white/10' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}>
                                    <BarChart3 size={28} strokeWidth={2} />
                                    <div className="absolute inset-0 bg-teal-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className={`text-2xl md:text-3xl font-[1000] tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Fairness Index
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>Work Summary</div>
                                        <div className="w-1 h-1 rounded-full bg-slate-400/50"></div>
                                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Live Roster Audit</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={exportToExcel}
                                    className={`px-4 py-2 rounded-xl transition-all border flex items-center gap-2.5 active:scale-95 group shadow-lg text-[10px] font-[900] uppercase tracking-wider ${isDarkMode ? 'bg-slate-900 border-white/10 text-teal-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-teal-600 hover:bg-teal-50'}`}>
                                    <Download size={14} />
                                    Download Audit
                                </button>
                                <button
                                    onClick={() => setShowStatsModal(false)}
                                    className={`p-2.5 rounded-xl transition-all border ${isDarkMode ? 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            {(() => {
                                const stats = calculateStats();
                                const highest = stats.details[0] || { total: 0 };
                                const lowest = stats.details[stats.details.length - 1] || { total: 0 };

                                return (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Fairness Score Hero */}
                                            <div className={`md:col-span-2 p-4 rounded-[1.25rem] border relative overflow-hidden group ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-slate-50/80 border-slate-200'}`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                                <div className="relative z-10 flex items-center justify-between h-full">
                                                    <div>
                                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-1.5">Fairness Score</span>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <div id="fairness-score" className={`fairness-score-number text-5xl font-[1000] tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.score}</div>
                                                            <div className="text-lg font-black text-slate-400">/100</div>
                                                        </div>
                                                        <div className={`mt-2.5 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tight border ${stats.score > 90 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : stats.score > 75 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                                            {stats.status}
                                                            <Sparkles size={10} className={stats.score > 90 ? 'animate-pulse' : ''} />
                                                        </div>
                                                    </div>
                                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                                        <svg className="w-full h-full -rotate-90">
                                                            <circle cx="48" cy="48" r="42" fill="none" strokeWidth="6" className={isDarkMode ? 'stroke-white/5' : 'stroke-slate-200'} />
                                                            <motion.circle
                                                                cx="48" cy="48" r="42" fill="none" strokeWidth="6"
                                                                strokeDasharray="263.8"
                                                                initial={{ strokeDashoffset: 263.8 }}
                                                                animate={{ strokeDashoffset: 263.8 - (263.8 * stats.score / 100) }}
                                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                                strokeLinecap="round"
                                                                className={stats.score > 90 ? 'stroke-emerald-500' : stats.score > 75 ? 'stroke-teal-500' : 'stroke-amber-500'}
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className={`p-2.5 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                                                                <ShieldCheck size={20} className={stats.score > 90 ? 'text-emerald-500' : 'text-teal-500'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* High/Low Insights */}
                                            <div className="grid grid-rows-2 gap-3 md:col-span-2">
                                                <div className={`p-4 rounded-[1.25rem] border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 rounded-xl ${stats.busiestResource ? 'bg-red-500/10 text-red-500' : 'bg-teal-500/10 text-teal-500'}`}>
                                                            {stats.busiestResource ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                                                        </div>
                                                        <div>
                                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Workload Alert</span>
                                                            <div className={`text-base font-[900] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.busiestResource ? stats.busiestResource.name : 'All Balanced'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-[13px] font-black ${stats.busiestResource ? 'text-red-500' : 'text-teal-500'}`}>{stats.busiestResource ? `+${(stats.busiestResource.total - stats.avg).toFixed(1)} shifts` : 'Balanced'}</div>
                                                        <div className="text-[8px] font-bold text-slate-500 uppercase">vs Average ({stats.avg})</div>
                                                    </div>
                                                </div>

                                                <div className={`p-4 rounded-[1.25rem] border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                                                            <Calendar size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Shift Variance</span>
                                                            <div className={`text-base font-[900] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.stdDev} StdDev</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[13px] font-black text-slate-400">Workload Difference</div>
                                                        <div className="text-[8px] font-bold text-slate-500 uppercase italic">Spread Consistency</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Bar Chart */}
                                        <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden ${isDarkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                                    <div className="w-3 h-1 rounded-full bg-teal-500"></div>
                                                    Shift Comparison
                                                </h4>
                                                <div className="flex gap-4">
                                                    {['A', 'B', 'C'].map(shift => (
                                                        <div key={shift} className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-sm ${shift === 'C' ? 'bg-violet-500' : shift === 'B' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                                            <span className="text-[8px] font-bold text-slate-400">Shift {shift}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-end gap-2 md:gap-3 h-36 pt-4">
                                                {stats.details.map((stat, idx) => {
                                                    const heightPercent = Math.max(10, (stat.total / (highest.total || 1)) * 100);
                                                    const isHighest = stat.id === highest.id;
                                                    const empColor = employees.find(e => e.id === stat.id)?.color || '#94a3b8';

                                                    return (
                                                        <div key={stat.id} className="flex-1 flex flex-col items-center group relative h-full">
                                                            <div className="flex-1 w-full flex flex-col justify-end min-w-[30px]">
                                                                <motion.div
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${heightPercent}%` }}
                                                                    transition={{ type: 'spring', damping: 15, stiffness: 100, delay: idx * 0.05 }}
                                                                    className="w-full rounded-t-2xl transition-all relative group-hover:brightness-125"
                                                                    style={{
                                                                        background: `linear-gradient(to top, ${empColor}dd, ${empColor})`,
                                                                        boxShadow: isHighest ? `0 0 25px ${empColor}30` : 'none'
                                                                    }}
                                                                >
                                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                                                                        <div
                                                                            className="px-3 py-1 rounded-xl text-[10px] font-black text-white shadow-2xl skew-x-[-10deg]"
                                                                            style={{ backgroundColor: empColor }}
                                                                        >
                                                                            {stat.total} SHIFTS
                                                                        </div>
                                                                    </div>

                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <div className="text-[10px] text-white/60 font-black">N:{stat.night}</div>
                                                                        <div className="text-[10px] text-white/60 font-black">W:{stat.weekend}</div>
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                            <div className="mt-4 flex flex-col items-center gap-1.5 px-1 w-full">
                                                                <div className="w-8 h-8 rounded-full border-2 p-0.5" style={{ borderColor: isHighest ? empColor : isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}>
                                                                    <div
                                                                        className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-inner"
                                                                        style={{ backgroundColor: empColor }}
                                                                    >
                                                                        {stat.name[0]}
                                                                    </div>
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase tracking-tight truncate w-full text-center" style={{ color: isHighest ? empColor : isDarkMode ? '#94a3b8' : '#64748b' }}>
                                                                    {stat.name.split(' ')[0]}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Resource Cards Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {stats.details.map((stat, idx) => (
                                                <motion.div
                                                    key={stat.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + (idx * 0.05) }}
                                                    className={`p-4 rounded-3xl border transition-all hover:scale-[1.02] hover:shadow-xl ${isDarkMode ? 'bg-slate-900/60 border-white/5 hover:border-teal-500/50' : 'bg-white border-slate-100 shadow-sm hover:border-teal-300'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg" style={{ backgroundColor: employees.find(e => e.id === stat.id)?.color || '#94a3b8' }}>
                                                                {stat.name[0]}
                                                            </div>
                                                            <div>
                                                                <div className={`text-[13px] font-[900] tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.name}</div>
                                                                <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{employees.find(e => e.id === stat.id)?.shift} Base Preference</div>
                                                            </div>
                                                        </div>
                                                        <div id={`stat-total-${stat.id}`} className={`text-xl font-[1000] tracking-tighter ${stat.id === highest.id ? 'text-teal-500' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{stat.total}</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className={`px-3 py-2 rounded-2xl flex items-center gap-3 ${isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'}`}>
                                                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500"><Moon size={12} /></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-black text-slate-500 uppercase">Nights</span>
                                                                <span id={`stat-night-${stat.id}`} className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{stat.night}</span>
                                                            </div>
                                                        </div>
                                                        <div className={`px-3 py-2 rounded-2xl flex items-center gap-3 ${isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'}`}>
                                                            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500"><Calendar size={12} /></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-black text-slate-500 uppercase">Weekends</span>
                                                                <span id={`stat-weekend-${stat.id}`} className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{stat.weekend}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Footer Status */}
                        <div className={`mt-6 pt-4 border-t flex items-center justify-between z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Operational</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 italic">Audit reflects {rotationWeeks} weeks of active scheduling data.</div>
                            </div>
                            <div className="text-[10px] font-[1000] text-teal-600/50 uppercase tracking-[0.2em]">© ROTA BASE INTELLIGENCE 2024</div>
                        </div>
                    </motion.div >
                </div >
            )}

            {/* Allowance Modal */}
            {/* Allowance Modal - Redesigned & Compact */}
            <AnimatePresence>
                {showAllowanceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAllowanceModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`relative w-full max-w-xl overflow-hidden rounded-[2rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900/90 border-slate-700/50' : 'bg-white/90 border-white/20'}`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 animate-shimmer" />

                            <div className="p-3 lg:p-4">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                            <Wallet size={14} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Allowances</span>
                                    </div>
                                    <button
                                        onClick={() => setShowAllowanceModal(false)}
                                        className={`p-1 rounded-lg transition-all ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div className={`relative rounded-xl overflow-hidden border transition-all ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-blue-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-blue-400'}`}>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2.5 pointer-events-none z-10">
                                            <Calendar size={10} className="text-blue-500" />
                                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter mr-1">From</span>
                                        </div>
                                        <input
                                            type="date"
                                            value={allowanceRange.start}
                                            onChange={(e) => setAllowanceRange({ ...allowanceRange, start: e.target.value })}
                                            style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                                            className={`w-full pl-14 pr-3 py-1 bg-transparent border-none font-bold text-[10px] outline-none relative z-0 ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`}
                                        />
                                    </div>
                                    <div className={`relative rounded-xl overflow-hidden border transition-all ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-violet-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-violet-400'}`}>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2.5 pointer-events-none z-10">
                                            <Calendar size={10} className="text-violet-500" />
                                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter mr-1">To</span>
                                        </div>
                                        <input
                                            type="date"
                                            value={allowanceRange.end}
                                            onChange={(e) => setAllowanceRange({ ...allowanceRange, end: e.target.value })}
                                            style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                                            className={`w-full pl-14 pr-3 py-1 bg-transparent border-none font-bold text-[10px] outline-none relative z-0 ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border overflow-hidden border-slate-800/10 mb-3">
                                    <div className="max-h-[55vh] overflow-y-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse">
                                            <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                <tr>
                                                    <th className="px-4 py-2 text-[8px] font-black uppercase text-slate-400 tracking-wider">Employee</th>
                                                    <th className="px-4 py-2 text-[8px] font-black uppercase text-slate-400 tracking-wider text-center">Nights (C)</th>
                                                    <th className="px-4 py-2 text-[8px] font-black uppercase text-slate-400 tracking-wider text-center">Weekends</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/10">
                                                {(() => {
                                                    const stats = calculateAllowanceStats();
                                                    return stats.map((s, idx) => (
                                                        <motion.tr
                                                            key={s.name}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className={`group transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                                                        >
                                                            <td className="px-4 py-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-1 h-1 rounded-full ${idx % 2 === 0 ? 'bg-blue-500' : 'bg-violet-500'}`} />
                                                                    <span className={`font-bold text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{s.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-center">
                                                                <span className={`inline-flex items-center justify-center min-w-[24px] px-1 py-0.5 rounded-lg font-black text-[9px] ${isDarkMode ? 'bg-violet-900/30 text-violet-400 ring-1 ring-violet-500/20' : 'bg-violet-50 text-violet-600 ring-1 ring-violet-200'}`}>
                                                                    {s.night}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 text-center">
                                                                <span className={`inline-flex items-center justify-center min-w-[24px] px-1 py-0.5 rounded-lg font-black text-[9px] ${isDarkMode ? 'bg-orange-900/30 text-orange-400 ring-1 ring-orange-500/20' : 'bg-orange-50 text-orange-600 ring-1 ring-orange-200'}`}>
                                                                    {s.weekend}
                                                                </span>
                                                            </td>
                                                        </motion.tr>
                                                    ));
                                                })()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className={`flex items-center justify-between p-2 rounded-xl border-2 border-dashed ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                                    <p className="text-[8px] font-bold text-slate-500 italic">
                                        * Realtime calc for {activeDept.name}
                                    </p>
                                    <button
                                        onClick={() => downloadAllowanceExcel(calculateAllowanceStats())}
                                        className="group relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-black text-[9px] tracking-widest uppercase overflow-hidden shadow-lg active:scale-95 transition-all"
                                    >
                                        <FileSpreadsheet size={12} />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Leave Modal */}
            {
                showLeaveModal && (
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
                )
            }

            {/* Department Creation Modal */}
            {

            }

            {/* Admin Dashboard Modal */}
            <AnimatePresence>
                {showAdminDashboard && (
                    <AdminDashboard
                        isDarkMode={isDarkMode}
                        setShowAdminDashboard={setShowAdminDashboard}
                    />
                )}
            </AnimatePresence>

            {/* Animated Drag Preview - Premium & Minimal */}
            <AnimatePresence>
                {draggedEmployee && (
                    <motion.div
                        className="pointer-events-none fixed z-[9999] flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl"
                        style={{
                            x: springX,
                            y: springY,
                            left: 15,
                            top: 15,
                            backgroundColor: `${draggedEmployee.color}30`,
                            borderColor: draggedEmployee.color,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.05 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-sm"
                            style={{ backgroundColor: draggedEmployee.color }}
                        >
                            {draggedEmployee.name[0]}
                        </div>
                        <span className="text-white font-black text-[10px] tracking-tight">{draggedEmployee.name}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dark Mode Glow Effect */}
            <AnimatePresence>
                {isDarkMode && (
                    <motion.div
                        className="pointer-events-none fixed inset-0 z-[9999] mix-blend-screen"
                        style={{
                            x: mouseX,
                            y: mouseY,
                            left: -200,
                            top: -200
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="w-[400px] h-[400px] bg-teal-500/15 rounded-full blur-[120px] shadow-[0_0_120px_rgba(20,184,166,0.15)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Magical Cursor Effect - Only in Dark Mode & Enabled */}
            <MagicCursor isActive={isDarkMode && isMagicEnabled} />

            <div className="flex w-full overflow-hidden relative" style={{ height: '111.111vh' }}>
                {/* Sidebar */}
                <motion.aside
                    initial={{ width: 280 }}
                    animate={{
                        width: isSidebarOpen ? 280 : 0
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                        mass: 0.7
                    }}
                    className={`sidebar ${isDarkMode ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-slate-200'} z-30 flex flex-col h-full overflow-hidden relative ${isSidebarOpen
                        ? `${isDarkMode ? 'shadow-[4px_0_20px_rgba(0,0,0,0.4)]' : 'shadow-[4px_0_20px_rgba(0,0,0,0.08)]'}`
                        : 'shadow-none'
                        } origin-left duration-300`}
                >
                    {/* Close Button Inside Sidebar */}
                    <motion.button
                        onClick={() => setIsSidebarOpen(false)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: isSidebarOpen ? 1 : 0, scale: isSidebarOpen ? 1 : 0.9 }}
                        transition={{ delay: 0.15, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 z-50 ${isDarkMode
                            ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-red-400 hover:scale-110 border border-slate-700/50'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-red-500 hover:scale-110 border border-slate-200'
                            } shadow-lg`}
                        title="Close Sidebar"
                    >
                        <ChevronLeft size={18} />
                    </motion.button>

                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -15 }}
                                transition={{
                                    duration: 0.25,
                                    delay: 0.1,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-none min-w-[240px]"
                            >
                                <div className="p-4 pb-1">
                                    <h1 className={`text-xl font-black tracking-tighter flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                        <img
                                            src={logo}
                                            alt="RotaBase Logo"
                                            className="w-7 h-7 rounded-lg shadow-sm object-cover"
                                        />



                                        <span className="sparkle-text">RotaBase</span><span className="text-teal-600">.</span>
                                    </h1>

                                    {/* Department Switcher */}
                                    <div className="mb-3 space-y-1">
                                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                                        <div className="relative group fancy-card-border rounded-xl">
                                            <select
                                                value={activeDeptId}
                                                onChange={(e) => switchDepartment(e.target.value)}
                                                className={`w-full pl-2 pr-7 py-2 border rounded-xl font-bold text-xs focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" size={14} />
                                        </div>

                                    </div>
                                </div>

                                {/* Sidebar Footer Controls */}
                                <div className={`p-4 border-t space-y-2.5 flex-1 overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200/60 bg-slate-50/50'}`}>
                                    



                                    <button
                                        onClick={() => setShowStatsModal(true)}
                                        className={`w-full px-3 py-2.5 border rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-sm shimmer-btn ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                    >
                                        <BarChart3 size={16} className="text-teal-500" />
                                        View Stats & Fairness
                                    </button>

                                    <button
                                        onClick={shareWithTransport}
                                        className={`w-full px-3 py-2.5 border rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-sm relative overflow-hidden group ${isDarkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200/60 hover:bg-orange-100'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <Send size={16} />
                                        Send to Transport
                                    </button>



                                    <div className="grid grid-cols-1 gap-2">
                                        {/* Start Date Picker - Added for Visibility */}
                                        {perms.canCreate && (
                                            <div className={`px-3 py-2 border rounded-xl flex items-center justify-between transition-all group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200/60 hover:border-teal-200'}`}>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className={isDarkMode ? 'text-teal-400' : 'text-teal-600'} />
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Start Date</span>
                                                </div>
                                                <input 
                                                    type="date" 
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className={`bg-transparent border-none text-xs font-black focus:ring-0 p-0 text-right cursor-pointer w-[110px] ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                                                />
                                            </div>
                                        )}

                                        {perms.canCreate && (
                                            <button
                                                onClick={() => assignRotaAutomatically(null)}
                                                className="w-full px-3 py-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 bg-[length:200%_auto] animate-gradient text-white rounded-xl shadow-[0_4px_14px_rgba(20,184,166,0.4)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.6)] hover:scale-[1.02] transition-all text-xs font-black flex items-center justify-center gap-2 active:scale-95 group relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-[1px]"></div>
                                                <Wand2 size={16} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                                <span className="relative z-10">Generate {activeDept.name} ROTA</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {perms.canEdit && (
                                            <button
                                                onClick={() => setShowLeaveModal(true)}
                                                className={`px-2 py-2 border rounded-xl transition-all font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                            >
                                                <UserX size={12} className="text-red-500" />
                                                Leave
                                            </button>
                                        )}
                                        {perms.canEdit && (
                                            <button
                                                onClick={() => setShowAllowanceModal(true)}
                                                className={`px-2 py-2 border rounded-xl transition-all font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                            >
                                                <Calculator size={12} className="text-blue-500" />
                                                Allowance
                                            </button>
                                        )}
                                    </div>

                                    {perms.canExport && (
                                        <>
                                            <button
                                                onClick={exportToExcel}
                                                className={`w-full px-2 py-2 border rounded-xl transition-all font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                            >
                                                <FileSpreadsheet size={12} className="text-green-600" />
                                                Excel
                                            </button>

                                            <button
                                                onClick={exportToPDF}
                                                className={`w-full px-2 py-2 border rounded-xl transition-all font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'}`}
                                            >
                                                <Download size={12} className="text-slate-500" />
                                                PDF
                                            </button>
                                        </>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        {/* Sync Status Indicator - Premium */}
                                        <div className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-sm border transition-all duration-300 shadow-lg ${isSyncing
                                            ? `${isDarkMode ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30 shadow-teal-500/20' : 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-600 border-teal-200 shadow-teal-200/50'}`
                                            : `${isDarkMode ? 'bg-slate-800/60 text-slate-300 border-slate-700/50 shadow-slate-900/50' : 'bg-gradient-to-r from-slate-50 to-slate-100/80 text-slate-500 border-slate-200/60 shadow-slate-200/50'}`
                                            }`}>
                                            {isSyncing ? (
                                                <>
                                                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-teal-400' : 'bg-teal-500'} animate-pulse shadow-lg ${isDarkMode ? 'shadow-teal-400/50' : 'shadow-teal-500/50'}`}></div>
                                                    <span>Syncing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Globe size={12} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                                                    <span>Saved to Cloud</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-1">
                                        {perms.canEdit && (
                                            <button
                                                onClick={clearSchedule}
                                                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-95 group ${isDarkMode
                                                    ? 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                                    }`}
                                                title="Clear visible schedule (Local only)"
                                            >
                                                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        )}
                                        <button
                                            onClick={undo}
                                            disabled={historyIndex <= 0}
                                            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md active:scale-95 ${isDarkMode
                                                ? historyIndex <= 0
                                                    ? 'bg-slate-800/40 text-slate-600 border border-slate-700/50'
                                                    : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 border border-slate-600/50 hover:from-slate-600 hover:to-slate-700 hover:shadow-lg hover:shadow-slate-700/30 hover:-translate-y-0.5'
                                                : historyIndex <= 0
                                                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                                    : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 border border-slate-300/60 hover:from-slate-300 hover:to-slate-400 hover:shadow-lg hover:shadow-slate-300/50 hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <Redo2 size={16} className={historyIndex <= 0 ? 'opacity-50' : ''} />
                                        </button>
                                        <button
                                            onClick={redo}
                                            disabled={historyIndex >= history.length - 1}
                                            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md active:scale-95 ${isDarkMode
                                                ? historyIndex >= history.length - 1
                                                    ? 'bg-slate-800/40 text-slate-600 border border-slate-700/50'
                                                    : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 border border-slate-600/50 hover:from-slate-600 hover:to-slate-700 hover:shadow-lg hover:shadow-slate-700/30 hover:-translate-y-0.5'
                                                : historyIndex >= history.length - 1
                                                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                                    : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 border border-slate-300/60 hover:from-slate-300 hover:to-slate-400 hover:shadow-lg hover:shadow-slate-300/50 hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <Undo2 size={16} className={historyIndex >= history.length - 1 ? 'opacity-50' : ''} />
                                        </button>
                                    </div>

                                    {/* User Profile & Logout */}
                                    <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>



                                        <div className={`p-2 rounded-2xl border flex items-center justify-between gap-2 shadow-sm ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-inset ring-white/10 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-400'}`}>
                                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className={`text-xs font-black truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{user?.name || 'User'}</div>
                                                    <div className={`text-[9px] font-bold truncate uppercase tracking-wider ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{role}</div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={logout}
                                                title="Sign Out"
                                                className={`p-2 rounded-xl transition-all duration-300 border shadow-md group
                                                ${isDarkMode 
                                                    ? 'bg-gradient-to-br from-orange-900/40 to-amber-900/40 text-orange-400 border-orange-900/50 hover:border-orange-500/50 hover:text-orange-300 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                                                    : 'bg-gradient-to-br from-orange-50 to-amber-50 text-orange-600 border-orange-200 hover:border-orange-300 hover:text-orange-700 hover:shadow-md'}
                                                `}
                                            >
                                                <LogOut size={16} className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5 group-active:scale-90" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.aside>

                {/* Main Content */}
                <main className={`flex-1 relative overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    {/* Header Controls */}
                    <div className={`header-controls backdrop-blur-md border-b px-6 py-2.5 z-20 flex justify-between items-center shadow-sm ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200/60'}`}>
                        <div className="flex items-center gap-4">
                            {/* Hamburger Button (Visible when sidebar closed) - Premium */}
                            <AnimatePresence>
                                {!isSidebarOpen && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                        onClick={() => setIsSidebarOpen(true)}
                                        className={`p-2.5 border rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95 ${isDarkMode
                                            ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-teal-400 hover:border-teal-500/50 hover:shadow-teal-500/10'
                                            : 'bg-white border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-400/50 hover:shadow-teal-400/10'
                                            }`}
                                    >
                                        <ChevronRight size={18} />
                                    </motion.button>
                                )}
                            </AnimatePresence>

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
                                    <Clock size={14} className="text-teal-500" />
                                    Duration
                                </div>
                                <select
                                    value={rotationWeeks}
                                    onChange={(e) => setRotationWeeks(parseInt(e.target.value))}
                                    className={`bg-transparent border-none text-[11px] font-black focus:ring-0 py-0 pr-8 cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-500'}`}
                                >
                                    {[1, 2, 3, 4, 5, 8].map(w => (
                                        <option key={w} value={w}>{w} Week{w > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>







                            {/* Magic Toggle Button */}
                            <button
                                onClick={() => setIsMagicEnabled(!isMagicEnabled)}
                                title={isMagicEnabled ? "Disable Magic Effects" : "Enable Magic Effects"}
                                className={`p-2 rounded-xl border transition-all shadow-sm ${isDarkMode 
                                    ? (isMagicEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-indigo-400') 
                                    : (isMagicEnabled ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600')}`}
                            >
                                <Wand2 size={18} className={isMagicEnabled ? 'animate-pulse' : ''} />
                            </button>

                            {/* Theme Toggle with Auto Mode */}
                            <div className="relative group">
                                <button
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setIsAutoTheme(!isAutoTheme);
                                        showNotification(
                                            `Auto theme ${!isAutoTheme ? 'enabled 🌓' : 'disabled'}`,
                                            'success'
                                        );
                                    }}
                                    title={isAutoTheme ? "Right-click to disable auto-theme" : "Click to toggle | Right-click for auto-theme"}
                                    className={`p-2 rounded-xl border transition-all relative ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 shadow-sm'}`}
                                >
                                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                                    {isAutoTheme && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 flex items-center justify-center"
                                        >
                                            <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                                        </motion.div>
                                    )}
                                </button>
                                {/* Tooltip */}
                                <div className={`absolute right-0 top-full mt-2 px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'} shadow-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    {isAutoTheme ? '🌓 Auto (6PM-6AM)' : '💡 Manual mode'}
                                </div>
                            </div>

                            {/* Zen Mode Button */}
                            <button
                                onClick={toggleZenMode}
                                title={isZenMode ? "Exit Zen Mode (Alt+Z)" : "Enter Zen Mode (Alt+Z)"}
                                className={`p-2 rounded-xl border transition-all shadow-sm active:scale-95 ${isZenMode ? 'bg-teal-500 text-white border-teal-600' : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-teal-400' : 'bg-white border-slate-200 text-slate-400 hover:text-teal-600'}`}
                            >
                                {isZenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>

                            {perms.isAdmin && (
                                <button
                                    onClick={() => setShowAdminDashboard(true)}
                                    title="Admin Dashboard"
                                    className={`p-2 rounded-xl border transition-all shadow-sm active:scale-95 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'}`}
                                >
                                    <ShieldCheck size={18} />
                                </button>
                            )}
                        </div>

                        <div className={`hidden lg:flex items-center shadow-sm border rounded-xl overflow-hidden transition-all hover:shadow-md ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                            {/* Date */}
                            <div className={`px-3 py-1.5 flex flex-col items-center justify-center border-r ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                <span className="text-[8px] font-bold uppercase text-slate-400 leading-none mb-0.5">{now.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                                <span className={`text-xs font-black leading-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{now.getDate()} {now.toLocaleDateString('en-GB', { month: 'short' })}</span>
                            </div>

                            {/* Time */}
                            <div className={`px-4 py-1.5 flex items-center justify-center gap-2 border-r min-w-[90px] ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                <Clock size={12} className="text-teal-500 animate-pulse" />
                                <span className={`text-xs font-black tracking-widest font-mono tabular-nums ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                    {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>

                            {/* Shift */}
                            <div className={`px-4 py-1.5 flex items-center gap-2 ${isDarkMode ? currentShiftStatus.bg.split(' ')[0] : currentShiftStatus.bg.split(' ')[0]} bg-opacity-30`}>
                                <div className={`w-2 h-2 rounded-full animate-ping ${currentShiftStatus.color.replace('text', 'bg')}`}></div>
                                <div className="flex flex-col leading-none">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${currentShiftStatus.color}`}>
                                        {currentShiftStatus.label.split('(')[0]}
                                    </span>
                                    <span className={`text-[8px] font-bold opacity-70 ${currentShiftStatus.color}`}>
                                        {currentShiftStatus.label.split('(')[1].replace(')', '')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div 
                        onScroll={(e) => {
                            const top = e.target.scrollTop;
                            // Extreme hysteresis to kill blinking: 
                            // Hide late (200px), Show early/only-at-top (20px)
                            if (top > 200 && !scrolled) setScrolled(true);
                            if (top < 20 && scrolled) setScrolled(false);
                        }}
                        className="flex-1 overflow-auto p-3 lg:p-4 custom-scrollbar scroll-smooth"
                    >
                        {/* Old Quick Nav Bar Removed */}
                                <div 
                                    className={`relative z-20 mb-4 p-3 rounded-2xl border shadow-xl backdrop-blur-md overflow-hidden ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200/60'}`}
                                >
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
                                                    onMouseEnter={() => setHighlightedEmpId(emp.id)}
                                                    onMouseLeave={() => setHighlightedEmpId(null)}
                                                    className={`group pl-1.5 pr-3 py-1.5 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex items-center gap-2.5 shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-teal-500' : 'bg-white border-slate-200 hover:border-teal-300'}`}
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
                                                    {perms.canDelete && (
                                                    <button
                                                        onClick={() => removeEmployee(emp.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                    )}
                                                </div>
                                            ))}

                                            <div className={`h-10 w-[1px] mx-1 shrink-0 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`}></div>


                                            
                                            {/* Inline Add Member */}
                                            {perms.canAddEmployee && (
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
                                            )}
                                        </div>
                                    </div>
                                </div>

                        {/* Floating Team Circle (Mobile/Scroll FAB) */}
                        <AnimatePresence>
                            {scrolled && (
                                <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
                                    <AnimatePresence mode="wait">
                                        {isFloatingTeamOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className={`mb-2 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl w-[320px] max-h-[400px] overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Roster Team</span>
                                                    <button onClick={() => setIsFloatingTeamOpen(false)}><X size={14} className="text-slate-400" /></button>
                                                </div>
                                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 grid grid-cols-1 gap-2">
                                                    {employees.map(emp => (
                                                        <div
                                                            key={emp.id}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, emp)}
                                                            onDragEnd={handleDragEnd}
                                                            onMouseEnter={() => setHighlightedEmpId(emp.id)}
                                                            onMouseLeave={() => setHighlightedEmpId(null)}
                                                            className={`p-2 rounded-xl border flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all hover:scale-105 active:scale-95 duration-200 holo-card ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-teal-500' : 'bg-slate-50 border-slate-200 hover:border-teal-400'}`}
                                                        >
                                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-[9px]" style={{ backgroundColor: emp.color }}>
                                                                {emp.name[0]}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className={`text-[11px] font-bold leading-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{emp.name}</div>
                                                                <div className={`text-[8px] font-black uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Shift {emp.shift}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    
                                    <motion.button
                                        initial={{ scale: 0, y: 20, opacity: 0 }}
                                        animate={{ scale: 1, y: 0, opacity: 1 }}
                                        exit={{ scale: 0, y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                                        onClick={() => {
                                            setIsFloatingTeamOpen(!isFloatingTeamOpen);
                                            playMicroInteraction('pop');
                                        }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all group relative ${isFloatingTeamOpen ? 'bg-red-500 border-red-400 text-white' : 'bg-teal-600 border-teal-400 text-white hover:scale-110 shadow-teal-500/20'}`}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={isFloatingTeamOpen ? 'close' : 'users'}
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                {isFloatingTeamOpen ? <X size={24} /> : <Users size={24} />}
                                            </motion.div>
                                        </AnimatePresence>
                                        {!isFloatingTeamOpen && (
                                            <span className="absolute -top-1 -right-1 bg-white text-teal-600 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                                                {employees.length}
                                            </span>
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Schedule Table Container */}
                        <div className={`schedule-table rounded-2xl shadow-xl overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                            {/* Navigation Header - Quick Scroll Spy */}
                            <div className={`sticky top-0 z-40 px-4 py-3 border-b backdrop-blur-md flex items-center justify-between ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
                                <div className="flex gap-2 overflow-x-auto pb-1 max-w-[600px] scrollbar-none">
                                    {Array.from({ length: rotationWeeks }).map((_, i) => {
                                        const start = getDateForCell(i, 0);
                                        const end = getDateForCell(i, 6);
                                        const label = `${formatDate(start)} - ${formatDate(end)}`;
                                        
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => document.getElementById(`week-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' })}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest hidden md:block">
                                    {employees.length} employees & {shiftMode} shifts
                                </div>
                            </div>

                            {Array.from({ length: rotationWeeks }, (_, weekIndex) => {
                                const week = weekIndex + 1;
                                return (
                                    <div key={`week-${week}`} id={`week-${week}`} className="scroll-mt-24 mb-8 last:mb-0">
                                            <div className="overflow-x-auto custom-scrollbar relative">
                                                <table className="w-full border-collapse table-fixed">
                                                    <thead>
                                                        <tr className={`text-[10px] uppercase tracking-widest text-white ${isDarkMode ? 'bg-slate-950' : 'bg-slate-800'}`}>
                                                            <th className={`px-3 py-2 text-left font-black border-r w-[65px] ${isDarkMode ? 'border-slate-800' : 'border-slate-700'}`}>
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="opacity-80 text-[9px]">{formatDate(getDateForCell(weekIndex, 0))}</span>
                                                                    {perms.canCreate && (
                                                                        <button
                                                                            onClick={() => assignRotaAutomatically(week)}
                                                                            className={`p-1 rounded-md transition-all ${Object.keys(schedule).some(k => k.startsWith(`${week}-`)) 
                                                                                ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white' 
                                                                                : 'bg-teal-500 text-white hover:bg-teal-400 shadow-teal-500/50 shadow-sm'}`}
                                                                            title={Object.keys(schedule).some(k => k.startsWith(`${week}-`)) ? "Regenerate Week" : "Generate ROTA"}
                                                                        >
                                                                            <Sparkles size={10} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </th>
                                                            {['A', 'B', 'C'].slice(0, shiftMode === '3' ? 3 : 2).map((shift, i) => (
                                                                <th key={shift} className={`px-4 py-3 text-center font-black border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-700'}`}>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : i === 1 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`}></span>
                                                                        Shift {shift}
                                                                    </div>
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {DAYS.map((day, dayIndex) => {
                                                            const date = getDateForCell(weekIndex, dayIndex);
                                                            const isToday = formatDate(date) === formatDate(new Date());

                                                            return (
                                                                <tr key={`${week}-${day}`} className={`border-t group hover:brightness-95 dark:hover:brightness-110 transition-colors duration-100 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-50 hover:bg-slate-50'} ${isToday ? 'bg-teal-50/10' : ''}`}>
                                                                    <td className={`px-3 py-2 border-r ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                                                                        <div className="flex flex-col items-center">
                                                                            <div className={`text-sm font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{date.getDate()}</div>
                                                                            <div className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>{date.toLocaleDateString('en-GB', { month: 'short' })}</div>
                                                                            <div className="text-[9px] font-bold text-slate-400 mt-0.5">{day}</div>
                                                                            {perms.canEdit && (
                                                                            <button onClick={() => toggleHoliday(week, day)} className="mt-2 text-slate-300 hover:text-green-500 transition-colors p-1" title="Mark as holiday"><Palmtree size={12} /></button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    {['A', 'B', 'C'].slice(0, shiftMode === '3' ? 3 : 2).map(shift => {
                                                                        const key = `${week}-${day}-${shift}`;
                                                                        const cell = schedule[key] || { employees: [], status: 'normal', note: '' };
                                                                        const prediction = checkPotentialConflict(draggedEmployee, week, day, shift);
                                                                        const error = scheduleErrors[key];

                                                                        return (
                                                                            <td key={shift} data-cell-key={key} onDrop={(e) => { setDragOverKey(null); handleDrop(e, week, day, shift); }} onDragOver={(e) => handleDragOver(e, key)} onDragLeave={handleDragLeave} className={`schedule-cell px-2 py-1.5 border-r last:border-r-0 cursor-pointer relative group-hover:bg-opacity-50 drag-target-cell transition-all duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} ${dragOverKey === key ? 'drag-over-active' : ''} ${draggedEmployee ? (prediction === 'safe' ? 'bg-emerald-500/20 ring-2 ring-emerald-500/50 glow-predictive-safe shadow-[inset_0_0_30px_rgba(16,185,129,0.2)]' : prediction === 'warning' ? 'bg-amber-500/25 ring-2 ring-amber-500/60 shadow-[inset_0_0_30px_rgba(245,158,11,0.25)]' : prediction === 'error' ? 'bg-red-500/20 opacity-30 grayscale blur-[0.5px]' : prediction === 'existing' ? 'bg-slate-500/10 opacity-50' : '') : (error?.type === 'error' ? 'bg-red-50 ring-1 ring-red-500 ring-inset shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]' : error?.type === 'warning' ? 'bg-amber-50/30 conflict-pulse' : cell.status === 'holiday' ? 'bg-green-50/20' : cell.status === 'leave' ? 'bg-orange-50/20' : isDarkMode ? 'bg-slate-900/50' : 'bg-white')}`}>
                                                                                {draggedEmployee && (
                                                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none overflow-hidden">
                                                                                        {prediction === 'safe' && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center"><CheckCircle2 size={14} className="text-emerald-500 mb-0.5" /><span className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">SAFE</span></motion.div>}
                                                                                        {prediction === 'warning' && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center"><AlertCircle size={14} className="text-amber-500 mb-0.5" /><span className="text-[7px] font-black text-amber-600 uppercase tracking-tighter">REST WARN</span></motion.div>}
                                                                                        {prediction === 'error' && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center opacity-40"><UserX size={14} className="text-red-500 mb-0.5" /><span className="text-[7px] font-black text-red-600 uppercase tracking-tighter">BLOCKED</span></motion.div>}
                                                                                    </div>
                                                                                )}
                                                                                {cell.status === 'holiday' ? (
                                                                                    <div className="flex flex-col items-center justify-center h-full opacity-80"><Palmtree size={16} className="text-green-500 mb-1" /><div className="text-[8px] font-bold uppercase tracking-tighter text-green-600 text-center px-1 leading-tight">{cell.note || 'Holiday'}</div></div>
                                                                                ) : (
                                                                                    <div className="min-h-[40px] flex flex-col justify-center">
                                                                                        <AnimatePresence>
                                                                                            <div className="flex flex-wrap gap-1 mb-1">
                                                                                                {cell.employees.filter(Boolean).map(emp => {
                                                                                                        const liveEmp = employees.find(e => e.id === emp.id) || emp;
                                                                                                        const isHighlighted = highlightedEmpId === liveEmp.id;
                                                                                                        const isDimmed = highlightedEmpId && !isHighlighted;
                                                                                                        
                                                                                                        return (
                                                                                                            <motion.div
                                                                                                                layout transition={{ layout: { type: "spring", damping: 45, stiffness: 350 }, opacity: { duration: 0.2 }, scale: { type: "spring", damping: 30, stiffness: 300 } }}
                                                                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                                                                animate={{ opacity: isDimmed ? 0.4 : 1, scale: isHighlighted ? 1.05 : 1, zIndex: isHighlighted ? 40 : 1 }}
                                                                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                                                                key={`${week}-${day}-${shift}-${liveEmp.id}`}
                                                                                                                onMouseEnter={() => setHighlightedEmpId(liveEmp.id)}
                                                                                                                onMouseLeave={() => setHighlightedEmpId(null)}
                                                                                                                className={`employee-tag group/tag relative px-2 py-0.5 min-h-[26px] h-auto rounded-lg text-[10px] font-black text-white shadow-sm ring-1 ring-black/5 flex items-center cursor-default overflow-hidden origin-left ${isHighlighted ? 'shadow-md ring-2 ring-white/40 brightness-110' : ''}`}
                                                                                                                style={{ backgroundColor: liveEmp.color, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
                                                                                                            >
                                                                                                                <div className="flex flex-col justify-center leading-tight whitespace-nowrap flex-shrink-0">
                                                                                                                    <span className="block">{liveEmp.name}</span>
                                                                                                                    <span className="text-[8px] font-black opacity-90">{day === 'Sun' ? (shift === 'A' ? '7:00am-7:00pm' : '7:00pm-7:00am') : (SHIFTS[shift].label.match(/\((.*?)\)/)?.[1] || '')}</span>
                                                                                                                </div>

                                                                                                                <AnimatePresence>
                                                                                                                    {isHighlighted && (
                                                                                                                        <motion.div
                                                                                                                            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                                                                                                            animate={{ width: 'auto', opacity: 1, marginLeft: 6 }}
                                                                                                                            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                                                                                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                                                                                                            className="flex items-center gap-1 overflow-hidden"
                                                                                                                        >
                                                                                                                            <button onClick={(e) => { e.stopPropagation(); handleSwapMode(week, day, shift, liveEmp); }} className="rounded-full p-0.5 bg-black/20 hover:bg-black/40 text-white flex-shrink-0"><ArrowLeftRight size={10} strokeWidth={3} /></button>
                                                                                                                            <button onClick={(e) => { e.stopPropagation(); removeEmployeeFromCell(week, day, shift, liveEmp.id); }} className="rounded-full p-0.5 bg-black/20 hover:bg-black/40 text-white flex-shrink-0"><X size={10} strokeWidth={3} /></button>
                                                                                                                        </motion.div>
                                                                                                                    )}
                                                                                                                </AnimatePresence>
                                                                                                            </motion.div>
                                                                                                        );
                                                                                                })}
                                                                                            </div>
                                                                                        </AnimatePresence>

                                                                                        {cellSuggestions?.key === key && (
                                                                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`absolute top-full left-0 z-50 w-full min-w-[120px] shadow-2xl border-2 border-teal-500 rounded-xl p-2 mt-1 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                                                                <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-black uppercase text-teal-500 flex items-center gap-1"><Sparkles size={10} /> Best Matches</span><button onClick={(e) => { e.stopPropagation(); setCellSuggestions(null); }} className="text-slate-400 hover:text-slate-600"><X size={12} /></button></div>
                                                                                                <div className="space-y-1.5">{cellSuggestions.list.map(sEmp => (<button key={sEmp.id} onClick={(e) => { e.stopPropagation(); handleDrop(null, week, day, shift, sEmp); setCellSuggestions(null); }} className={`w-full text-left p-1.5 text-[10px] font-bold rounded-lg flex items-center justify-between transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-teal-50 text-slate-700'}`}><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sEmp.color }}></div>{sEmp.name}</div><div className="text-[8px] opacity-60 font-black">LOAD: {sEmp.workload}</div></button>))}</div>
                                                                                            </motion.div>
                                                                                        )}
                                                                                        {error && <div className={`mt-1 flex items-center gap-1 font-black text-[9px] uppercase tracking-tighter ${error.type === 'error' ? 'text-red-600' : 'text-amber-600'}`}><AlertCircle size={10} /> {error.message}</div>}
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
                            })}
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
                            {/* Shift Rotation Rules */}
                            <div className={`text-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200/60 text-slate-600'}`}>
                                <strong className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-teal-50'}`}><Clock size={16} className="text-teal-600" /></div>
                                    Shift Rotation Rules:
                                </strong>
                                <div className="space-y-2 text-[11px] font-medium leading-relaxed">
                                    {activeDept.type === 'MES' ? (
                                        shiftMode === '3' ? (
                                            <>
                                                <p><span className="font-black text-teal-500">MON-THU:</span> 2 persons/shift (A, B, C)</p>
                                                <p><span className="font-black text-teal-500">FRI:</span> 1 per shift works, 3 OFF</p>
                                                <p><span className="font-black text-teal-500">SAT:</span> Swap Fri workers with OFFs</p>
                                                <p><span className="font-black text-teal-500">SUN:</span> 12hr (A: 7am-7pm, B/C: 7pm-7am)</p>
                                            </>
                                        ) : (
                                            <>
                                                <p><span className="font-black text-teal-500">MON-THU:</span> 3 persons/shift (A & B)</p>
                                                <p><span className="font-black text-teal-500">FRI:</span> 2 per shift work, 2 OFF</p>
                                                <p><span className="font-black text-teal-500">SAT:</span> Balanced swap for OFFs</p>
                                            </>
                                        )
                                    ) : (
                                        <p>General department shift rules apply.</p>
                                    )}
                                </div>
                            </div>

                            <div className={`text-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200/60 text-slate-600'}`}>
                                <strong className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-blue-50'}`}><AlertCircle size={16} className="text-blue-600" /></div>
                                    How to Use:
                                </strong>
                                <ul className="space-y-2 ml-2 list-none text-[11px]">
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400 leading-tight">Drag employees from sidebar to assign shifts</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400 leading-tight">Click "Auto Generate" for smart scheduling</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-blue-400 leading-tight">Click Palm Tree to mark holidays</li>
                                </ul>
                            </div>

                            <div className={`text-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200/60 text-slate-600'}`}>
                                <strong className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-purple-50'}`}><CheckCircle2 size={16} className="text-purple-600" /></div>
                                    Features:
                                </strong>
                                <ul className="space-y-2 ml-2 list-none text-[11px]">
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400 leading-tight">Excel & PDF export for sharing</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400 leading-tight">Undo/Redo for correction</li>
                                    <li className="flex items-start gap-2 before:content-['•'] before:text-purple-400 leading-tight">Automatic workload balance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Premium Confirmation Dialog */}
            <AnimatePresence>
                {confirmDialog.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${confirmDialog.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {confirmDialog.title}
                                        </h3>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Action Required</div>
                                    </div>
                                </div>

                                <p className={`text-sm font-medium leading-relaxed mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {confirmDialog.message}
                                </p>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                                        className={`flex-1 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            playMicroInteraction('pop');
                                            confirmDialog.onConfirm();
                                        }}
                                        className={`flex-1 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${confirmDialog.type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/20' : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/20'}`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Menu */}
            <AnimatePresence>
                {showShortcutsMenu && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShortcutsMenu(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white border-slate-200'}`}
                        >
                            {/* Header */}
                            <div className={`sticky top-0 z-10 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                                <div className="p-6 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                                                <Settings2 size={24} />
                                            </div>
                                            <div>
                                                <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    Keyboard Shortcuts
                                                </h2>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                    Power User Commands
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowShortcutsMenu(false)}
                                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shortcuts List */}
                            <div className="p-6 space-y-6">
                                {/* General */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">General</h3>
                                    <div className="space-y-2">
                                        {[
                                            { keys: ['?'], desc: 'Show this shortcuts menu' },
                                            { keys: ['Ctrl', 'K'], desc: 'Toggle shortcuts menu' },
                                            { keys: ['Esc'], desc: 'Close any modal/dialog' },
                                            { keys: ['Ctrl', 'S'], desc: 'Save (Auto-save feedback)' }
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.desc}</span>
                                                <div className="flex items-center gap-1">
                                                    {item.keys.map((key, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <kbd className={`px-2.5 py-1.5 rounded-lg text-xs font-black min-w-[32px] text-center ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'} shadow-sm`}>{key}</kbd>
                                                            {idx < item.keys.length - 1 && <span className="text-slate-500 text-xs font-bold mx-0.5">+</span>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Schedule Actions */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Schedule Actions</h3>
                                    <div className="space-y-2">
                                        {[
                                            { keys: ['Ctrl', 'G'], desc: 'Generate Schedule' },
                                            { keys: ['Ctrl', 'I'], desc: 'Open Stats & Fairness' },
                                            { keys: ['Ctrl', 'Z'], desc: 'Undo last action' },
                                            { keys: ['Ctrl', 'Y'], desc: 'Redo action' }
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.desc}</span>
                                                <div className="flex items-center gap-1">
                                                    {item.keys.map((key, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <kbd className={`px-2.5 py-1.5 rounded-lg text-xs font-black min-w-[32px] text-center ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'} shadow-sm`}>{key}</kbd>
                                                            {idx < item.keys.length - 1 && <span className="text-slate-500 text-xs font-bold mx-0.5">+</span>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* View Controls */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">View Controls</h3>
                                    <div className="space-y-2">
                                        {[
                                            { keys: ['Ctrl', 'D'], desc: 'Toggle Dark/Light mode' },
                                            { keys: ['Ctrl', 'B'], desc: 'Toggle Sidebar' },
                                            { keys: ['Ctrl', 'P'], desc: 'Print schedule' }
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.desc}</span>
                                                <div className="flex items-center gap-1">
                                                    {item.keys.map((key, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <kbd className={`px-2.5 py-1.5 rounded-lg text-xs font-black min-w-[32px] text-center ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'} shadow-sm`}>{key}</kbd>
                                                            {idx < item.keys.length - 1 && <span className="text-slate-500 text-xs font-bold mx-0.5">+</span>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pro Tips */}
                                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-teal-500/5 border-teal-500/20' : 'bg-teal-50 border-teal-200'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600">
                                            <Sparkles size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-black text-teal-600 mb-1">Pro Tips</div>
                                            <ul className={`text-[11px] space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <li>• Shortcuts work everywhere except in text inputs</li>
                                                <li>• Mac users: Use <kbd className="px-1 py-0.5 rounded bg-slate-700 text-white text-[9px]">⌘</kbd> instead of Ctrl</li>
                                                <li>• Press <kbd className="px-1 py-0.5 rounded bg-slate-700 text-white text-[9px]">Esc</kbd> to quickly close any modal</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {showAdminDashboard && (
                    <AdminDashboard 
                        isOpen={showAdminDashboard} 
                        onClose={() => setShowAdminDashboard(false)} 
                        isDarkMode={isDarkMode} 
                    />
                )}
            </AnimatePresence>

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
          aside { display: none; }
          main { padding: 0; }
          button { display: none; }
        }
        .drag-over-active {
            background-color: rgba(20, 184, 166, 0.15) !important;
            box-shadow: inset 0 0 20px rgba(20, 184, 166, 0.2) !important;
            transform: scale(1.01);
            z-index: 10;
        }
        @keyframes predictive-pulse {
            0% { box-shadow: inset 0 0 10px rgba(16, 185, 129, 0.1), 0 0 0px rgba(16, 185, 129, 0); }
            50% { box-shadow: inset 0 0 35px rgba(16, 185, 129, 0.3), 0 0 15px rgba(16, 185, 129, 0.2); }
            100% { box-shadow: inset 0 0 10px rgba(16, 185, 129, 0.1), 0 0 0px rgba(16, 185, 129, 0); }
        }
        .glow-predictive-safe {
            animation: predictive-pulse 1.5s infinite ease-in-out;
            z-index: 5;
        }
      `}</style>
        </div >
    );
}
