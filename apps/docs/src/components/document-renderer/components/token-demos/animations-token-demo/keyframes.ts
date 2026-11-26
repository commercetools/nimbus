import { system } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";

type Declarations = Record<string, string | number>;

export type KeyframeGroupId = "enter" | "leave" | "repeat" | "component";

export interface KeyframeGroup {
  id: KeyframeGroupId | "other";
  label: string;
  names: string[];
}

/** The keyframes of the theme, by name. */
export const themeKeyframes = () =>
  (system._config.theme?.keyframes ?? {}) as Record<
    string,
    Record<string, Declarations>
  >;

/** Keyframes that one component uses, and the name of that component. */
export const COMPONENT_OF: Record<string, string> = {
  "activity-bounce": "ActivityIndicator",
  "progress-indeterminate": "ProgressBar",
  "gradient-shimmer": "ProgressBar",
  "skeleton-wave": "Skeleton",
};

const SIDES = ["top", "bottom", "left", "right"];

/**
 * The order inside a group: fade, scale, slide by 0.5rem, slide by the own
 * size, and the sides in the order top, bottom, left, right. So the enter and
 * the leave groups list their keyframes in the same order.
 */
const sortKey = (name: string) => {
  const kind = name.startsWith("fade")
    ? 0
    : name.startsWith("scale")
      ? 1
      : name.endsWith("-full")
        ? 3
        : 2;
  const side = SIDES.findIndex((item) => name.includes(`-${item}`));
  return kind * 10 + side;
};

const groupOf = (name: string): KeyframeGroup["id"] => {
  if (COMPONENT_OF[name]) return "component";
  if (name.endsWith("-in") || name.startsWith("slide-from-")) return "enter";
  if (name.endsWith("-out") || name.startsWith("slide-to-")) return "leave";
  // The keyframes that the animation tokens play.
  const repeated = tokensOf("animations").map(
    (item) => item.value.split(" ")[0]
  );
  if (repeated.includes(name)) return "repeat";
  return "other";
};

const LABELS: Record<KeyframeGroup["id"], string> = {
  enter: "Enter",
  leave: "Leave",
  repeat: "Repeat",
  component: "Made for one component",
  other: "Other",
};

/**
 * The keyframes of the theme in groups: for an element that enters, for one
 * that leaves, for a motion that repeats, and for one component. A keyframe
 * that fits no group goes to "Other", so that no keyframe is lost.
 */
export const keyframeGroups = (): KeyframeGroup[] => {
  const names = Object.keys(themeKeyframes());
  return (Object.keys(LABELS) as KeyframeGroup["id"][])
    .map((id) => ({
      id,
      label: LABELS[id],
      names: names
        .filter((name) => groupOf(name) === id)
        .sort((a, b) =>
          id === "enter" || id === "leave" ? sortKey(a) - sortKey(b) : 0
        ),
    }))
    .filter((group) => group.names.length > 0);
};

const STOPS: Record<string, string> = { from: "0%", to: "100%" };

const kebab = (key: string) =>
  key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const declarations = (values: Declarations) =>
  Object.entries(values)
    .map(([key, value]) => `${kebab(key)}: ${value}`)
    .join("; ");

export interface KeyframeStop {
  /** The offset, such as `50%`. Empty for a change from start to end. */
  stop?: string;
  text: string;
}

/**
 * What a keyframe changes, as CSS. A change of one property from the start to
 * the end is one line, such as `opacity: 0 → 1`. Other keyframes have one line
 * for each offset.
 */
export const describeKeyframes = (name: string): KeyframeStop[] => {
  const stops = Object.entries(themeKeyframes()[name] ?? {}).map(
    ([stop, values]) => ({ stop: STOPS[stop] ?? stop, values })
  );
  const [first, last] = stops;
  if (stops.length === 2 && first.stop === "0%" && last.stop === "100%") {
    const keys = Object.keys(first.values);
    const sameProperty =
      keys.length === 1 &&
      Object.keys(last.values).length === 1 &&
      keys[0] in last.values;
    return [
      {
        text: sameProperty
          ? `${kebab(keys[0])}: ${first.values[keys[0]]} → ${last.values[keys[0]]}`
          : `${declarations(first.values)} → ${declarations(last.values)}`,
      },
    ];
  }
  return stops.map(({ stop, values }) => ({
    stop,
    text: declarations(values),
  }));
};
