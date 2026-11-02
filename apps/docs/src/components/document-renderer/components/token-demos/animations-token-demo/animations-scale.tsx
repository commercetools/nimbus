import {
  Box,
  Button,
  Code,
  Flex,
  IconButton,
  SimpleGrid,
  Stack,
  system,
  Text,
  ToggleButton,
} from "@commercetools/nimbus";
import {
  Check,
  ContentCopy,
  Pause,
  PlayArrow,
} from "@commercetools/nimbus-icons";
import { useState, type ComponentProps, type ReactNode } from "react";
import { CopyButton } from "../copy-button";
import { tokensOf } from "../theme-tokens";
import { TokenPicker } from "../token-picker";
import { TokenTable } from "../token-table";
import { useCopy } from "../use-copy";

type MotionKind =
  "durations" | "easings" | "keyframes" | "animations" | "animationStyles";

type BoxProps = ComponentProps<typeof Box>;

/** The duration and easing of samples that show something else. */
const SAMPLE_DURATION = "1s";
const SAMPLE_EASING = "ease-in-out";

/** The names of the keyframes of the theme, in the order of the theme. */
const keyframeNames = () => Object.keys(system._config.theme?.keyframes ?? {});

/**
 * Keyframes that animate something other than the position, the size or the
 * opacity need a sample with that property.
 */
const KEYFRAME_SAMPLE: Record<string, BoxProps> = {
  "gradient-shimmer": {
    width: "full",
    bgImage:
      "linear-gradient(90deg, {colors.primary.3}, {colors.primary.9}, {colors.primary.3})",
    bgSize: "200% 100%",
  },
  "progress-indeterminate": { width: "1/3" },
  "skeleton-wave": { width: "full" },
};

/** `cubic-bezier(0.42, 0, 1, 1)` as `[0.42, 0, 1, 1]`. */
const parseBezier = (value: string) => {
  const match = value.match(/cubic-bezier\(([^)]+)\)/);
  return match ? match[1].split(",").map(Number) : [0, 0, 1, 1];
};

