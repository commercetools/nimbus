/**
 * Lifecycle state definitions for components and features
 */
export const lifecycleStates = [
  "Experimental",
  "Alpha",
  "Beta",
  "Stable",
  "Deprecated",
  "EOL",
] as const;

export type LifecycleState = (typeof lifecycleStates)[number];

type LifecycleStateDescription = {
  [K in LifecycleState]: {
    label: string;
    description: string;
    order: number;
    colorPalette: string;
  };
};

export const lifecycleStateDescriptions: LifecycleStateDescription = {
  Experimental: {
    label: "Experimental",
    description:
      "Highly unstable, may be removed entirely without notice. Not for production use.",
    order: 1,
    colorPalette: "red",
  },
  Alpha: {
    label: "Alpha",
    description:
      "Still highly unstable with known bugs. Not for production use.",
    order: 2,
    colorPalette: "orange",
  },
  Beta: {
    label: "Beta",
    description:
      "More stable but subject to breaking changes. Use with caution in non-critical production.",
    order: 3,
    colorPalette: "amber",
  },
  Stable: {
    label: "Stable",
    description:
      "Production-ready, thoroughly tested, and actively maintained.",
    order: 4,
    colorPalette: "grass",
  },
  Deprecated: {
    label: "Deprecated",
    description:
      "Not for new development. Will be removed in a future version.",
    order: 5,
    colorPalette: "neutral",
  },
  EOL: {
    label: "End-of-Life",
    description:
      "No longer available. Element has been removed from the library.",
    order: 6,
    colorPalette: "blackAlpha",
  },
};
