import {
  Box,
  Button,
  Code,
  Flex,
  Stack,
  system,
  Text,
  ToggleButton,
} from "@commercetools/nimbus";
import { Pause, PlayArrow } from "@commercetools/nimbus-icons";
import { useState, type ReactNode } from "react";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";
import { COMPONENT_OF, describeKeyframes, keyframeGroups } from "./keyframes";
import { RepeatSample } from "./motion-samples";

type MotionKind =
  "durations" | "easings" | "keyframes" | "animations" | "animationStyles";

/** The duration of the easing samples. */
const SAMPLE_DURATION = "1s";

/** `150ms` or `1s` in milliseconds. */
const toMs = (value: string) =>
  value.endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000;

/** `cubic-bezier(0.42, 0, 1, 1)` as `[0.42, 0, 1, 1]`. */
const parseBezier = (value: string) => {
  const match = value.match(/cubic-bezier\(([^)]+)\)/);
  return match ? match[1].split(",").map(Number) : [0, 0, 1, 1];
};

/** A button that plays the samples of one section. */
const PlayButton = ({ onPress }: { onPress: () => void }) => (
  <Button size="xs" variant="outline" onPress={onPress}>
    <PlayArrow />
    Play
  </Button>
);

/** A row above a table, with the play button on the right. */
const Toolbar = ({ children }: { children: ReactNode }) => (
  <Flex justify="flex-end" mb="300">
    {children}
  </Flex>
);

/** A rounded track for the duration and easing samples. */
const Track = ({ children }: { children: ReactNode }) => (
  <Box
    height="400"
    bg="neutral.3"
    borderRadius="full"
    overflow="hidden"
    aria-hidden
  >
    {children}
  </Box>
);

/** The easing as a curve: time from left to right, progress from bottom up. */
const Curve = ({ value }: { value: string }) => {
  const [x1, y1, x2, y2] = parseBezier(value);
  return (
    <Box
      asChild
      boxSize="1200"
      color="primary.9"
      border="solid-25"
      borderColor="border"
      borderRadius="100"
      aria-hidden
    >
      <svg viewBox="-6 -6 112 112">
        <path
          d={`M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`}
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </Box>
  );
};

/**
 * Durations: a bar for each token, on one time scale from 0 to the longest
 * duration. Play fills the bars in real time.
 */
const Durations = () => {
  const [run, setRun] = useState(0);
  const tokens = tokensOf("durations");
  const longest = Math.max(...tokens.map((item) => toMs(item.value)));
  return (
    <>
      <Toolbar>
        <PlayButton onPress={() => setRun(run + 1)} />
      </Toolbar>
      <TokenTable
        columns={[
          { header: "Value", width: "10ch", align: "right" },
          { header: "Sample" },
        ]}
        rows={tokens.map((item) => ({
          id: item.id,
          cells: [
            item.value,
            <Track key={`${item.id}-${run}`}>
              <Box
                width={`${(toMs(item.value) / longest) * 100}%`}
                height="full"
                bg="primary.9"
                borderRadius="full"
                animationName={run > 0 ? "slide-from-left-full" : undefined}
                animationDuration={item.id}
                animationTimingFunction="linear"
                animationFillMode="both"
              />
            </Track>,
          ],
        }))}
      />
    </>
  );
};

/** Easings: the curve, and a dot that crosses its track with the easing. */
const Easings = () => {
  const [run, setRun] = useState(0);
  return (
    <>
      <Toolbar>
        <PlayButton onPress={() => setRun(run + 1)} />
      </Toolbar>
      <TokenTable
        tokenWidth="18ch"
        // Wide enough on a phone that the sample column keeps room for its track.
        minWidth="2xl"
        columns={[
          { header: "Curve", width: "1600" },
          { header: "Value", width: "26ch" },
          { header: "Sample" },
        ]}
        rows={tokensOf("easings").map((item) => ({
          id: item.id,
          cells: [
            <Curve key="curve" value={item.value} />,
            <Text key="value" textStyle="sm" color="neutral.11">
              {item.value}
            </Text>,
            <Track key={`${item.id}-${run}`}>
              {/* The dot sits at the right end of a strip that slides in. */}
              <Flex
                justify="flex-end"
                height="full"
                animationName={run > 0 ? "slide-from-left-full" : undefined}
                animationDuration={SAMPLE_DURATION}
                animationTimingFunction={item.id}
                animationFillMode="both"
              >
                <Box boxSize="400" borderRadius="full" bg="primary.9" />
              </Flex>
            </Track>,
          ],
        }))}
      />
    </>
  );
};

