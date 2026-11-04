import { Box, Code, Flex, Table, Text } from "@commercetools/nimbus";

/** A step of a scale: 1 to 12, or the `contrast` step. */
type StepName = number | "contrast";

type StepInfo = {
  step: StepName;
  /** What the step is for. */
  use: string;
  /** Steps that are text colors, and the steps they are placed on. */
  pairing: { text: StepName; on: StepName }[];
};

const textOn = (text: StepName, steps: StepName[]) =>
  steps.map((on) => ({ text, on }));

const STEPS: StepInfo[] = [
  {
    step: 1,
    use: "App background",
    pairing: [...textOn(11, [1]), ...textOn(12, [1])],
  },
  {
    step: 2,
    use: "Subtle background",
    pairing: [...textOn(11, [2]), ...textOn(12, [2])],
  },
  {
    step: 3,
    use: "UI element background",
    pairing: [...textOn(11, [3]), ...textOn(12, [3])],
  },
  {
    step: 4,
    use: "Hovered UI element background",
    pairing: [...textOn(11, [4]), ...textOn(12, [4])],
  },
  {
    step: 5,
    use: "Active / Selected UI element background",
    pairing: [...textOn(11, [5]), ...textOn(12, [5])],
  },
  { step: 6, use: "Subtle borders and separators", pairing: [] },
  { step: 7, use: "UI element border and focus rings", pairing: [] },
  { step: 8, use: "Hovered UI element border", pairing: [] },
  {
    step: 9,
    use: "Solid backgrounds",
    pairing: textOn("contrast", [9]),
  },
  {
    step: 10,
    use: "Hovered solid backgrounds",
    pairing: textOn("contrast", [10]),
  },
  {
    step: 11,
    use: "Low-contrast text",
    pairing: textOn(11, [1, 2, 3, 4, 5]),
  },
  {
    step: 12,
    use: "High-contrast text",
    pairing: textOn(12, [1, 2, 3, 4, 5]),
  },
  {
    step: "contrast",
    use: "High-contrast text on solid backgrounds",
    pairing: textOn("contrast", [9, 10]),
  },
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

/** Text of one step on the background of another. */
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
      {text === "contrast" ? "contrast" : text} on {on}
    </Text>
  </Flex>
);

/**
 * The steps of a color scale, with what each step is for and which text colors
 * work on it. The colors come from one palette, `primary` by default.
 */
export const ColorSteps = ({ palette = "primary" }: { palette?: string }) => (
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader>Step</Table.ColumnHeader>
        <Table.ColumnHeader>Use case</Table.ColumnHeader>
        <Table.ColumnHeader>WCAG AA text pairing</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {STEPS.map(({ step, use, pairing }) => (
        <Table.Row key={step}>
          <Table.Cell>
            <Flex alignItems="center" gap="300">
              <Tile palette={palette} step={step} />
              <Code variant="subtle">{step}</Code>
            </Flex>
          </Table.Cell>
          <Table.Cell>{use}</Table.Cell>
          <Table.Cell>
            {pairing.length === 0 ? (
              "—"
            ) : (
              <Flex wrap="wrap" gap="300">
                {pairing.map(({ text, on }) => (
                  <Sample
                    key={`${text}-${on}`}
                    palette={palette}
                    text={text}
                    on={on}
                  />
                ))}
              </Flex>
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);
