import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Meter,
  type MeterProps,
  type MeterSegment,
  ProgressBar,
  Separator,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@commercetools/nimbus";

const meta: Meta<typeof Meter> = {
  title: "Playground/Meter",
  component: Meter,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Same exception as the main Meter stories: axe reads React
            // Aria's role="meter progressbar" as one invalid role and then
            // reports the aria-value* attributes. Skip only the meter element.
            id: "aria-allowed-attr",
            selector: ':not([role~="meter"])',
          },
        ],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Meter>;

const sizes = ["sm", "md", "lg"] as const;
const layouts = ["minimal", "inline", "stacked"] as const;
const statePalettes = ["primary", "positive", "warning", "critical"] as const;

const storage: MeterSegment[] = [
  { id: "images", label: "Images", value: 30 },
  { id: "videos", label: "Videos", value: 20 },
  { id: "documents", label: "Documents", value: 12 },
];

const manySegments: MeterSegment[] = [
  { id: "a", label: "Apparel", value: 18 },
  { id: "b", label: "Shoes", value: 14 },
  { id: "c", label: "Accessories", value: 11 },
  { id: "d", label: "Home", value: 9 },
  { id: "e", label: "Beauty", value: 7 },
  { id: "f", label: "Toys", value: 6 },
  { id: "g", label: "Garden", value: 5 },
];

const gigabytes: Intl.NumberFormatOptions = { style: "unit", unit: "gigabyte" };

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="700" fontSize="500">
    {children}
  </Text>
);

const SubHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="600" fontSize="400">
    {children}
  </Text>
);

const Caption = ({ children }: { children: ReactNode }) => (
  <Text color="neutral.11" fontSize="300">
    {children}
  </Text>
);

/** Row label in the matrices */
const RowLabel = ({ children }: { children: ReactNode }) => (
  <Box width="90px" flexShrink="0">
    <Text fontWeight="600">{children}</Text>
  </Box>
);

/** Frame that shows the space a context gives the meter */
const Frame = ({
  children,
  maxWidth = "760px",
}: {
  children: ReactNode;
  maxWidth?: string;
}) => (
  <Box
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
    maxWidth={maxWidth}
  >
    {children}
  </Box>
);

// ============================================================
// MATRICES
// ============================================================

const SizeLayoutMatrix = ({ segments }: { segments?: MeterSegment[] }) => (
  <Stack gap="600">
    <Stack direction="row" gap="600">
      <Box width="90px" flexShrink="0" />
      {layouts.map((layout) => (
        <Box key={layout} flex="1">
          <Text fontWeight="600">{layout}</Text>
        </Box>
      ))}
    </Stack>
    {sizes.map((size) => (
      <Stack key={size} direction="row" gap="600" alignItems="flex-start">
        <RowLabel>{size}</RowLabel>
        {layouts.map((layout) => (
          <Box key={layout} flex="1" minWidth="0">
            <Meter
              size={size}
              layout={layout}
              label={segments ? "Storage" : "Usage"}
              aria-label={segments ? "Storage" : "Usage"}
              {...(segments
                ? { segments, formatOptions: gigabytes }
                : { value: 62 })}
            />
          </Box>
        ))}
      </Stack>
    ))}
  </Stack>
);

const textStyles = ["xs", "sm", "md"] as const;

const SizeTextStyleMatrix = () => (
  <Stack gap="600">
    <Stack direction="row" gap="400">
      <Box width="90px" flexShrink="0">
        <Caption>size ↓ text →</Caption>
      </Box>
      {textStyles.map((textStyle) => (
        <Box key={textStyle} flex="1">
          <Text fontWeight="600">{textStyle}</Text>
        </Box>
      ))}
    </Stack>
    {sizes.map((size) => (
      <Stack key={size} direction="row" gap="400" alignItems="flex-start">
        <RowLabel>{size}</RowLabel>
        {textStyles.map((textStyle) => (
          <Box
            key={textStyle}
            flex="1"
            minWidth="0"
            padding="200"
            borderRadius="200"
            bg={size === textStyle ? "primary.2" : undefined}
          >
            <Meter
              size={size}
              textStyle={textStyle}
              label="Storage"
              segments={storage.slice(0, 2)}
              formatOptions={gigabytes}
            />
          </Box>
        ))}
      </Stack>
    ))}
  </Stack>
);

