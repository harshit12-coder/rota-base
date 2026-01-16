import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SecurityMascot({ isPasswordFocused }) {
    const [look, setLook] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isPasswordFocused) return;

            const { innerWidth, innerHeight } = window;
            // Limit movement range for cute, subtle tracking
            const x = (e.clientX - innerWidth / 2) / (innerWidth / 2) * 8; 
            const y = (e.clientY - innerHeight / 2) / (innerHeight / 2) * 5; 
            setLook({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isPasswordFocused]);

    return (
        <div 
            className="w-32 h-28 relative mx-auto mb-4 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-xl overflow-visible">
                <defs>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" /> {/* Pure White */}
                        <stop offset="100%" stopColor="#e2e8f0" /> {/* Slate-200 */}
                    </linearGradient>
                    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* BODY: A soft, rounded marshmallow shape */}
                <motion.path 
                    d="M 20 80 Q 15 50 20 30 Q 30 10 60 10 Q 90 10 100 30 Q 105 50 100 80 Q 90 95 60 95 Q 30 95 20 80" 
                    fill="url(#bodyGradient)" 
                    stroke="#cbd5e1" 
                    strokeWidth="2"
                    animate={{ 
                        y: isPasswordFocused ? 5 : (isHovered ? [0, -3, 0] : 0), 
                        scale: isPasswordFocused ? 0.98 : (isHovered ? 1.02 : 1),
                        rotate: isHovered && !isPasswordFocused ? [0, -2, 2, 0] : 0
                    }}
                    transition={{ 
                        type: 'spring', 
                        bounce: 0.5,
                        y: { repeat: isHovered ? Infinity : 0, duration: 2 },
                        rotate: { repeat: isHovered ? Infinity : 0, duration: 0.5 }
                    }}
                />

                {/* EYES CONTAINER */}
                <g>
                    {/* Left Eye */}
                    <motion.circle 
                        cx="45" cy="45" r="8" fill="#1e293b" 
                        animate={{ scaleY: isHovered && !isPasswordFocused ? [1, 0.2, 1] : 1 }} // Blink effect
                        transition={{ repeat: isHovered ? Infinity : 0, repeatDelay: 2, duration: 0.2 }}
                    />
                    <motion.circle 
                        r="3" fill="white"
                        animate={{ 
                            cx: 45 + (isPasswordFocused ? 0 : look.x), 
                            cy: 45 + (isPasswordFocused ? 0 : look.y),
                            opacity: (isHovered && !isPasswordFocused) ? 0 : 1 // Hide pupil when blinking
                        }}
                        transition={{ duration: 0.1 }}
                    />

                    {/* Right Eye */}
                    <motion.circle 
                        cx="75" cy="45" r="8" fill="#1e293b" 
                        animate={{ scaleY: isHovered && !isPasswordFocused ? [1, 0.2, 1] : 1 }} // Blink effect
                        transition={{ repeat: isHovered ? Infinity : 0, repeatDelay: 2, duration: 0.2 }}
                    />
                    <motion.circle 
                        r="3" fill="white"
                        animate={{ 
                            cx: 75 + (isPasswordFocused ? 0 : look.x), 
                            cy: 45 + (isPasswordFocused ? 0 : look.y),
                            opacity: (isHovered && !isPasswordFocused) ? 0 : 1 // Hide pupil when blinking
                        }}
                        transition={{ duration: 0.1 }}
                    />
                </g>

                {/* CHEEKS (Blush) */}
                <motion.ellipse 
                    cx="35" cy="60" rx="5" ry="3" fill="#fda4af" opacity="0.6" 
                    animate={{ 
                        opacity: isPasswordFocused || isHovered ? 0.8 : 0.6, 
                        scale: isPasswordFocused || isHovered ? 1.2 : 1 
                    }} 
                />
                <motion.ellipse 
                    cx="85" cy="60" rx="5" ry="3" fill="#fda4af" opacity="0.6" 
                    animate={{ 
                        opacity: isPasswordFocused || isHovered ? 0.8 : 0.6, 
                        scale: isPasswordFocused || isHovered ? 1.2 : 1 
                    }} 
                />

                {/* MOUTH (Small smile) */}
                <motion.path 
                    d="M 55 60 Q 60 63 65 60" 
                    fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" opacity="0.8" 
                    animate={{ d: isHovered ? "M 55 60 Q 60 70 65 60" : "M 55 60 Q 60 63 65 60" }} // Smile bigger on hover
                />

                {/* HANDS - The main "Cute" interaction */}
                {/* Left Hand */}
                <motion.circle 
                    r="12" 
                    fill="#f1f5f9" // Slate-100
                    stroke="#94a3b8" 
                    strokeWidth="2"
                    initial={{ cx: 20, cy: 80 }}
                    animate={{ 
                        cx: isPasswordFocused ? 45 : 20, // Move to cover eye
                        cy: isPasswordFocused ? 45 : (isHovered ? 75 : 80) // Slight raise on hover
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 14 }}
                />
                
                {/* Right Hand */}
                <motion.circle 
                    r="12" 
                    fill="#f1f5f9" 
                    stroke="#94a3b8" 
                    strokeWidth="2"
                    initial={{ cx: 100, cy: 80 }}
                    animate={{ 
                        cx: isPasswordFocused ? 75 : 100, // Move to cover eye
                        cy: isPasswordFocused ? 45 : (isHovered ? 75 : 80) // Slight raise on hover
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 14 }}
                />

                {/* SHY EFFECT lines (Only appear when hiding) */}
                <motion.g animate={{ opacity: isPasswordFocused ? 1 : 0 }}>
                    <path d="M 110 30 L 115 25" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 112 35 L 118 32" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                </motion.g>



            </svg>
        </div>
    );
}
