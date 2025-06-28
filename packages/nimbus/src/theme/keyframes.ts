export const keyframes = {
  spin: {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  pulse: {
    "50%": {
      opacity: "0.5",
    },
  },
  ping: {
    "75%, 100%": {
      transform: "scale(2)",
      opacity: "0",
    },
  },
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
    },
    "50%": {
      transform: "none",
      animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
    },
  },

  "fade-in": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  "fade-out": {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },
  "slide-from-left-full": {
    from: {
      translate: "-100% 0",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-from-right-full": {
    from: {
      translate: "100% 0",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-from-top-full": {
    from: {
      translate: "0 -100%",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-from-bottom-full": {
    from: {
      translate: "0 100%",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-to-left-full": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "-100% 0",
    },
  },
  "slide-to-right-full": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "100% 0",
    },
  },
  "slide-to-top-full": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "0 -100%",
    },
  },
  "slide-to-bottom-full": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "0 100%",
    },
  },
  "slide-from-top": {
    "0%": {
      translate: "0 -0.5rem",
    },
    to: {
      translate: "0",
    },
  },
  "slide-from-bottom": {
    "0%": {
      translate: "0 0.5rem",
    },
    to: {
      translate: "0",
    },
  },
  "slide-from-left": {
    "0%": {
      translate: "-0.5rem 0",
    },
    to: {
      translate: "0",
    },
  },
  "slide-from-right": {
    "0%": {
      translate: "0.5rem 0",
    },
    to: {
      translate: "0",
    },
  },
  "slide-to-top": {
    "0%": {
      translate: "0",
    },
    to: {
      translate: "0 -0.5rem",
    },
  },
  "slide-to-bottom": {
    "0%": {
      translate: "0",
    },
    to: {
      translate: "0 0.5rem",
    },
  },
  "slide-to-left": {
    "0%": {
      translate: "0",
    },
    to: {
      translate: "-0.5rem 0",
    },
  },
  "slide-to-right": {
    "0%": {
      translate: "0",
    },
    to: {
      translate: "0.5rem 0",
    },
  },
  "scale-in": {
    "0%": {
      opacity: 0,
      transform: "scale(0.95)",
    },
    to: {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  "scale-out": {
    from: {
      opacity: 1,
      transform: "scale(1)",
    },
    to: {
      opacity: 0,
      transform: "scale(0.95)",
    },
  },

  // Focus ring animations for subtle attention-drawing effects
  "focus-ring-appear": {
    "0%": {
      outlineColor: "transparent",
      outlineWidth: "16px",
      outlineOffset: "0px",
    },
    "100%": {
      outlineColor: "var(--focus-ring-color)",
      outlineWidth: "var(--focus-ring-width)",
      outlineOffset: "var(--focus-ring-offset)",
    },
  },

  // Menu-specific animations for enhanced UX
  slideInAndFade: {
    "0%": {
      opacity: 0,
      transform: "translateY(-8px) scale(0.96)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
    },
  },
  slideOutAndFade: {
    "0%": {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
    },
    "100%": {
      opacity: 0,
      transform: "translateY(-8px) scale(0.96)",
    },
  },
};
