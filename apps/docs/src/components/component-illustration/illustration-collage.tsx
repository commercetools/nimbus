import type { FC } from "react";
import { Box } from "@commercetools/nimbus";
import { ComponentIllustration } from "./component-illustration";

/**
 * Tile size and horizontal step between the two tiles, in `cqh` (percent of
 * the band height), so the pair fits the 16:10 band.
 */
const SIZE = 66;
const STEP = 62;

/**
 * Shows one or two illustrations. One is a centered square. Two overlap as a
 * small pair, tilted away from each other. The parent must be a size container
 * (`container-type: size`), because tiles use `cqh` and `cqw`.
 */
export const IllustrationCollage: FC<{ names: string[] }> = ({ names }) => {
  if (names.length === 1) {
    return (
      <Box height="full" aspectRatio="1">
        <ComponentIllustration name={names[0]} />
      </Box>
    );
  }

  const count = Math.min(names.length, 2);

  return (
    <Box position="relative" width="full" height="full">
      {names.slice(0, count).map((name, index) => {
        const offset = index - (count - 1) / 2;
        return (
          <Box
            key={name}
            position="absolute"
            top="50%"
            left={`calc(50% + ${offset * STEP}cqh)`}
            width={`${SIZE}cqh`}
            height={`${SIZE}cqh`}
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
