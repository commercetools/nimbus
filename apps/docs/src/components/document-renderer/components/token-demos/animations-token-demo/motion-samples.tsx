import { Box, Flex, Stack } from "@commercetools/nimbus";
import {
  ArrowDownward,
  Autorenew,
  Notifications,
} from "@commercetools/nimbus-icons";
import type { ComponentProps, ReactNode } from "react";

type BoxProps = ComponentProps<typeof Box>;

const MENU_ITEMS = ["Edit", "Duplicate", "Delete"];

/**
 * A menu, with the look of the Nimbus Menu, as a sample of an element that
 * enters and leaves. The motion props go to the menu.
 */
export const MenuSample = (props: BoxProps) => (
  <Box
    bg="bg"
    color="fg"
    borderRadius="200"
    boxShadow="5"
    p="200"
    width="4800"
    {...props}
  >
    {MENU_ITEMS.map((item, index) => (
      <Box
        key={item}
        px="300"
        py="200"
        borderRadius="200"
        textStyle="sm"
        bg={index === 0 ? "neutral.3" : undefined}
      >
        {item}
      </Box>
    ))}
  </Box>
);

/**
 * Samples for the animation tokens, each in a place where the motion is
 * common: a refresh icon that spins, a new notification that pings, a
 * placeholder that pulses while content loads, and an arrow that bounces to
 * point down. `animation` is the token, or undefined to stand still.
 */
export const REPEAT_SAMPLE: Record<
  string,
  (animation: string | undefined) => ReactNode
> = {
  spin: (animation) => (
    <Box asChild boxSize="600" color="neutral.11" animation={animation}>
      <Autorenew />
    </Box>
  ),
  ping: (animation) => (
    <Box position="relative" color="neutral.11">
      <Box asChild boxSize="600">
        <Notifications />
      </Box>
      <Box position="absolute" top="0" right="0" boxSize="200">
        <Box
          position="absolute"
          inset="0"
          borderRadius="full"
          bg="critical.9"
          animation={animation}
        />
        <Box
          position="relative"
          boxSize="200"
          borderRadius="full"
          bg="critical.9"
        />
      </Box>
    </Box>
  ),
  pulse: (animation) => (
    <Stack gap="150" width="4000" animation={animation}>
      <Box height="200" bg="neutral.5" borderRadius="full" />
      <Box height="200" width="2/3" bg="neutral.5" borderRadius="full" />
    </Stack>
  ),
  bounce: (animation) => (
    <Box asChild boxSize="600" color="neutral.11" animation={animation}>
      <ArrowDownward />
    </Box>
  ),
};

/** The sample of an animation token, or a plain dot for an unknown token. */
export const RepeatSample = ({
  token,
  animation,
}: {
  token: string;
  animation: string | undefined;
}) => (
  <Flex height="1200" align="center" aria-hidden>
    {REPEAT_SAMPLE[token]?.(animation) ?? (
      <Box
        boxSize="600"
        bg="primary.9"
        borderRadius="100"
        animation={animation}
      />
    )}
  </Flex>
);
