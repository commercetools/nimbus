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
  type MeterRootProps,
  type MeterSegment,
  ProgressBar,
  Separator,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@commercetools/nimbus";

const meta: Meta<typeof Meter.Root> = {
  title: "Playground/Meter",
  component: Meter.Root,
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

type Story = StoryObj<typeof Meter.Root>;

const sizes = ["sm", "md", "lg"] as const;
const layouts = ["stacked", "inline"] as const;
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

type FullMeterProps = MeterRootProps & {
  /** Content of `Meter.Label` */
  label: string;
};

/**
 * Meter with every part: label, value, track and legend. The matrices
 * compare sizes, layouts and values, so they all use the same parts.
 * `Meter.Legend` renders nothing for a single value.
 */
const FullMeter = ({ label, ...rootProps }: FullMeterProps) => (
  <Meter.Root {...rootProps}>
    <Meter.Label>{label}</Meter.Label>
    <Meter.Value />
    <Meter.Track />
    <Meter.Legend />
  </Meter.Root>
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
      <Box flex="1">
        <Text fontWeight="600">only Meter.Track</Text>
      </Box>
    </Stack>
    {sizes.map((size) => (
      <Stack key={size} direction="row" gap="600" alignItems="flex-start">
        <RowLabel>{size}</RowLabel>
        {layouts.map((layout) => (
          <Box key={layout} flex="1" minWidth="0">
            <FullMeter
              size={size}
              layout={layout}
              label={segments ? "Storage" : "Usage"}
              {...(segments
                ? { segments, formatOptions: gigabytes }
                : { value: 62 })}
            />
          </Box>
        ))}
        <Box flex="1" minWidth="0">
          {/* Without label and value, only the bar is shown. The legend
              stays for segments, so they are not told apart by color only */}
          <Meter.Root
            size={size}
            aria-label={segments ? "Storage" : "Usage"}
            {...(segments
              ? { segments, formatOptions: gigabytes }
              : { value: 62 })}
          >
            <Meter.Track />
            <Meter.Legend />
          </Meter.Root>
        </Box>
      </Stack>
    ))}
  </Stack>
);

const TextStyleMatrix = () => (
  <Stack gap="600">
    <Stack direction="row" gap="400">
      <Box width="90px" flexShrink="0">
        <Caption>size ↓</Caption>
      </Box>
      <Box flex="1">
        <Text fontWeight="600">Default text</Text>
      </Box>
      <Box flex="1">
        <Text fontWeight="600">textStyle md on Meter.Root</Text>
      </Box>
      <Box flex="1">
        <Text fontWeight="600">textStyle 2xl on Meter.Value</Text>
      </Box>
    </Stack>
    {sizes.map((size) => (
      <Stack key={size} direction="row" gap="400" alignItems="flex-start">
        <RowLabel>{size}</RowLabel>
        <Box flex="1" minWidth="0">
          <FullMeter
            size={size}
            label="Storage"
            segments={storage.slice(0, 2)}
            formatOptions={gigabytes}
          />
        </Box>
        <Box flex="1" minWidth="0">
          <FullMeter
            size={size}
            textStyle="md"
            label="Storage"
            segments={storage.slice(0, 2)}
            formatOptions={gigabytes}
          />
        </Box>
        <Box flex="1" minWidth="0">
          <Meter.Root
            size={size}
            segments={storage.slice(0, 2)}
            formatOptions={gigabytes}
          >
            <Meter.Label>Storage</Meter.Label>
            <Meter.Value textStyle="2xl" fontWeight="700" />
            <Meter.Track />
            <Meter.Legend />
          </Meter.Root>
        </Box>
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
        <Meter.Root
          size="sm"
          textStyle="sm"
          value={1_240_000}
          maxValue={2_000_000}
          formatOptions={{ notation: "compact" }}
          valueLabel="1.24M of 2M"
        >
          <Meter.Label>API calls this month</Meter.Label>
          <Meter.Value />
          <Meter.Track />
        </Meter.Root>
        <Meter.Root
          size="sm"
          textStyle="sm"
          segments={storage}
          formatOptions={gigabytes}
        >
          <Meter.Label>Storage</Meter.Label>
          <Meter.Value />
          <Meter.Track />
          <Meter.Legend />
        </Meter.Root>
        <Meter.Root
          size="sm"
          textStyle="sm"
          value={9}
          maxValue={10}
          formatOptions={{}}
          valueLabel="9 of 10"
          colorPalette="warning"
        >
          <Meter.Label>Team seats</Meter.Label>
          <Meter.Value />
          <Meter.Track />
        </Meter.Root>
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
              {/* The warehouse name is in the first column, so the meter
                  is named with aria-label. textStyle sm matches the text of
                  a table cell (Table size md) */}
              <Meter.Root
                size="sm"
                textStyle="sm"
                layout="inline"
                aria-label={`${w.name} capacity`}
                value={w.capacity}
                colorPalette={paletteForCapacity(w.capacity)}
              >
                <Meter.Track />
                <Meter.Value />
              </Meter.Root>
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
            {/* The title names the meter and the big number is its own
                formatted value, so both stay linked to the meter */}
            <Meter.Root size="sm" value={kpi.value}>
              <Meter.Label color="neutral.11" fontSize="300">
                {kpi.title}
              </Meter.Label>
              <Meter.Value fontSize="750" fontWeight="700" lineHeight="1" />
              <Meter.Track />
            </Meter.Root>
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
      <Meter.Root
        size="sm"
        value={7.4}
        maxValue={10}
        formatOptions={gigabytes}
        valueLabel="7.4 of 10 GB"
      >
        <Meter.Label>Storage used</Meter.Label>
        <Meter.Value />
        <Meter.Track />
      </Meter.Root>
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
      <Meter.Root
        size="md"
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
      >
        <Meter.Label>Rows processed</Meter.Label>
        <Meter.Value />
        <Meter.Track />
        <Meter.Legend />
      </Meter.Root>
    </Stack>
  </Frame>
);

const InlineTextAssembly = () => (
  <Frame>
    <Stack gap="400">
      {(["xs", "sm", "md", "lg", "2xl"] as const).map((textStyle) => (
        // textStyle on Root gives label and value the size of the text
        // around the meter; the bar keeps size md
        <Meter.Root
          key={textStyle}
          textStyle={textStyle}
          layout="inline"
          value={70}
          maxWidth="420px"
        >
          <Meter.Label whiteSpace="nowrap">Profile {textStyle}</Meter.Label>
          <Meter.Track />
          <Meter.Value />
        </Meter.Root>
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
          <FullMeter
            size={row.meter}
            layout={layout}
            label="Storage"
            value={62}
          />
        </Box>
        <Box flex="1" minWidth="0">
          <FullMeter
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
        <FullMeter
          size="md"
          label="Storage used"
          segments={storage}
          formatOptions={gigabytes}
        />
        <FullMeter
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
          pair. The last column leaves out Meter.Label and Meter.Value.
        </Caption>
        <SizeLayoutMatrix />
      </Stack>

      <Stack gap="400">
        <SectionHeading>1b · Text style — size × textStyle</SectionHeading>
        <Caption>
          `size` sets the bar and a matching default text. The `textStyle` style
          prop changes the text: on Meter.Root for every part, or on one part
          only.
        </Caption>
        <TextStyleMatrix />
      </Stack>

      <Stack gap="400">
        <SectionHeading>2 · Segments — size × layout</SectionHeading>
        <Caption>
          Meter.Legend shows the name and value of each segment.
        </Caption>
        <SizeLayoutMatrix segments={storage} />
      </Stack>

      <Stack gap="400">
        <SectionHeading>3 · Colors</SectionHeading>
        <SubHeading>Semantic palettes (single value)</SubHeading>
        <SimpleGrid columns={2} gap="400" maxWidth="760px">
          {statePalettes.map((palette) => (
            <FullMeter
              key={palette}
              label={palette}
              value={65}
              colorPalette={palette}
            />
          ))}
        </SimpleGrid>
        <SubHeading>Default segment sequence (7 segments, repeats)</SubHeading>
        <Box maxWidth="760px">
          <FullMeter label="Revenue by category" segments={manySegments} />
        </Box>
      </Stack>

      <Stack gap="400">
        <SectionHeading>4 · Values and formatting</SectionHeading>
        <SimpleGrid columns={2} gap="600" maxWidth="760px">
          <FullMeter label="Percent (default)" value={0} />
          <FullMeter label="Full" value={100} />
          <FullMeter
            label="Units"
            value={42}
            maxValue={64}
            formatOptions={gigabytes}
          />
          <FullMeter
            label="Custom value label"
            value={42}
            maxValue={64}
            valueLabel="42 of 64 GB"
          />
          <FullMeter
            label="Custom range (−20 to 40 °C)"
            value={18}
            minValue={-20}
            maxValue={40}
            formatOptions={{ style: "unit", unit: "celsius" }}
          />
          <FullMeter label="Clamped (value 140)" value={140} />
        </SimpleGrid>
      </Stack>

      <Stack gap="400">
        <SectionHeading>5 · Stress cases</SectionHeading>
        <SubHeading>Long label and legend in a narrow container</SubHeading>
        <Frame maxWidth="280px">
          <FullMeter
            label="Storage used by the product media library across all stores"
            segments={storage}
            formatOptions={gigabytes}
          />
        </Frame>
        <SubHeading>Very small segments</SubHeading>
        <Box maxWidth="760px">
          <FullMeter
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
            sm · textStyle sm (same as the table text) · inline · track and
            value only · palette chosen by the consumer from the value
          </Caption>
          <WarehouseTableAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>KPI tiles</SubHeading>
          <Caption>
            sm · Meter.Label as the title · big Meter.Value through style props
          </Caption>
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
          <SubHeading>Text of different sizes</SubHeading>
          <Caption>
            textStyle on Meter.Root · inline · text follows the textStyle, bar
            stays md
          </Caption>
          <InlineTextAssembly />
        </Stack>
      </Stack>

      <Stack gap="800">
        <SectionHeading>7 · Meter and ProgressBar side by side</SectionHeading>
        <Caption>
          Same value and layout. ProgressBar sets bar and text together; the
          Meter text follows its size unless `textStyle` is set. The right
          column shows the Meter with its text matched to the ProgressBar.
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
  size: NonNullable<MeterRootProps["size"]>;
  textStyle: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  layout: NonNullable<MeterRootProps["layout"]>;
  colorPalette: NonNullable<MeterRootProps["colorPalette"]>;
  label: string;
  showLabel: boolean;
  showValue: boolean;
  showLegend: boolean;
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
    textStyle: "none",
    layout: "stacked",
    colorPalette: "primary",
    label: "Storage",
    showLabel: true,
    showValue: true,
    showLegend: true,
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
      description: "Bar thickness and default text",
    },
    textStyle: {
      control: "inline-radio",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
      description: "textStyle style prop on Meter.Root (none: follows size)",
    },
    layout: { control: "inline-radio", options: layouts },
    showLabel: {
      control: "boolean",
      description:
        "Render Meter.Label (without it, aria-label names the meter)",
    },
    showValue: { control: "boolean", description: "Render Meter.Value" },
    showLegend: {
      control: "boolean",
      description: "Render Meter.Legend (shows only with segments)",
    },
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
      description: "Text style of the content around the meter",
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
    label,
    showLabel,
    showValue,
    showLegend,
    minValue,
    ...rootProps
  }) => {
    const meter = (
      <Meter.Root
        {...rootProps}
        textStyle={textStyle === "none" ? undefined : textStyle}
        aria-label={showLabel ? undefined : label || "Meter"}
        formatOptions={formats[format]}
        {...(mode === "segments"
          ? { segments: manySegments.slice(0, segmentCount) }
          : { value, minValue })}
      >
        {showLabel && <Meter.Label>{label}</Meter.Label>}
        {showValue && <Meter.Value />}
        <Meter.Track />
        {showLegend && <Meter.Legend />}
      </Meter.Root>
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
