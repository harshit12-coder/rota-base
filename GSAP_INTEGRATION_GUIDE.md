# 🎨 GSAP Animation Integration Guide for RotaBase

## Overview

This guide shows you how to seamlessly integrate GSAP animations into your RotaBase project. GSAP is already installed in your `package.json`, and I've created a comprehensive animation utilities library.

---

## 📁 File Structure

```
src/
├── utils/
│   └── gsapAnimations.js  ← Animation utilities (✅ Created)
├── ROTAScheduler.jsx       ← Your main component
└── index.css              ← Global styles
```

---

## 🚀 Quick Start Integration

### 1. Import GSAP Utilities in ROTAScheduler.jsx

Add this at the top of your `ROTAScheduler.jsx` file (around line 9):

```javascript
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
  animateChartBars,
} from "./utils/gsapAnimations";
```

---

## 🎬 Implementation Examples

### A. Page Load Animations

Add this `useEffect` after your existing hooks (around line 600):

```javascript
// GSAP: Animate UI on initial load
useEffect(() => {
  if (isInitialLoaded) {
    // Animate sidebar
    animateSidebarIn(".sidebar");

    // Animate header controls
    animateHeaderControls(".header-controls");

    // Animate schedule grid with cascade effect
    setTimeout(() => {
      animateScheduleGridIn(".schedule-table");
    }, 300);
  }
}, [isInitialLoaded]);
```

### B. Employee Tag Hover Effects

Add this `useEffect` to create hover effects for employee tags:

```javascript
// GSAP: Employee tag hover effects
useEffect(() => {
  const employeeTags = document.querySelectorAll(".employee-tag");
  const cleanupFns = [];

  employeeTags.forEach((tag) => {
    const cleanup = createEmployeeTagHover(tag);
    if (cleanup) cleanupFns.push(cleanup);
  });

  // Cleanup on unmount
  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}, [schedule, employees]);
```

### C. Enhanced Drag & Drop Animations

Replace your existing drag event handlers with GSAP-enhanced versions:

**In your `onDragStart` handler:**

```javascript
const handleDragStart = (e, emp) => {
  setDraggedEmployee(emp);
  playMicroInteraction("lift");

  // GSAP: Smooth drag start animation
  const dragElement = e.currentTarget;
  animateDragStart(dragElement);
};
```

**In your `onDrop` handler:**

```javascript
const handleDrop = (week, day, shift) => {
  if (!draggedEmployee) return;

  // ... your existing drop logic ...

  // GSAP: Smooth cell drop animation
  const cellKey = `${week}-${day}-${shift}`;
  const cellElement = document.querySelector(`[data-cell-key="${cellKey}"]`);
  if (cellElement) {
    animateCellDrop(cellElement);
  }

  playMicroInteraction("pop");
  setDraggedEmployee(null);
};
```

**In your `onDragEnd` handler:**

```javascript
const handleDragEnd = (e) => {
  // GSAP: Return to normal state
  const dragElement = e.currentTarget;
  animateDragEnd(dragElement);

  setDraggedEmployee(null);
};
```

### D. Modal Animations

Replace modal open/close with GSAP transitions:

**For Stats Modal:**

```javascript
// When opening modal
const openStatsModal = () => {
  setShowStatsModal(true);
  // Wait for React to render, then animate
  requestAnimationFrame(() => {
    animateModalIn(".stats-modal", ".modal-backdrop");
  });
};

// When closing modal
const closeStatsModal = () => {
  animateModalOut(".stats-modal", ".modal-backdrop", () => {
    setShowStatsModal(false);
  });
};
```

### E. Notification Toast Animations

Update your `showNotification` function:

```javascript
const showNotification = (message, type = "success") => {
  const notif = { message, type };
  setNotification(notif);

  // GSAP: Animate notification in
  requestAnimationFrame(() => {
    const notifElement = document.querySelector(".notification-toast");
    if (notifElement) {
      animateNotificationIn(notifElement);
    }
  });

  setTimeout(() => {
    const notifElement = document.querySelector(".notification-toast");
    if (notifElement) {
      animateNotificationOut(notifElement, () => {
        setNotification(null);
      });
    }
  }, 3000);
};
```

### F. Auto-Schedule Generation Animation

In your schedule generation function:

```javascript
const autoSchedule = () => {
  // ... your existing logic ...

  playMicroInteraction("magic");
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // GSAP: Animate newly filled cells
  const cellKeys = Object.keys(newSchedule);
  requestAnimationFrame(() => {
    animateScheduleGeneration(cellKeys, newSchedule);
  });

  showNotification("Schedule generated!", "success");
};
```

### G. Stats Counter Animation

In your stats modal rendering:

