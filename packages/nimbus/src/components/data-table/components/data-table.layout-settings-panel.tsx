import { ToggleButtonGroup, Text, SimpleGrid, Toolbar } from "@/components";
import { ToggleButton } from "@/components/toggle-button/toggle-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { UPDATE_ACTIONS } from "../constants";
import {
  WrapText,
  ShortText,
  DensitySmall,
  FormatAlignJustify,
} from "@commercetools/nimbus-icons";
import { dataTableMessagesStrings } from "../data-table.messages";
import { useDataTableContext } from "./data-table.context";
import type { DataTableProps } from "../data-table.types";

export const LayoutSettingsPanel = ({
  onSettingsChange,
}: {
  onSettingsChange?: DataTableProps["onSettingsChange"];
}) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const context = useDataTableContext();

  const textVisibility = context.isTruncated ?? false;
  const rowDensity: "comfortable" | "compact" =
    context.density === "condensed" ? "compact" : "comfortable";

  const handleTextVisibilityChange = (keys: Set<string | number>) => {
    const selected = Array.from(keys)[0] as "full" | "preview";
    if (selected) {
      onSettingsChange?.(UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY);
    }
  };

  const handleRowDensityChange = (keys: Set<string | number>) => {
    const selected = Array.from(keys)[0] as "comfortable" | "compact";
    if (selected) {
      onSettingsChange?.(UPDATE_ACTIONS.TOGGLE_ROW_DENSITY);
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
        <Toolbar orientation="horizontal" variant="outline" size="xs" w="full">
          <ToggleButtonGroup.Root
            w="full"
            selectedKeys={textVisibility ? ["preview"] : ["full"]}
            onSelectionChange={handleTextVisibilityChange}
            aria-label={msg.format("textVisibilityAriaLabel")}
          >
            <ToggleButton id="full" size="xs" variant="ghost" px="300" flex="1">
              <WrapText />
              {msg.format("fullText")}
            </ToggleButton>
            <ToggleButton
              id="preview"
              size="xs"
              variant="ghost"
              px="300"
              flex="1"
            >
              <ShortText />
              {msg.format("textPreviews")}
            </ToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
      {/* Row density section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">{msg.format("rowDensity")}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Toolbar orientation="horizontal" variant="outline" size="xs" w="full">
          <ToggleButtonGroup.Root
            w="full"
            colorPalette="primary"
            selectedKeys={[rowDensity]}
            onSelectionChange={handleRowDensityChange}
            aria-label={msg.format("rowDensityAriaLabel")}
          >
            <ToggleButton
              id="comfortable"
              size="xs"
              variant="ghost"
              px="300"
              flex="1"
            >
              <DensitySmall />
              {msg.format("comfortable")}
            </ToggleButton>
            <ToggleButton
              id="compact"
              size="xs"
              variant="ghost"
              px="300"
              flex="1"
            >
              <FormatAlignJustify />
              {msg.format("compact")}
            </ToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
    </SimpleGrid>
  );
};
