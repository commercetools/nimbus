import type { StoryObj } from "@storybook/react-vite";
import {
  ResponsiveContainer,
  chartRegistry,
  resolveByName,
  type ChartRegistryEntry,
  type Intent,
} from "..";
import { fixtureFor } from "./fixtures";

/** First registered preset for a base component, e.g. "LineChart". */
function firstEntryFor(base: string): ChartRegistryEntry | undefined {
  for (const entry of chartRegistry.values()) {
    if (entry.metadata.baseComponent === base) return entry;
  }
  return undefined;
}

/**
 * Renders one representative preset for a registry-backed chart through the
 * selection engine — the same path the retired gallery used.
 *
 * The per-component `*.stories.tsx` files build a *literal* CSF meta (Storybook's
 * static indexer requires the default export to be an object literal) whose
 * `render` delegates here. These "base" stories are smoke tests: one per
 * component, they prove Storybook and the browser-mode Vitest project are wired
 * up for every chart. Focused, hand-authored stories come later.
 */
export function RegistryPreview({ base }: { base: string }) {
  const entry = firstEntryFor(base);
  if (!entry) {
    return <div>No registered preset for “{base}”.</div>;
  }
  const fx = fixtureFor(entry);
  const intent: Intent = entry.metadata.intents[0]?.intent ?? "TREND";
  return (
    <ResponsiveContainer height={320}>
      {(width, height) =>
        resolveByName(
          entry.metadata.name,
          { intent, data: fx.data, options: fx.options },
          { width, height }
        ).render({ width, height })
      }
    </ResponsiveContainer>
  );
}

export type BaseStory = StoryObj;
