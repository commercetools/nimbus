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
    from: {
      scale: "0.95",
    },
    to: {
      scale: "1",
    },
  },
  "scale-out": {
    from: {
      scale: "1",
    },
    to: {
      scale: "0.95",
    },
  },
  "progress-indeterminate": {
    "0%": {
      transform: "translateX(-100%)",
    },
    "100%": {
      transform: "translateX(300%)",
    },
  },
  "gradient-shimmer": {
    "0%": {
      backgroundPosition: "200% 0",
    },
    "100%": {
      backgroundPosition: "-200% 0",
    },
  },
};
