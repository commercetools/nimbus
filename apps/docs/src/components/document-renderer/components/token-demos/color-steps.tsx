import { Box, Code, Flex, Table, Text } from "@commercetools/nimbus";

/** A step of a scale: 1 to 12, or the `contrast` step. */
export type StepName = number | "contrast";

/** What each step is for. The palette browser shows it as the tooltip of a step. */
export const STEP_USE: Record<StepName, string> = {
  1: "App background",
  2: "Subtle background",
  3: "UI element background",
  4: "Hovered UI element background",
  5: "Active or selected UI element background",
  6: "Subtle borders and separators",
  7: "UI element border and focus rings",
  8: "Hovered UI element border",
  9: "Solid background",
  10: "Hovered solid background",
  11: "Low-contrast text",
  12: "High-contrast text",
  contrast: "Text on solid backgrounds",
};

type StepInfo = {
  step: StepName;
  /** For a background step: the text steps that go on it, shown as samples. */
  text?: StepName[];
  /** For a text step: the steps it goes on. */
  on?: string;
};

const STEPS: StepInfo[] = [
  { step: 1, text: [11, 12] },
  { step: 2, text: [11, 12] },
  { step: 3, text: [11, 12] },
  { step: 4, text: [11, 12] },
  { step: 5, text: [11, 12] },
  { step: 6 },
  { step: 7 },
  { step: 8 },
  { step: 9, text: ["contrast"] },
  { step: 10, text: ["contrast"] },
  { step: 11, on: "Steps 1–5" },
  { step: 12, on: "Steps 1–5" },
  { step: "contrast", on: "Steps 9 and 10" },
];

const isText = (step: StepName) => step === "contrast" || step >= 11;

/** The step as a tile: a color, or for a text color, text on its background. */
const Tile = ({ palette, step }: { palette: string; step: StepName }) => {
  const token = `${palette}.${step}`;
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent={isText(step) ? "flex-start" : "center"}
      width="1400"
      height="800"
      flexShrink={0}
      borderRadius="100"
      border="1px solid"
      borderColor="neutral.6"
      overflow="hidden"
      bg={
        isText(step)
          ? step === "contrast"
            ? `${palette}.9`
            : `${palette}.2`
          : token
      }
      aria-hidden
    >
      {isText(step) && (
        <>
          <Flex flexGrow="1" alignItems="center">
            <Text textStyle="md" fontWeight="700" color={token}>
              Aa
            </Text>
          </Flex>
          <Box alignSelf="stretch" height="100" bg={token} />
        </>
      )}
    </Flex>
  );
};

/** Text of one step on the background of another, and the text step name. */
const Sample = ({
  palette,
  text,
  on,
}: {
  palette: string;
  text: StepName;
  on: StepName;
}) => (
  <Flex alignItems="center" gap="100">
    <Box
      px="200"
      py="50"
      borderRadius="100"
      border="1px solid"
      borderColor="neutral.6"
      bg={`${palette}.${on}`}
      aria-hidden
    >
      <Text textStyle="sm" fontWeight="600" color={`${palette}.${text}`}>
        Aa
      </Text>
    </Box>
    <Text textStyle="xs" color="neutral.11" fontFamily="mono">
      {text}
    </Text>
  </Flex>
);

/**
 * The steps of a color scale, with what each step is for and the steps it
 * pairs with: the text steps that go on a background, or the backgrounds that
 * a text step goes on. The colors come from one palette, `primary` by default.
 */
export const ColorSteps = ({ palette = "primary" }: { palette?: string }) => (
  // On a narrow screen the table scrolls sideways, not the page.
  <Table.ScrollArea maxWidth="full">
    <Table.Root size="sm" minWidth="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Step</Table.ColumnHeader>
          <Table.ColumnHeader>Use case</Table.ColumnHeader>
          <Table.ColumnHeader>Pairs with</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {STEPS.map(({ step, text, on }) => (
          <Table.Row key={step}>
            <Table.Cell>
              <Flex alignItems="center" gap="300">
                <Tile palette={palette} step={step} />
                <Code variant="subtle">{step}</Code>
              </Flex>
            </Table.Cell>
            <Table.Cell>{STEP_USE[step]}</Table.Cell>
            <Table.Cell>
              {text ? (
                <Flex wrap="wrap" gap="300">
                  {text.map((item) => (
                    <Sample
                      key={item}
                      palette={palette}
                      text={item}
                      on={step}
                    />
                  ))}
                </Flex>
              ) : (
                (on ?? "—")
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Table.ScrollArea>
);
