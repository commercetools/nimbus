import {
  flatten,
  num,
  unionBox,
  type Box,
  type FragmentList,
  type Size,
} from "./fragment";
import { createPrimitives, type Kit } from "./primitives";
import { BACKGROUND, SHADOW_FLOOD } from "./roles";
import { SHADOW } from "./tokens";

export const CANVAS = 96;

export type IllustrationDefinition = {
  /** The component folder name, which is also the id prefix: `il-<name>-`. */
  name: string;
  draw: (kit: Kit) => FragmentList;
};

/** Declares an illustration. Draw it with the kit primitives passed in. */
export const defineIllustration = (
  definition: IllustrationDefinition
): IllustrationDefinition => definition;

export type Measurement = {
  /** Bounds of all shapes except the cursor. */
  box: Box | null;
  /** Sizes of all panels and bubbles. */
  panels: readonly Size[];
};

const build = (definition: IllustrationDefinition) => {
  const prefix = `il-${definition.name}`;
  const fragments = flatten(definition.draw(createPrimitives(prefix)));
  return { prefix, fragments };
};

/** Renders an illustration to SVG markup. The output is deterministic. */
export const renderIllustration = (
  definition: IllustrationDefinition
): string => {
  const { prefix, fragments } = build(definition);
  const body = fragments.map((fragment) => `  ${fragment.markup}`).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">
  <defs>
    <linearGradient id="${prefix}-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BACKGROUND.start}"/>
      <stop offset="1" stop-color="${BACKGROUND.end}"/>
    </linearGradient>
    <filter id="${prefix}-shadow" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="${num(SHADOW.dy)}" stdDeviation="${num(SHADOW.blur)}" flood-color="${SHADOW_FLOOD}"/>
    </filter>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="url(#${prefix}-bg)"/>
${body}
</svg>
`;
};

/** Shape bounds and panel sizes, for the geometry checks. */
export const measureIllustration = (
  definition: IllustrationDefinition
): Measurement => {
  const { fragments } = build(definition);
  return {
    box: unionBox(fragments.map((fragment) => fragment.box)),
    panels: fragments.flatMap((fragment) => fragment.panels),
  };
};
