import { useState, type FC } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  type BoxProps,
} from "@commercetools/nimbus";
import { ChevronLeft, ChevronRight } from "@commercetools/nimbus-icons";
import { Illustration } from "./illustration";

export type IllustrationCarouselProps = Omit<BoxProps, "children"> & {
  /** Names of the illustrations, one slide each, in order. */
  names: string[];
  /** Accessible name of the carousel. */
  label?: string;
};

/**
 * Shows several illustrations one at a time, with previous and next buttons
 * and the position ("3 of 15"). It does not change by itself, so there is
 * nothing to pause. Previous on the first slide goes to the last one, and next
 * on the last slide goes to the first one. The slide area is 150px high, like
 * a single header illustration; the buttons sit below it.
 */
export const IllustrationCarousel: FC<IllustrationCarouselProps> = ({
  names,
  label = "Illustrations",
  ...boxProps
}) => {
  const [index, setIndex] = useState(0);
  const count = names.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <Box
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      {...boxProps}
    >
      <Box position="relative" width="full" height="150px">
        {names.map((name, i) => (
          <Box
            key={name}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            position="absolute"
            inset="0"
            opacity={i === index ? 1 : 0}
            // A slide that is not shown is out of the tab order and hidden from
            // assistive technology.
            inert={i !== index}
            css={{
              transition: "opacity 0.3s ease-in-out",
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            }}
          >
            <Illustration name={name} />
          </Box>
        ))}
      </Box>
      <Flex alignItems="center" justifyContent="space-between" mt="200">
        <IconButton
          aria-label="Previous illustration"
          size="xs"
          variant="ghost"
          onPress={() => go(-1)}
        >
          <ChevronLeft />
        </IconButton>
        <Text
          textStyle="sm"
          color="neutral.11"
          aria-live="polite"
          css={{ fontVariantNumeric: "tabular-nums" }}
        >
          {index + 1} of {count}
        </Text>
        <IconButton
          aria-label="Next illustration"
          size="xs"
          variant="ghost"
          onPress={() => go(1)}
        >
          <ChevronRight />
        </IconButton>
      </Flex>
    </Box>
  );
};