/** A button that plays the samples of one section. */
const PlayButton = ({
  onPress,
  children = "Play",
}: {
  onPress: () => void;
  children?: ReactNode;
}) => (
  <Button size="xs" variant="outline" onPress={onPress}>
    <PlayArrow />
    {children}
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

/** Durations: a bar that fills its track in the time of the token. */
const Durations = () => {
  const [run, setRun] = useState(0);
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
        rows={tokensOf("durations").map((item) => ({
          id: item.id,
          cells: [
            item.value,
            <Track key={`${item.id}-${run}`}>
              <Box
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

/** One keyframe: a stage that plays it, the name and a copy button. */
const KeyframeTile = ({
  name,
  runAll,
  copied,
  onCopy,
}: {
  name: string;
  runAll: number;
  copied: string | null;
  onCopy: (name: string) => void;
}) => {
  const [run, setRun] = useState(0);
  const played = run + runAll > 0;
  return (
    <Stack
      gap="200"
      border="solid-25"
      borderColor="border"
      borderRadius="200"
      p="300"
    >
      <Flex
        as="button"
        aria-label={`Play ${name}`}
        onClick={() => setRun(run + 1)}
        align="center"
        justify="center"
        height="1600"
        bg="neutral.2"
        borderRadius="100"
        overflow="hidden"
        cursor="button"
        _hover={{ bg: "neutral.3" }}
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "primary.9",
          outlineOffset: "2px",
        }}
      >
        <Box
          key={`${runAll}-${run}`}
          boxSize="800"
          bg="primary.9"
          borderRadius="100"
          animationName={played ? name : undefined}
          animationDuration={SAMPLE_DURATION}
          animationTimingFunction={SAMPLE_EASING}
          {...KEYFRAME_SAMPLE[name]}
        />
      </Flex>
      <Flex justify="space-between" align="center" gap="100">
        <Code variant="subtle">{name}</Code>
        <CopyButton token={name} copied={copied} onCopy={onCopy} />
      </Flex>
    </Stack>
  );
};

/** Keyframes: a grid of tiles. Select a tile to play it, or play all. */
const Keyframes = () => {
  const [runAll, setRunAll] = useState(0);
  const { copied, copy } = useCopy();
  return (
    <>
      <Toolbar>
        <PlayButton onPress={() => setRunAll(runAll + 1)}>Play all</PlayButton>
      </Toolbar>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="300">
        {keyframeNames().map((name) => (
          <KeyframeTile
            key={name}
            name={name}
            runAll={runAll}
            copied={copied}
            onCopy={copy}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

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
        columns={[{ header: "Value", width: "40ch" }, { header: "Sample" }]}
        rows={tokensOf("animations").map((item) => ({
          id: item.id,
          cells: [
            <Text key="value" textStyle="sm" color="neutral.11">
              {item.value}
            </Text>,
            <Flex key="sample" height="1200" align="center" aria-hidden>
              <Box
                boxSize="600"
                bg="primary.9"
                borderRadius="100"
                animation={playing ? item.id : undefined}
              />
            </Flex>,
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

/**
 * Pick a keyframe, a duration and an easing, see them together, and copy the
 * style props. A change of a pick plays the motion again.
 */
export const MotionPlayground = () => {
  const keyframes = keyframeNames();
  const durations = tokensOf("durations").map((item) => item.id);
  const easings = tokensOf("easings").map((item) => item.id);
  const [keyframe, setKeyframe] = useState("fade-in");
  const [duration, setDuration] = useState("moderate");
  const [easing, setEasing] = useState("ease-in-smooth");
  const [run, setRun] = useState(0);
  const { copied, copy } = useCopy();

  const replay = () => setRun((value) => value + 1);
  const pick = (set: (value: string) => void) => (value: string) => {
    set(value);
    replay();
  };

  const code = [
    "<Box",
    `  animationName="${keyframe}"`,
    `  animationDuration="${duration}"`,
    `  animationTimingFunction="${easing}"`,
    "/>",
  ].join("\n");

  const pickers = [
    {
      label: "Keyframes",
      tokens: keyframes,
      value: keyframe,
      onChange: pick(setKeyframe),
    },
    {
      label: "Duration",
      tokens: durations,
      value: duration,
      onChange: pick(setDuration),
    },
    {
      label: "Easing",
      tokens: easings,
      value: easing,
      onChange: pick(setEasing),
    },
  ];

  return (
    <Stack
      gap="500"
      my="600"
      border="solid-25"
      borderColor="border"
      borderRadius="300"
      p="500"
    >
      {pickers.map((picker) => (
        <Stack key={picker.label} gap="200">
          <Text textStyle="sm" fontWeight="600">
            {picker.label}
          </Text>
          <TokenPicker
            label={picker.label}
            tokens={picker.tokens}
            value={picker.value}
            onChange={picker.onChange}
          />
        </Stack>
      ))}

      <Flex gap="400" align="stretch" wrap="wrap">
        <Flex
          flex="1"
          minWidth="4800"
          height="2400"
          align="center"
          justify="center"
          bg="neutral.2"
          borderRadius="200"
          overflow="hidden"
          aria-hidden
        >
          <Box
            key={run}
            boxSize="1200"
            bg="primary.9"
            borderRadius="200"
            animationName={run > 0 ? keyframe : undefined}
            animationDuration={duration}
            animationTimingFunction={easing}
            {...KEYFRAME_SAMPLE[keyframe]}
          />
        </Flex>
        <Stack flex="1" minWidth="4800" gap="200">
          <Flex justify="space-between" align="center">
            <PlayButton onPress={replay} />
            <IconButton
              size="2xs"
              variant="ghost"
              aria-label="Copy code"
              onClick={() => copy(code)}
            >
              {copied === code ? <Check /> : <ContentCopy />}
            </IconButton>
          </Flex>
          <Box
            as="pre"
            flex="1"
            m="0"
            p="300"
            bg="neutral.2"
            borderRadius="200"
            fontFamily="mono"
            textStyle="sm"
            overflowX="auto"
          >
            {code}
          </Box>
        </Stack>
      </Flex>
    </Stack>
  );
};
