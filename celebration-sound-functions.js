// ==================== CELEBRATION & SOUND SYSTEM 🎉🔊 ====================

// Enhanced confetti celebrations
const celebrate = (type = 'default') => {
    const celebrations = {
        default: () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        },
        epic: () => {
            const duration = 3 * 1000;
            const end = Date.now() + duration;
            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#14b8a6', '#10b981', '#06b6d4']
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#14b8a6', '#10b981', '#06b6d4']
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        },
        fullCoverage: () => {
            confetti({
                particleCount: 200,
                spread: 180,
                ticks: 100,
                origin: { y: 0.5 },
                colors: ['#10b981', '#14b8a6', '#06b6d4', '#8b5cf6']
            });
        },
        perfectFairness: () => {
            confetti({
                particleCount: 150,
                spread: 120,
                colors: ['#fbbf24', '#f59e0b', '#eab308']
            });
        },
        scheduleGenerated: () => {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 }
            });
        }
    };
    (celebrations[type] || celebrations.default)();
};

// Check milestones and celebrate!
const checkMilestones = () => {
    const stats = calculateStats();
    const totalCells = rotationWeeks * 7 * (shiftMode === '3' ? 3 : 2);
    const filledCells = Object.values(schedule).filter(cell => 
        cell.employees && cell.employees.length > 0
    ).length;
    const coverage = (filledCells / totalCells) * 100;
    
    if (coverage === 100 && !sessionStorage.getItem('fullCoverage_celebrated')) {
        celebrate('fullCoverage');
        showNotification('🎊 100% COVERAGE ACHIEVED! Perfect schedule!', 'success');
        sessionStorage.setItem('fullCoverage_celebrated', 'true');
    }
    if (stats.score >= 95 && !sessionStorage.getItem('perfectFairness_celebrated')) {
        celebrate('perfectFairness');
        showNotification('⭐ PERFECT FAIRNESS! Amazing balance!', 'success');
        sessionStorage.setItem('perfectFairness_celebrated', 'true');
    }
};

// Sound Effects System
const playSound = (soundType) => {
    if (!soundEnabled) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sounds = {
            click: () => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 800;
                gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.1);
            },
            success: () => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(523, audioContext.currentTime);
                osc.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
                osc.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.3);
            },
            error: () => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 200;
                gain.gain.setValueAtTime(0.15, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.2);
            },
            notification: () => {
                const osc1 = audioContext.createOscillator();
                const osc2 = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(audioContext.destination);
                osc1.frequency.value = 600;
                osc2.frequency.value = 800;
                gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                osc1.start(audioContext.currentTime);
                osc2.start(audioContext.currentTime);
                osc1.stop(audioContext.currentTime + 0.2);
                osc2.stop(audioContext.currentTime + 0.2);
            }
        };
        (sounds[soundType] || sounds.click)();
    } catch (e) {
        console.log('Audio not supported');
    }
};
