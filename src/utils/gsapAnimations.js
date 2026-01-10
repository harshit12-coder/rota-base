import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Animation Utilities for RotaBase
 * Premium, high-performance animations that blend effortlessly with the UI
 */

// ==================== Core Animation Configs ====================
export const ANIMATION_DEFAULTS = {
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.05
};

export const SPRING_CONFIG = {
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)'
};

export const SMOOTH_CONFIG = {
    duration: 0.4,
    ease: 'power2.out'
};

// ==================== Page Load Animations ====================

/**
 * Animate schedule grid on initial load
 * Creates a cascading effect from top-left to bottom-right
 */
export const animateScheduleGridIn = (gridSelector = '.schedule-table') => {
    const cells = document.querySelectorAll(`${gridSelector} .schedule-cell`);
    
    gsap.fromTo(cells, 
        {
            opacity: 0,
            scale: 0.8,
            rotationX: -15,
            y: 20
        },
        {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.2)',
            stagger: {
                amount: 0.8,
                grid: 'auto',
                from: 'start'
            }
        }
    );
};

/**
 * Sidebar slide-in animation with spring physics
 */
export const animateSidebarIn = (sidebarSelector = '.sidebar') => {
    gsap.fromTo(sidebarSelector,
        {
            x: -300,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.6)',
            clearProps: 'all'
        }
    );
};

/**
 * Header controls fade-in with stagger
 */
export const animateHeaderControls = (headerSelector = '.header-controls') => {
    const controls = document.querySelectorAll(`${headerSelector} > *`);
    
    gsap.fromTo(controls,
        {
            opacity: 0,
            y: -20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.1
        }
    );
};

// ==================== Interaction Animations ====================

/**
 * Employee tag hover animation
 * Creates a magnetic lift effect with glow
 */
