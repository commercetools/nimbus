import { Box, Flex, Stack, Text } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import type { ColorScaleMode } from "@/atoms/color-scale-mode";
import { themeColorScalesAtom } from "@/atoms/theme-color-scales.ts";
import { STEP_USE, type StepName } from "./color-steps.tsx";
import { useCopy } from "./use-copy";

/**
 * The steps of a scale, grouped by role. `from` and `to` are 1-based grid
 * columns, so every step has the same width in every group.
 */
const GROUPS = [
  { label: "Backgrounds", from: 1, to: 6 },
  { label: "Borders", from: 6, to: 9 },
  { label: "Solid", from: 9, to: 11 },
  { label: "Text", from: 11, to: 13 },
  { label: "On solid", from: 13, to: 14 },
] as const;

const NUMBERED_STEPS = Array.from({ length: 12 }, (_, i) => i + 1);

type ColorScaleProps = {
  /** Name of the palette, for example `primary`. */
  id: string;
  /** The color mode to draw the palette in. */
  mode: ColorScaleMode;
};

type StepProps = {
  id: string;
  step: StepName;
  hasContrast: boolean;
  copied: boolean;
  onCopy: (token: string) => void;
};

/** Text samples that show which text steps pair with a background step. */
const Samples = ({
  id,
  step,
  hasContrast,
}: Pick<StepProps, "id" | "step" | "hasContrast">) => {
  if (typeof step === "number" && step <= 5) {
    return (
      <Flex gap="150" textStyle="sm" fontWeight="600" aria-hidden>
        <Text color={`${id}.11`}>Aa</Text>
        <Text color={`${id}.12`}>Aa</Text>
      </Flex>
    );
  }
  if ((step === 9 || step === 10) && hasContrast) {
    return (
      <Text
        textStyle="sm"
        fontWeight="600"
        color={`${id}.contrast`}
        aria-hidden
      >
        Aa
      </Text>
    );
  }
  return null;
};

const Step = ({ id, step, hasContrast, copied, onCopy }: StepProps) => {
  const token = `${id}.${step}`;
  // Text steps and `contrast` are text colors. They show as text on the
  // background they pair with: steps 11 and 12 on step 2, `contrast` on step 9.
  const isTextStep = step === "contrast" || step >= 11;
  const pairedBackground = step === "contrast" ? `${id}.9` : `${id}.2`;

  return (
    <Stack gap="100" minWidth="0">
      <Box
        as="button"
        onClick={() => onCopy(token)}
        aria-label={`Copy token ${token}`}
        title={`${token}: ${STEP_USE[step]}`}
        cursor="pointer"
        display="flex"
        flexDirection="column"
        justifyContent={isTextStep ? "flex-start" : "center"}
        alignItems="center"
        height="1600"
        overflow="hidden"
        borderRadius="100"
        border="1px solid"
        borderColor="neutral.6"
        bg={isTextStep ? pairedBackground : token}
        transition="transform 0.1s"
        _hover={{ transform: "translateY(-2px)" }}
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "primary.9",
          outlineOffset: "2px",
        }}
      >
        {isTextStep ? (
          <>
            <Box flexGrow="1" display="flex" alignItems="center">
              <Text textStyle="lg" fontWeight="700" color={token} aria-hidden>
                Aa
              </Text>
            </Box>
            <Box alignSelf="stretch" height="200" bg={token} />
          </>
        ) : (
          <Samples id={id} step={step} hasContrast={hasContrast} />
        )}
      </Box>
      <Text
        textStyle="xs"
        fontFamily="mono"
        color="neutral.11"
        textAlign="center"
        // `contrast` is the longest label: keep it on one line in a narrow column
        whiteSpace="nowrap"
        fontSize={step === "contrast" ? "10px" : undefined}
        aria-live="polite"
      >
        {copied ? "copied" : step}
      </Text>
    </Stack>
  );
};

/**
 * A palette drawn as one strip in one color mode: steps grouped by role, text
 * samples that show the recommended pairings, and a click on a step copies its
 * token name.
 */
export const ColorScale = ({ id, mode }: ColorScaleProps) => {
  const themeColorScales = useAtomValue(themeColorScalesAtom);
  const hasContrast = Boolean(themeColorScales?.get(`${id}.contrast`));
  const { copied, copy } = useCopy();

  // `contrast` is the thirteenth step, when the palette has one.
  const steps: StepName[] = hasContrast
    ? [...NUMBERED_STEPS, "contrast"]
    : NUMBERED_STEPS;
  const columns = `repeat(${steps.length}, minmax(0, 1fr))`;
  const groups = GROUPS.filter((group) => group.from <= steps.length);

  return (
    // `light` and `dark` force the color mode for everything inside. The text
    // uses a palette step: `fg` keeps the value of the mode of the site.
    <Box
      className={mode}
      bg="bg"
      color="neutral.12"
      border="1px solid"
      borderColor="neutral.6"
      borderRadius="200"
      p="300"
      // On a narrow screen the scale scrolls sideways, so that labels and
      // samples are not cut off.
      overflowX="auto"
    >
      {/* 13 steps of at least 45px, so that two text samples fit in a step. */}
      <Box minWidth="640px">
        <Box
          display="grid"
          gridTemplateColumns={columns}
          columnGap="100"
          mb="100"
        >
          {groups.map((group) => (
            <Box
              key={group.label}
              gridColumn={`${group.from} / ${group.to}`}
              borderTop="2px solid"
              borderColor="neutral.6"
              pt="100"
            >
              <Text textStyle="xs" color="neutral.11" truncate>
                {group.label}
              </Text>
            </Box>
          ))}
        </Box>
        <Box display="grid" gridTemplateColumns={columns} columnGap="100">
          {steps.map((step) => (
            <Step
              key={step}
              id={id}
              step={step}
              hasContrast={hasContrast}
              copied={copied === `${id}.${step}`}
              onCopy={copy}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
