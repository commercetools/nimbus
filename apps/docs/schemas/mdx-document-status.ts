import { z } from "zod";

export const componentStatusStages = [
  "Experimental",
  "Alpha",
  "Beta",
  "ReleaseCandidate",
  "Stable",
  "Deprecated",
] as const;

export type ComponentStatus = (typeof componentStatusStages)[number];

// Define the Zod schema for component status stages
export const componentStatusSchema = z.enum(componentStatusStages);

type ComponentStatusDescription = {
  [K in ComponentStatus]: {
    label: string;
    description: string;
    order: number;
  };
};

export const componentStatusDescriptions: ComponentStatusDescription = {
  Experimental: {
    label: "Experimental",
    description:
      "Early-stage implementation with minimal testing. No guarantees about API stability. May contain significant bugs or performance issues.",
    order: 1,
  },
  Alpha: {
    label: "Alpha",
    description:
      "Core functionality is implemented with basic testing. API likely to change significantly. Not recommended for production use.",
    order: 2,
  },
  Beta: {
    label: "Beta",
    description:
      "Feature complete with comprehensive test coverage. API largely stabilized, but may still change. Suitable for production use with caution.",
    order: 3,
  },
  ReleaseCandidate: {
    label: "Release Candidate",
    description:
      "Fully implemented and tested with frozen API (except for critical issues). Safe for production use, ready for final validation.",
    order: 4,
  },
  Stable: {
    label: "Stable",
    description:
      "Production-ready with full support. API stable with semantic versioning. Thoroughly tested and optimized.",
    order: 5,
  },
  Deprecated: {
    label: "Deprecated",
    description:
      "No longer recommended for use. Will be removed in a future version. Migration guide provided.",
    order: 6,
  },
};

// Define a schema for the status description object
export const componentStatusDescriptionSchema = z.object({
  label: z.string().nonempty(),
  description: z.string().nonempty(),
  order: z.number().int().positive(),
});

export type StatusDescription = z.infer<
  typeof componentStatusDescriptionSchema
>;

// Complete component status schema with metadata
export const componentStatusWithMetadataSchema = z.object({
  status: componentStatusSchema,
  metadata: componentStatusDescriptionSchema,
});

export type ComponentStatusWithMetadata = z.infer<
  typeof componentStatusWithMetadataSchema
>;
