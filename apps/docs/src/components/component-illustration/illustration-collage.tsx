import type { FC } from "react";
import { Box } from "@commercetools/nimbus";
import { ComponentIllustration } from "./component-illustration";

/** Tile size (`cqh`, percent of the band height) when the tiles are spread. */
const SIZE = 66;
/** Widest the spread may be, so the tiles fit the 16:10 band (160cqh). */
const SPREAD = 150;
const MAX_STEP = 62;
const TRANSITION_PROPS = [
  "left",
  "width",
  "height",
  "transform",
  "opacity",
  "background-color",
  "box-shadow",
];
const TRANSITION = TRANSITION_PROPS.map((prop) => `${prop} 320ms ease`).join(
  ", "
);

/**
 * Shows one illustration, or a stack that spreads out on hover. At rest only
 * the first one is visible, centered and as large as a single illustration.
 * While the surrounding link is hovered or focused, the others appear and all
 * tiles move apart into a small, tilted row.
 *
 * One variable, `--reveal` (0 or 1), drives every property, so the transition
 * is plain CSS. The parent must be a size container (`container-type: size`),
 * because tiles use `cqh`.
 */
export const IllustrationCollage: FC<{ names: string[] }> = ({ names }) => {
  if (names.length === 1) {
    return (
      <Box height="full" aspectRatio="1">
        <ComponentIllustration name={names[0]} />
      </Box>
    );
  }

  const count = names.length;
  const step = Math.min(MAX_STEP, (SPREAD - SIZE) / (count - 1));

  return (
    <Box
      position="relative"
      width="full"
      height="full"
      css={{
        "--reveal": 0,
        "a:hover &, a:focus-visible &": { "--reveal": 1 },
      }}
    >
      {names.map((name, index) => {
        const offset = index - (count - 1) / 2;
        const size = `calc(100cqh - var(--reveal) * ${100 - SIZE}cqh)`;
        const visible = `calc(var(--reveal) * 100%)`;
        return (
          <Box
            key={name}
            position="absolute"
            top="50%"
            left={`calc(50% + var(--reveal) * ${offset * step}cqh)`}
            width={size}
            height={size}
            borderRadius="300"
            overflow="hidden"
            zIndex={count - Math.round(Math.abs(offset) * 2)}
            css={{
              // the tile draws its own background, so it can fade in
              "--illustration-gradient-start": "transparent",
              backgroundColor: `color-mix(in srgb, light-dark(var(--nimbus-colors-color-palette-1), var(--nimbus-colors-color-palette-3)) ${visible}, transparent)`,
              boxShadow: `0 2px 6px color-mix(in srgb, rgb(0 0 0 / 0.16) ${visible}, transparent)`,
              opacity: index === 0 ? 1 : "var(--reveal)",
              transform: `translate(-50%, calc(-50% + var(--reveal) * ${Math.abs(offset) * 3}cqh)) rotate(calc(var(--reveal) * ${offset * 4}deg))`,
              transition: TRANSITION,
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          >
            <ComponentIllustration name={name} />
          </Box>
        );
      })}
    </Box>
  );
};
