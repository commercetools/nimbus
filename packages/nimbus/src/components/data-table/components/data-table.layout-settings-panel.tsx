import { Box, ToggleButtonGroup, Select, Text, SimpleGrid } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import type { Key } from "react-aria-components";
import { UPDATE_ACTIONS } from "../constants";
import {
  WrapText,
  ShortText,
  DensitySmall,
  DensityMedium,
  DensityLarge,
  HorizontalRule,
} from "@commercetools/nimbus-icons";
import { dataTableMessagesStrings } from "../data-table.messages";
import { useStableDataTableContext } from "./data-table.context";
import type { DataTableProps, DataTableSize } from "../data-table.types";

const SIZE_LABEL_KEYS = {
  sm: "compact",
  md: "standard",
  lg: "comfortable",
  xl: "spacious",
} as const satisfies Record<DataTableSize, string>;

// Fewer lines mean more space between rows: 4 lines for `sm`, one line for `xl`.
const SIZE_ICONS = {
  sm: DensitySmall,
  md: DensityMedium,
  lg: DensityLarge,
  xl: HorizontalRule,
} as const satisfies Record<DataTableSize, unknown>;

// The deprecated `xl` is offered only to tables that started with it, so a
// table that was never on `xl` does not offer it.
const SIZE_OPTIONS: Record<"withXl" | "withoutXl", DataTableSize[]> = {
  withXl: ["xl", "lg", "md", "sm"],
  withoutXl: ["lg", "md", "sm"],
};

export const LayoutSettingsPanel = ({
  onSettingsChange,
}: {
  onSettingsChange?: DataTableProps["onSettingsChange"];
}) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const context = useStableDataTableContext();

  const textVisibility = context.isTruncated ?? false;
  const size = context.size;
  const sizeOptions = context.startedWithXl
    ? SIZE_OPTIONS.withXl
    : SIZE_OPTIONS.withoutXl;

  const handleTextVisibilityChange = (keys: Set<string | number>) => {
    const selected = Array.from(keys)[0] as "full" | "preview";
    if (selected) {
      onSettingsChange?.(UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY);
    }
  };

  const handleSizeChange = (key: Key | null) => {
    if (key !== null && key !== size) {
      onSettingsChange?.(UPDATE_ACTIONS.CHANGE_SIZE, String(key));
    }
  };

  return (
    <SimpleGrid
      role="group"
      aria-label={msg.format("layoutSettingsAriaLabel")}
      templateColumns="repeat(4, 1fr)"
      columnGap="400"
      rowGap="600"
      mt="800"
      alignItems="center"
    >
      {/* Text visibility section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">{msg.format("textVisibility")}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <ToggleButtonGroup.Root
          size="xs"
          w="full"
          selectedKeys={textVisibility ? ["preview"] : ["full"]}
          onSelectionChange={handleTextVisibilityChange}
          aria-label={msg.format("textVisibilityAriaLabel")}
        >
          <ToggleButtonGroup.Button id="full" flex="1">
            <WrapText />
            {msg.format("fullText")}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="preview" flex="1">
            <ShortText />
            {msg.format("textPreviews")}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </SimpleGrid.Item>
      {/* Row density section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">{msg.format("rowDensity")}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Select.Root
          size="sm"
          w="full"
          isClearable={false}
          selectedKey={size}
          onSelectionChange={handleSizeChange}
          aria-label={msg.format("rowDensityAriaLabel")}
        >
          <Select.Options>
            {sizeOptions.map((option) => {
              const SizeIcon = SIZE_ICONS[option];
              const label = msg.format(SIZE_LABEL_KEYS[option]);
              return (
                <Select.Option key={option} id={option} textValue={label}>
                  {/* The wrapper keeps the gap in the closed select too, which
                      shows only the content of the selected option. */}
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap="200"
                  >
                    <SizeIcon />
                    {label}
                  </Box>
                </Select.Option>
              );
            })}
          </Select.Options>
        </Select.Root>
      </SimpleGrid.Item>
    </SimpleGrid>
  );
};
