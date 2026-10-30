import type { FC } from "react";
import { Box } from "@commercetools/nimbus";
import { ComponentIllustration } from "./component-illustration";

/**
 * Tile size and horizontal step between tiles, in `cqh` (percent of the band
 * height), by number of tiles. More tiles are smaller and overlap more, so the
 * group always fits the 16:10 band.
 */
const LAYOUT: Record<number, { size: number; step: number }> = {
  2: { size: 70, step: 54 },
  3: { size: 60, step: 46 },
};

/**
 * Shows one or several illustrations. One illustration is a centered square.
 * Several overlap as a small fan, the middle one on top. The parent must be a
 * size container (`container-type: size`), because tiles use `cqh` and `cqw`.
 */
export const IllustrationCollage: FC<{ names: string[] }> = ({ names }) => {
  if (names.length === 1) {
    return (
      <Box height="full" aspectRatio="1">
        <ComponentIllustration name={names[0]} />
      </Box>
    );
  }

  const count = Math.min(names.length, 3);
  const { size, step } = LAYOUT[count];

  return (
    <Box position="relative" width="full" height="full">
      {names.slice(0, count).map((name, index) => {
        const offset = index - (count - 1) / 2;
        return (
          <Box
            key={name}
            position="absolute"
            top="50%"
            left={`calc(50% + ${offset * step}cqh)`}
            width={`${size}cqh`}
            height={`${size}cqh`}
            borderRadius="300"
            overflow="hidden"
            boxShadow="3"
            zIndex={count - Math.round(Math.abs(offset) * 2)}
            css={{
              // lighter than the band, so overlapping tiles stay apart
              "--illustration-gradient-start":
                "var(--nimbus-colors-color-palette-3)",
              transform: `translate(-50%, calc(-50% + ${Math.abs(offset) * 3}cqh)) rotate(${offset * 4}deg)`,
            }}
          >
            <ComponentIllustration name={name} />
          </Box>
        );
      })}
    </Box>
  );
};
