/**
 * Hand-authored search metadata for the custom (non-Material) icons.
 *
 * Material icons get their `tags` / `categories` / `popularity` from Google's
 * metadata feed (see apps/docs/scripts/sync-icon-meta.ts). The custom icons
 * aren't in that feed, so their metadata lives here and is merged into the
 * generated artifact. Keyed by export name (as exported from
 * `@commercetools/nimbus-icons`).
 */

export interface IconMeta {
  tags: string[];
  categories: string[];
  popularity?: number;
}

export const customIconsMeta: Record<string, IconMeta> = {
  Figma: {
    tags: ["figma", "design", "logo", "brand", "tool", "prototype"],
    categories: ["brand"],
  },
  Github: {
    tags: [
      "github",
      "git",
      "logo",
      "brand",
      "repository",
      "repo",
      "code",
      "version control",
    ],
    categories: ["brand"],
  },
  CommercetoolsCube: {
    tags: ["commercetools", "cube", "logo", "brand", "ct"],
    categories: ["brand"],
  },
  HighPrecision: {
    tags: [
      "high precision",
      "precision",
      "target",
      "accuracy",
      "exact",
      "fine",
    ],
    categories: ["common actions"],
  },
  CheckCircle: {
    tags: [
      "check",
      "circle",
      "tick",
      "done",
      "complete",
      "success",
      "confirm",
      "ok",
      "approved",
    ],
    categories: ["common actions"],
  },
};