// ============================================================
// IN-USE ASSEMBLIES
// ============================================================

const PlanUsageCardAssembly = () => (
  <Card.Root variant="outlined" maxWidth="420px">
    <Card.Header>
      <Flex justifyContent="space-between" alignItems="center" gap="400">
        <Heading size="lg">Plan usage</Heading>
        <Badge size="xs" colorPalette="primary">
          Growth plan
        </Badge>
      </Flex>
    </Card.Header>
    <Card.Body>
      <Stack gap="500">
        <Meter
          size="sm"
          textStyle="sm"
          label="API calls this month"
          value={1_240_000}
          maxValue={2_000_000}
          formatOptions={{ notation: "compact" }}
          valueLabel="1.24M of 2M"
        />
        <Meter
          size="sm"
          textStyle="sm"
          label="Storage"
          segments={storage}
          formatOptions={gigabytes}
        />
        <Meter
          size="sm"
          textStyle="sm"
          label="Team seats"
          value={9}
          maxValue={10}
          formatOptions={{}}
          valueLabel="9 of 10"
          colorPalette="warning"
        />
      </Stack>
    </Card.Body>
  </Card.Root>
);

const warehouses = [
  { name: "Berlin", sku: "12,480", capacity: 92 },
  { name: "Munich", sku: "8,210", capacity: 64 },
  { name: "Hamburg", sku: "3,905", capacity: 31 },
  { name: "Cologne", sku: "1,120", capacity: 8 },
];

const paletteForCapacity = (capacity: number) =>
  capacity >= 90 ? "critical" : capacity >= 75 ? "warning" : "primary";

