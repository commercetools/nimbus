import { Box, Button, Flex, Stack } from "@commercetools/nimbus";
import { PlayArrow } from "@commercetools/nimbus-icons";
import { useState, useSyncExternalStore } from "react";
import { tokensOf } from "../theme-tokens";
import { CodeBlock } from "./code-block";
import { GroupedTokenPicker } from "./grouped-token-picker";
import { keyframeGroups } from "./keyframes";
import { MenuSample } from "./motion-samples";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/** True when the system of the reader asks for reduced motion. */
const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

/**
 * Pick keyframes for an element that enters or leaves, a duration and an
 * easing, see them on a menu, and copy the style props. A new pick plays the
 * motion again, except when the reader asks for reduced motion: then only the
 * Play button plays it.
 */
export const MotionPlayground = () => {
  const groups = keyframeGroups().filter(
    (group) => group.id === "enter" || group.id === "leave"
  );
  // Leave out the durations of the animation tokens (`1s` and `2s`): Nimbus
  // uses them only for motion that repeats.
  const animationParts = tokensOf("animations").flatMap((item) =>
    item.value.split(" ")
  );
  const durations = tokensOf("durations")
    .filter((item) => !animationParts.includes(item.value))
    .map((item) => item.id);
  const easings = tokensOf("easings").map((item) => item.id);
  const [keyframe, setKeyframe] = useState("fade-in");
  const [duration, setDuration] = useState("moderate");
  const [easing, setEasing] = useState("ease-in-smooth");
  const [run, setRun] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const play = () => setRun((value) => value + 1);
  const pick = (set: (value: string) => void) => (value: string) => {
    set(value);
    // Without a run the menu stands still, so a new pick does not move it.
    if (reducedMotion) setRun(0);
    else play();
  };

  const code = [
    "<Box",
    `  animationName="${keyframe}"`,
    `  animationDuration="${duration}"`,
    `  animationTimingFunction="${easing}"`,
    "/>",
  ].join("\n");

  return (
    <Stack
      gap="500"
      my="600"
      border="solid-25"
      borderColor="border"
      borderRadius="300"
      p={{ base: "300", sm: "500" }}
    >
      <Box
        position="relative"
        height="6000"
        bg="neutral.2"
        borderRadius="200"
        overflow="hidden"
      >
        <Flex height="full" align="center" justify="center" aria-hidden>
          <MenuSample
            key={run}
            animationName={run > 0 ? keyframe : undefined}
            animationDuration={duration}
            animationTimingFunction={easing}
            // After a leave motion, the menu stays hidden until the next play.
            animationFillMode="both"
          />
        </Flex>
        <Box position="absolute" right="300" bottom="300">
          <Button size="xs" variant="outline" bg="bg" onPress={play}>
            <PlayArrow />
            Play
          </Button>
        </Box>
      </Box>

      <Stack gap="300">
        <GroupedTokenPicker
          label="Keyframes"
          groups={groups.map((group) => ({
            label: group.label,
            tokens: group.names,
          }))}
          value={keyframe}
          onChange={pick(setKeyframe)}
        />
        <GroupedTokenPicker
          groups={[{ label: "Duration", tokens: durations }]}
          value={duration}
          onChange={pick(setDuration)}
        />
        <GroupedTokenPicker
          groups={[{ label: "Easing", tokens: easings }]}
          value={easing}
          onChange={pick(setEasing)}
        />
      </Stack>

      <CodeBlock code={code} />
    </Stack>
  );
};