/** What a keyframe changes: one line, or one line for each offset. */
const KeyframeChanges = ({ name }: { name: string }) => (
  <Stack gap="50">
    {describeKeyframes(name).map((line) => (
      <Text key={line.stop ?? "all"} textStyle="sm" color="neutral.11">
        {line.stop && (
          <Text as="span" color="neutral.12" fontWeight="500">
            {line.stop}{" "}
          </Text>
        )}
        {line.text}
      </Text>
    ))}
  </Stack>
);

/**
 * Keyframes: one table for each group (enter, leave, repeat, made for one
 * component), with what each keyframe changes.
 */
const Keyframes = () => (
  <Stack gap="600">
    {keyframeGroups().map((group) => (
      <Stack key={group.id} gap="200">
        <Text textStyle="md" fontWeight="600">
          {group.label}
        </Text>
        <TokenTable
          tokenWidth="6000"
          // Wide enough on a phone that the changes do not wrap on every word.
          minWidth={group.id === "component" ? "2xl" : "xl"}
          columns={
            group.id === "component"
              ? [{ header: "Used by", width: "18ch" }, { header: "Changes" }]
              : [{ header: "Changes" }]
          }
          rows={group.names.map((name) => ({
            id: name,
            cells:
              group.id === "component"
                ? [
                    <Text key="component" textStyle="sm">
                      {COMPONENT_OF[name]}
                    </Text>,
                    <KeyframeChanges key="changes" name={name} />,
                  ]
                : [<KeyframeChanges key="changes" name={name} />],
          }))}
        />
      </Stack>
    ))}
  </Stack>
);

/**
 * Animations: the samples repeat without end, so they only move while the
 * reader turns them on.
 */
const Animations = () => {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <Toolbar>
        <ToggleButton size="xs" isSelected={playing} onChange={setPlaying}>
          {playing ? <Pause /> : <PlayArrow />}
          {playing ? "Pause" : "Play"}
        </ToggleButton>
      </Toolbar>
      <TokenTable
        // Wide enough on a phone that the sample column keeps room.
        minWidth="2xl"
        columns={[{ header: "Value", width: "40ch" }, { header: "Sample" }]}
        rows={tokensOf("animations").map((item) => ({
          id: item.id,
          cells: [
            <Text key="value" textStyle="sm" color="neutral.11">
              {item.value}
            </Text>,
            <RepeatSample
              key="sample"
              token={item.id}
              animation={playing ? item.id : undefined}
            />,
          ],
        }))}
      />
    </>
  );
};

/**
 * What an animation style does: its keyframes, or the keyframes for each
 * placement of the element.
 */
const describeAnimationStyle = (value: Record<string, unknown>): ReactNode => {
  if (typeof value.animationName === "string") {
    return <Code variant="subtle">{value.animationName}</Code>;
  }
  const placements = Object.entries(value).flatMap(([key, style]) => {
    const placement = key.match(/data-placement\^=(\w+)/)?.[1];
    const name = (style as { animationName?: string })?.animationName;
    return placement && name ? [{ placement, name }] : [];
  });
  return (
    <Stack gap="100">
      {placements.map(({ placement, name }) => (
        <Text key={placement} textStyle="sm">
          <Text as="span" color="neutral.11">
            {placement}:{" "}
          </Text>
          <Code variant="subtle">{name}</Code>
        </Text>
      ))}
    </Stack>
  );
};

/** Animation styles: the keyframes that each style combines. */
const AnimationStyles = () => {
  const styles = (system._config.theme?.animationStyles ?? {}) as Record<
    string,
    { value: Record<string, unknown> }
  >;
  return (
    <TokenTable
      tokenWidth="18ch"
      columns={[{ header: "Keyframes" }]}
      rows={Object.entries(styles).map(([id, style]) => ({
        id,
        cells: [describeAnimationStyle(style.value)],
      }))}
    />
  );
};

const KINDS: Record<MotionKind, () => ReactNode> = {
  durations: Durations,
  easings: Easings,
  keyframes: Keyframes,
  animations: Animations,
  animationStyles: AnimationStyles,
};

interface AnimationsScaleProps {
  /** Which motion tokens to show. */
  kind: MotionKind;
}

/**
 * The motion tokens of one kind, with samples that play when the reader asks
 * for it, and a copy button for each token.
 */
export const AnimationsScale = ({ kind }: AnimationsScaleProps) => {
  const Kind = KINDS[kind];
  return (
    <Box my="600">
      <Kind />
    </Box>
  );
};