const WarehouseTableAssembly = () => (
  <Box maxWidth="760px">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Warehouse</Table.ColumnHeader>
          <Table.ColumnHeader>SKUs</Table.ColumnHeader>
          <Table.ColumnHeader width="45%">Capacity</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {warehouses.map((w) => (
          <Table.Row key={w.name}>
            <Table.Cell>{w.name}</Table.Cell>
            <Table.Cell>{w.sku}</Table.Cell>
            <Table.Cell>
              <Meter
                size="sm"
                textStyle="inherit"
                layout="inline"
                aria-label={`${w.name} capacity`}
                value={w.capacity}
                colorPalette={paletteForCapacity(w.capacity)}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Box>
);

const KpiTilesAssembly = () => (
  <SimpleGrid columns={3} gap="400" maxWidth="760px">
    {[
      { title: "Orders shipped", value: 78, note: "780 of 1,000 today" },
      { title: "Returns processed", value: 45, note: "45 of 100 open" },
      { title: "Catalog completeness", value: 96, note: "Missing 42 images" },
    ].map((kpi) => (
      <Card.Root key={kpi.title} variant="outlined" size="sm">
        <Card.Body>
          <Stack gap="200">
            <Caption>{kpi.title}</Caption>
            <Text fontSize="750" fontWeight="700" lineHeight="1">
              {kpi.value}%
            </Text>
            <Meter
              size="sm"
              layout="minimal"
              aria-label={kpi.title}
              value={kpi.value}
            />
            <Caption>{kpi.note}</Caption>
          </Stack>
        </Card.Body>
      </Card.Root>
    ))}
  </SimpleGrid>
);

const SidebarQuotaAssembly = () => (
  <Box
    width="240px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="300"
    bg="neutral.2"
  >
    <Stack gap="300">
      <Text fontWeight="600" fontSize="350">
        Media library
      </Text>
      <Meter
        size="sm"
        label="Storage used"
        value={7.4}
        maxValue={10}
        formatOptions={gigabytes}
        valueLabel="7.4 of 10 GB"
      />
      <Button size="2xs" variant="outline">
        Upgrade storage
      </Button>
    </Stack>
  </Box>
);

const ImportJobAssembly = () => (
  <Frame>
    <Stack gap="300">
      <Flex justifyContent="space-between" alignItems="baseline" gap="400">
        <Heading size="md">Last product import</Heading>
        <Caption>Finished 5 minutes ago</Caption>
      </Flex>
      <Meter
        size="md"
        label="Rows processed"
        formatOptions={{}}
        maxValue={12_000}
        valueLabel="12,000 rows"
        segments={[
          {
            id: "ok",
            label: "Imported",
            value: 10_850,
            colorPalette: "positive",
          },
          {
            id: "warn",
            label: "Imported with warnings",
            value: 830,
            colorPalette: "warning",
          },
          {
            id: "error",
            label: "Failed",
            value: 320,
            colorPalette: "critical",
          },
        ]}
      />
    </Stack>
  </Frame>
);

const InlineTextAssembly = () => (
  <Frame>
    <Stack gap="400">
      {(["xs", "sm", "md", "lg", "2xl"] as const).map((textStyle) => (
        <Box key={textStyle} textStyle={textStyle}>
          <Flex gap="1em" alignItems="center">
            <Text textStyle={textStyle} whiteSpace="nowrap">
              Profile {textStyle}
            </Text>
            <Meter
              textStyle="inherit"
              layout="inline"
              aria-label="Profile completeness"
              value={70}
              maxWidth="240px"
            />
          </Flex>
        </Box>
      ))}
    </Stack>
  </Frame>
);

// ============================================================
// METER AND PROGRESSBAR
// ============================================================

/** ProgressBar size next to the Meter size with the same bar role */
const comparisonRows = [
  { progressBar: "2xs", meter: "sm", matchedText: "sm" },
  { progressBar: "md", meter: "md", matchedText: "md" },
] as const;

const ComparisonMatrix = ({ layout }: { layout: "stacked" | "inline" }) => (
  <Stack gap="600" maxWidth="1100px">
    <Stack direction="row" gap="600">
      <Box width="90px" flexShrink="0" />
      <Box flex="1">
        <Text fontWeight="600">ProgressBar</Text>
      </Box>
      <Box flex="1">
        <Text fontWeight="600">Meter · default text</Text>
      </Box>
      <Box flex="1">
        <Text fontWeight="600">Meter · text matched to ProgressBar</Text>
      </Box>
    </Stack>
    {comparisonRows.map((row) => (
      <Stack
        key={row.progressBar}
        direction="row"
        gap="600"
        alignItems="flex-start"
      >
        <Box width="90px" flexShrink="0">
          <Text fontWeight="600">{row.progressBar}</Text>
          <Caption>vs {row.meter}</Caption>
        </Box>
        <Box flex="1" minWidth="0">
          <ProgressBar
            size={row.progressBar}
            layout={layout}
            label="Upload"
            value={62}
          />
        </Box>
        <Box flex="1" minWidth="0">
          <Meter size={row.meter} layout={layout} label="Storage" value={62} />
        </Box>
        <Box flex="1" minWidth="0">
          <Meter
            size={row.meter}
            textStyle={row.matchedText}
            layout={layout}
            label="Storage"
            value={62}
          />
        </Box>
      </Stack>
    ))}
  </Stack>
);

const MixedCardAssembly = () => (
  <Card.Root variant="outlined" maxWidth="420px">
    <Card.Header>
      <Heading size="lg">Media library</Heading>
    </Card.Header>
    <Card.Body>
      <Stack gap="500">
        <ProgressBar size="md" label="Uploading 12 files" value={40} />
        <Meter
          size="md"
          label="Storage used"
          segments={storage}
          formatOptions={gigabytes}
        />
        <Meter
          size="md"
          textStyle="md"
          label="Storage used (text md)"
          segments={storage}
          formatOptions={gigabytes}
        />
      </Stack>
    </Card.Body>
  </Card.Root>
);

// ============================================================
// STORIES
// ============================================================

/**
 * Every size, layout, color and format side by side, followed by the Meter
 * in typical product contexts.
 */
export const Exploration: Story = {
  render: () => (
    <Stack gap="1200" padding="600">
      <Stack gap="400">
        <SectionHeading>1 · Single value — size × layout</SectionHeading>
        <Caption>
          Without `textStyle`, the text follows `size`, so each row is a matched
          pair.
        </Caption>
        <SizeLayoutMatrix />
      </Stack>

      <Stack gap="400">
        <SectionHeading>
          1b · Independent axes — size × textStyle
        </SectionHeading>
        <Caption>
          `size` sets only the bar, `textStyle` only the text. The diagonal is
          the default pairing.
        </Caption>
        <SizeTextStyleMatrix />
      </Stack>

      <Stack gap="400">
        <SectionHeading>2 · Segments — size × layout</SectionHeading>
        <Caption>The legend is added automatically for segments.</Caption>
        <SizeLayoutMatrix segments={storage} />
      </Stack>

      <Stack gap="400">
        <SectionHeading>3 · Colors</SectionHeading>
        <SubHeading>Semantic palettes (single value)</SubHeading>
        <SimpleGrid columns={2} gap="400" maxWidth="760px">
          {statePalettes.map((palette) => (
            <Meter
              key={palette}
              label={palette}
              value={65}
              colorPalette={palette}
            />
          ))}
        </SimpleGrid>
        <SubHeading>Default segment sequence (7 segments, repeats)</SubHeading>
        <Box maxWidth="760px">
          <Meter label="Revenue by category" segments={manySegments} />
        </Box>
      </Stack>

      <Stack gap="400">
        <SectionHeading>4 · Values and formatting</SectionHeading>
        <SimpleGrid columns={2} gap="600" maxWidth="760px">
          <Meter label="Percent (default)" value={0} />
          <Meter label="Full" value={100} />
          <Meter
            label="Units"
            value={42}
            maxValue={64}
            formatOptions={gigabytes}
          />
          <Meter
            label="Custom value label"
            value={42}
            maxValue={64}
            valueLabel="42 of 64 GB"
          />
          <Meter
            label="Custom range (−20 to 40 °C)"
            value={18}
            minValue={-20}
            maxValue={40}
            formatOptions={{ style: "unit", unit: "celsius" }}
          />
          <Meter label="Clamped (value 140)" value={140} />
        </SimpleGrid>
      </Stack>

      <Stack gap="400">
        <SectionHeading>5 · Stress cases</SectionHeading>
        <SubHeading>Long label and legend in a narrow container</SubHeading>
        <Frame maxWidth="280px">
          <Meter
            label="Storage used by the product media library across all stores"
            segments={storage}
            formatOptions={gigabytes}
          />
        </Frame>
        <SubHeading>Very small segments</SubHeading>
        <Box maxWidth="760px">
          <Meter
            label="Tiny parts"
            segments={[
              { id: "a", label: "Main", value: 80 },
              { id: "b", label: "Small", value: 1 },
              { id: "c", label: "Tiny", value: 0.3 },
            ]}
          />
        </Box>
      </Stack>

      <Stack gap="800">
        <SectionHeading>6 · In use</SectionHeading>

        <Stack gap="300">
          <SubHeading>Plan usage card</SubHeading>
          <Caption>
            sm (text sm) · stacked · several meters in one card · value labels
            in “x of y” form · warning palette close to the limit
          </Caption>
          <PlanUsageCardAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Table cell</SubHeading>
          <Caption>
            sm · textStyle inherit · inline · takes the table text size ·
            palette chosen by the consumer from the value
          </Caption>
          <WarehouseTableAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>KPI tiles</SubHeading>
          <Caption>sm · minimal · the big number carries the value</Caption>
          <KpiTilesAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Sidebar quota</SubHeading>
          <Caption>
            sm (text xs) · stacked · narrow, dense navigation area
          </Caption>
          <SidebarQuotaAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Import result</SubHeading>
          <Caption>
            md (text sm) · stacked · semantic segments with legend
          </Caption>
          <ImportJobAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Next to text of different sizes</SubHeading>
          <Caption>
            textStyle inherit · inline · text follows the context, bar stays md
          </Caption>
          <InlineTextAssembly />
        </Stack>
      </Stack>

      <Stack gap="800">
        <SectionHeading>7 · Meter and ProgressBar side by side</SectionHeading>
        <Caption>
          Same value and layout. ProgressBar sets bar and text together; the
          Meter sets them separately. The right column shows the Meter with its
          text matched to the ProgressBar.
        </Caption>

        <Stack gap="400">
          <SubHeading>Stacked</SubHeading>
          <ComparisonMatrix layout="stacked" />
        </Stack>

        <Stack gap="400">
          <SubHeading>Inline</SubHeading>
          <ComparisonMatrix layout="inline" />
        </Stack>

        <Stack gap="300">
          <SubHeading>In one card</SubHeading>
          <Caption>
            ProgressBar md · Meter md with default text (sm) · Meter md with
            text md
          </Caption>
          <MixedCardAssembly />
        </Stack>
      </Stack>
    </Stack>
  ),
};

type ConfiguratorArgs = {
  value: number;
  minValue: number;
  maxValue: number;
  size: NonNullable<MeterProps["size"]>;
  textStyle: NonNullable<MeterProps["textStyle"]> | "same as size";
  layout: NonNullable<MeterProps["layout"]>;
  colorPalette: NonNullable<MeterProps["colorPalette"]>;
  label: string;
  mode: "single" | "segments";
  segmentCount: number;
  format: "percent" | "gigabytes" | "plain";
  context: "none" | "card" | "table" | "text";
  containerWidth: number;
  contextTextStyle: "xs" | "sm" | "md" | "lg" | "2xl";
};

const formats: Record<ConfiguratorArgs["format"], Intl.NumberFormatOptions> = {
  percent: { style: "percent" },
  gigabytes: gigabytes,
  plain: {},
};

/**
 * Change every setting with the controls and see the Meter in the chosen
 * context.
 */
export const Configurator: StoryObj<ConfiguratorArgs> = {
  args: {
    mode: "single",
    value: 62,
    minValue: 0,
    maxValue: 100,
    segmentCount: 3,
    size: "md",
    textStyle: "same as size",
    layout: "stacked",
    colorPalette: "primary",
    label: "Storage",
    format: "percent",
    context: "none",
    containerWidth: 480,
    contextTextStyle: "sm",
  },
  argTypes: {
    mode: { control: "inline-radio", options: ["single", "segments"] },
    value: { control: { type: "range", min: -20, max: 140, step: 1 } },
    segmentCount: {
      control: { type: "range", min: 1, max: 7, step: 1 },
      if: { arg: "mode", eq: "segments" },
    },
    size: {
      control: "inline-radio",
      options: sizes,
      description: "Bar thickness",
    },
    textStyle: {
      control: "inline-radio",
      options: ["same as size", ...textStyles, "inherit"],
      description: "Text of label, value and legend",
    },
    layout: { control: "inline-radio", options: layouts },
    colorPalette: {
      control: "select",
      options: [...statePalettes, "neutral", "teal", "orange", "pink"],
      if: { arg: "mode", eq: "single" },
    },
    format: {
      control: "inline-radio",
      options: ["percent", "gigabytes", "plain"],
    },
    context: {
      control: "inline-radio",
      options: ["none", "card", "table", "text"],
    },
    containerWidth: {
      control: { type: "range", min: 160, max: 960, step: 8 },
    },
    contextTextStyle: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "2xl"],
      description: "Text style of the context; used by textStyle `inherit`",
    },
  },
  render: ({
    mode,
    segmentCount,
    format,
    context,
    containerWidth,
    contextTextStyle,
    value,
    textStyle,
    ...meterProps
  }) => {
    const meter = (
      <Meter
        {...meterProps}
        textStyle={textStyle === "same as size" ? undefined : textStyle}
        aria-label={meterProps.label ? undefined : "Meter"}
        formatOptions={formats[format]}
        {...(mode === "segments"
          ? { segments: manySegments.slice(0, segmentCount) }
          : { value })}
      />
    );

    if (context === "card") {
      return (
        <Box textStyle={contextTextStyle} width={`${containerWidth}px`}>
          <Card.Root variant="outlined">
            <Card.Header>
              <Heading size="lg">Plan usage</Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap="400">
                <Text textStyle={contextTextStyle}>
                  Your usage resets on the first day of each month.
                </Text>
                {meter}
                <Separator />
                <Button size="xs" variant="outline" alignSelf="flex-start">
                  Manage plan
                </Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Box>
      );
    }

    if (context === "table") {
      return (
        <Box width={`${containerWidth}px`}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader width="60%">Meter</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {["Berlin", "Munich"].map((name) => (
                <Table.Row key={name}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{meter}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      );
    }

    if (context === "text") {
      return (
        <Box textStyle={contextTextStyle} width={`${containerWidth}px`}>
          <Text textStyle={contextTextStyle} marginBottom="0.5em">
            The meter sits in a paragraph with text style {contextTextStyle}.
          </Text>
          {meter}
          <Text textStyle={contextTextStyle} marginTop="0.5em">
            Text after the meter shows the vertical rhythm.
          </Text>
        </Box>
      );
    }

    return <Box width={`${containerWidth}px`}>{meter}</Box>;
  },
};