```javascript
useEffect(() => {
  if (showStatsModal) {
    const stats = calculateStats();

    // Animate counters
    stats.details.forEach((stat, index) => {
      const counterElement = document.querySelector(`#stat-counter-${stat.id}`);
      if (counterElement) {
        animateCounter(counterElement, stat.total, 1);
      }
    });

    // Animate chart bars
    setTimeout(() => {
      animateChartBars(".stat-bar");
    }, 200);
  }
}, [showStatsModal]);
```

### H. Magnetic Hover for Important Buttons

For your "Generate Schedule" or "Outlook" buttons:

```javascript
useEffect(() => {
  const generateBtn = document.querySelector(".generate-schedule-btn");
  const cleanupMagnetic = createMagneticHover(generateBtn, 0.2);

  return cleanupMagnetic;
}, []);
```

---

## 🎯 CSS Classes to Add

Add these classes to your components for GSAP targeting:

```jsx
// In your JSX:

// Sidebar
<div className="sidebar" data-animated>
  {/* ... */}
</div>

// Header Controls
<div className="header-controls" data-animated>
  {/* ... */}
</div>

// Schedule Table
<div className="schedule-table" data-animated>
  {/* ... */}
</div>

// Employee Tags
<div className="employee-tag" data-animated>
  {employee.name}
</div>

// Schedule Cells
<div
  className="schedule-cell"
  data-cell-key={`${week}-${day}-${shift}`}
  data-animated
>
  {/* ... */}
</div>

// Modals
<div className="modal-backdrop" data-animated>
  <div className="stats-modal" data-animated>
    {/* ... */}
  </div>
</div>

// Notifications
<div className="notification-toast" data-animated>
  {notification.message}
</div>
```

---

## 🎨 Advanced Animations (Optional)

### 1. **Scroll-Triggered Animations**

For lazy-loaded content or long schedules:

```javascript
import { createScrollFadeIn } from "./utils/gsapAnimations";

useEffect(() => {
  createScrollFadeIn(".schedule-week");
}, [rotationWeeks]);
```

### 2. **Department Switcher Transition**

```javascript
const switchDepartment = (id) => {
  // Fade out current content
  gsap.to(".schedule-table", {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      // Switch department
      setActiveDeptId(id);

      // Fade in new content
      gsap.fromTo(
        ".schedule-table",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 }
      );
    },
  });
};
```

### 3. **Theme Toggle Animation**

```javascript
const toggleTheme = () => {
  const newMode = !isDarkMode;

  // Smooth color transition
  gsap.to("body", {
    backgroundColor: newMode ? "#1a1a1a" : "#ffffff",
    color: newMode ? "#ffffff" : "#000000",
    duration: 0.4,
    ease: "power2.out",
  });

  setIsDarkMode(newMode);
};
```

---

## ⚡ Performance Tips

1. **Use `will-change` CSS property** for animated elements:

```css
.employee-tag,
.schedule-cell,
.modal-backdrop {
  will-change: transform, opacity;
}
```

2. **Cleanup animations on unmount**:

```javascript
useEffect(() => {
  return () => {
    gsap.killTweensOf(".employee-tag");
  };
}, []);
```

3. **Use `requestAnimationFrame`** before triggering animations after state updates.

4. **Reduce motion for accessibility**:

```javascript
import { setGlobalAnimationSpeed } from "./utils/gsapAnimations";

// Detect user preference
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
if (prefersReducedMotion) {
  setGlobalAnimationSpeed(0.5); // Half speed
}
```

---

## 🎬 Animation Timeline

Here's the recommended sequence of animations on page load:

```
0ms   → Sidebar slides in
200ms → Header controls fade in (staggered)
500ms → Schedule grid cascades in
800ms → All animations complete
```

---

## 🔄 Migration Checklist

- [ ] Import GSAP utilities
- [ ] Add page load animations
- [ ] Enhanced drag & drop
- [ ] Modal transitions
- [ ] Notification toasts
- [ ] Employee tag hovers
- [ ] Button press effects
- [ ] Stats counter animations
- [ ] Schedule generation cascade
- [ ] Add CSS classes for targeting
- [ ] Test on different browsers
- [ ] Test with reduced motion preference

---

## 📚 GSAP Resources

- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Easing Visualizer](https://greensock.com/ease-visualizer/)

---

## 🐛 Troubleshooting

**Animations not working?**

1. Check browser console for errors
2. Ensure GSAP is installed: `npm install gsap`
3. Verify element selectors are correct
4. Add `data-animated` attributes to elements

**Animations too fast/slow?**

- Adjust duration in `gsapAnimations.js`
- Use `setGlobalAnimationSpeed()` to control globally

**Memory leaks?**

- Always return cleanup functions in `useEffect`
- Kill tweens on component unmount

---

## 🎉 Next Steps

1. Start with page load animations
2. Add employee tag hovers
3. Enhance drag & drop
4. Polish modals and notifications
5. Add advanced effects based on user feedback

Happy animating! 🚀