export const createEmployeeTagHover = (tagElement) => {
    if (!tagElement) return;

    const onEnter = () => {
        gsap.to(tagElement, {
            scale: 1.08,
            y: -3,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    const onLeave = () => {
        gsap.to(tagElement, {
            scale: 1,
            y: 0,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    tagElement.addEventListener('mouseenter', onEnter);
    tagElement.addEventListener('mouseleave', onLeave);

    // Return cleanup function
    return () => {
        tagElement.removeEventListener('mouseenter', onEnter);
        tagElement.removeEventListener('mouseleave', onLeave);
    };
};

/**
 * Button press animation
 * Satisfying micro-interaction for all clickable elements
 */
export const createButtonPress = (buttonElement) => {
    if (!buttonElement) return;

    const onPress = () => {
        gsap.to(buttonElement, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    };

    buttonElement.addEventListener('mousedown', onPress);

    return () => {
        buttonElement.removeEventListener('mousedown', onPress);
    };
};

/**
 * Drag and drop physics animation
 * Adds smooth inertia when dragging employees
 */
export const animateDragStart = (element) => {
    gsap.to(element, {
        scale: 1.1,
        opacity: 0.8,
        rotate: 5,
        duration: 0.2,
        ease: 'power2.out'
    });
};

export const animateDragEnd = (element) => {
    gsap.to(element, {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
    });
};

/**
 * Cell drop animation with bounce
 */
export const animateCellDrop = (cellElement) => {
    gsap.fromTo(cellElement,
        {
            scale: 1.05,
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
            scale: 1,
            backgroundColor: 'transparent',
            duration: 0.4,
            ease: 'back.out(2)'
        }
    );
};

// ==================== Modal Animations ====================

/**
 * Modal entrance animation
 * Smooth scale-up with backdrop fade
 */
export const animateModalIn = (modalSelector, backdropSelector) => {
    const tl = gsap.timeline();
    
    tl.fromTo(backdropSelector,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    )
    .fromTo(modalSelector,
        {
            scale: 0.9,
            opacity: 0,
            y: 30
        },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.5)'
        },
        '-=0.2'
    );

    return tl;
};

/**
 * Modal exit animation
 */
export const animateModalOut = (modalSelector, backdropSelector, onComplete) => {
    const tl = gsap.timeline({ onComplete });
    
    tl.to(modalSelector,
        {
            scale: 0.95,
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.in'
        }
    )
    .to(backdropSelector,
        { opacity: 0, duration: 0.2 },
        '-=0.1'
    );

    return tl;
};

// ==================== Notification Animations ====================

/**
 * Toast notification with bounce
 */
export const animateNotificationIn = (notificationElement) => {
    gsap.fromTo(notificationElement,
        {
            x: 400,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.6)'
        }
    );
};

export const animateNotificationOut = (notificationElement, onComplete) => {
    gsap.to(notificationElement, {
        x: 400,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete
    });
};

// ==================== Schedule Generation Animations ====================

/**
 * Auto-schedule generation with cascading reveal
 */
export const animateScheduleGeneration = (cellKeys, schedule) => {
    const cells = cellKeys.map(key => document.querySelector(`[data-cell-key="${key}"]`)).filter(Boolean);
    
    gsap.fromTo(cells,
        {
            scale: 0.5,
            opacity: 0,
            backgroundColor: 'rgba(16, 185, 129, 0.2)'
        },
        {
            scale: 1,
            opacity: 1,
            backgroundColor: 'transparent',
            duration: 0.5,
            ease: 'back.out(1.5)',
            stagger: {
                amount: 1.2,
                from: 'start'
            }
        }
    );
};

/**
 * Schedule clear animation
 */
export const animateScheduleClear = (cellSelector = '.schedule-cell', onComplete) => {
    const cells = document.querySelectorAll(cellSelector);
    
    gsap.to(cells, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.in(1.5)',
        stagger: {
            amount: 0.6,
            from: 'end'
        },
        onComplete
    });
};

// ==================== Stats & Charts ====================

/**
 * Animated counter for stats
 */
export const animateCounter = (element, endValue, duration = 1) => {
    const obj = { value: 0 };
    
    gsap.to(obj, {
        value: endValue,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            element.textContent = Math.round(obj.value);
        }
    });
};

/**
 * Progress bar fill animation
 */
export const animateProgressBar = (barElement, percentage) => {
    gsap.to(barElement, {
        width: `${percentage}%`,
        duration: 1,
        ease: 'power3.out'
    });
};

/**
 * Chart bar growth animation
 */
export const animateChartBars = (barSelector) => {
    const bars = document.querySelectorAll(barSelector);
    
    gsap.fromTo(bars,
        {
            scaleY: 0,
            transformOrigin: 'bottom'
        },
        {
            scaleY: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
            stagger: 0.1
        }
    );
};

// ==================== Scroll Animations ====================

/**
 * Parallax effect for backgrounds
 */
export const createParallaxEffect = (elementSelector, speed = 0.5) => {
    gsap.to(elementSelector, {
        y: () => window.scrollY * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });
};

/**
 * Fade in elements on scroll
 */
export const createScrollFadeIn = (elementSelector) => {
    gsap.utils.toArray(elementSelector).forEach(element => {
        gsap.fromTo(element,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
};

// ==================== Advanced Effects ====================

/**
 * Magnetic hover effect for important buttons
 */
export const createMagneticHover = (buttonElement, strength = 0.3) => {
    if (!buttonElement) return;

    const onMove = (e) => {
        const rect = buttonElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        gsap.to(buttonElement, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    const onLeave = () => {
        gsap.to(buttonElement, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    };

    buttonElement.addEventListener('mousemove', onMove);
    buttonElement.addEventListener('mouseleave', onLeave);

    return () => {
        buttonElement.removeEventListener('mousemove', onMove);
        buttonElement.removeEventListener('mouseleave', onLeave);
    };
};

/**
 * Glitch effect for special actions
 */
export const createGlitchEffect = (element) => {
    const tl = gsap.timeline({ repeat: 3, repeatDelay: 0.1 });
    
    tl.to(element, {
        x: -2,
        duration: 0.05
    })
    .to(element, {
        x: 2,
        duration: 0.05
    })
    .to(element, {
        x: 0,
        duration: 0.05
    });

    return tl;
};

/**
 * Confetti celebration trigger
 */
export const triggerCelebration = () => {
    // This works with your existing canvas-confetti
    const elements = document.querySelectorAll('.celebration-trigger');
    
    gsap.to(elements, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut'
    });
};

// ==================== Utility Functions ====================

/**
 * Kill all GSAP animations and ScrollTriggers
 */
export const killAllAnimations = () => {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Pause/Resume all animations
 */
export const pauseAllAnimations = () => {
    gsap.globalTimeline.pause();
};

export const resumeAllAnimations = () => {
    gsap.globalTimeline.resume();
};

/**
 * Set global animation speed (for accessibility)
 */
export const setGlobalAnimationSpeed = (speed = 1) => {
    gsap.globalTimeline.timeScale(speed);
};

// ==================== React Hook Helpers ====================

/**
 * Custom hook for cleanup
 * Use this in useEffect to ensure animations are properly cleaned up
 */
export const cleanupGSAP = (targets) => {
    return () => {
        gsap.killTweensOf(targets);
    };
};

export default {
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
    animateScheduleClear,
    animateCounter,
    animateProgressBar,
    animateChartBars,
    createParallaxEffect,
    createScrollFadeIn,
    createMagneticHover,
    createGlitchEffect,
    triggerCelebration,
    killAllAnimations,
    pauseAllAnimations,
    resumeAllAnimations,
    setGlobalAnimationSpeed,
    cleanupGSAP
};
