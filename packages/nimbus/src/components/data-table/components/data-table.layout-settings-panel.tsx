import { useLocale } from "react-aria-components";
import {
  ToggleButtonGroup,
  Text,
  SimpleGrid,
  Toolbar,
  IconToggleButton,
} from "@/components";
import { UPDATE_ACTIONS } from "../constants";
import {
  WrapText,
  ShortText,
  DensitySmall,
  FormatAlignJustify,
} from "@commercetools/nimbus-icons";
import { dataTableMessages } from "../data-table.messages";
import { useDataTableContext } from "./data-table.context";
import type { DataTableProps } from "../data-table.types";

export const LayoutSettingsPanel = ({
  onSettingsChange,
}: {
  onSettingsChange?: DataTableProps["onSettingsChange"];
}) => {
  const { locale } = useLocale();
  const context = useDataTableContext();

  // Connected to DataTable context state
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
      templateColumns="repeat(4, 1fr)"
      columnGap="400"
      rowGap="600"
      mt="800"
      alignItems="center"
    >
      {/* Text visibility section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">
          {dataTableMessages.getStringLocale("textVisibility", locale)}
        </Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Toolbar orientation="horizontal" variant="outline" size="xs" w="full">
          <ToggleButtonGroup.Root
            w="full"
            selectedKeys={textVisibility ? ["preview"] : ["full"]}
            onSelectionChange={handleTextVisibilityChange}
            aria-label={dataTableMessages.getStringLocale(
              "textVisibilityAriaLabel",
              locale
            )}
          >
            <IconToggleButton
              id="full"
              size="xs"
              aria-label={dataTableMessages.getStringLocale("fullText", locale)}
              variant="ghost"
              px="300"
              flex="1"
            >
              <WrapText />
              {dataTableMessages.getStringLocale("fullText", locale)}
            </IconToggleButton>
            <IconToggleButton
              id="preview"
              size="xs"
              aria-label={dataTableMessages.getStringLocale(
                "textPreviews",
                locale
              )}
              variant="ghost"
              px="300"
              flex="1"
            >
              <ShortText />
              {dataTableMessages.getStringLocale("textPreviews", locale)}
            </IconToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
      {/* Row density section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">
          {dataTableMessages.getStringLocale("rowDensity", locale)}
        </Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Toolbar orientation="horizontal" variant="outline" size="xs" w="full">
          <ToggleButtonGroup.Root
            w="full"
            colorPalette="primary"
            selectedKeys={[rowDensity]}
            onSelectionChange={handleRowDensityChange}
            aria-label={dataTableMessages.getStringLocale(
              "rowDensityAriaLabel",
              locale
            )}
          >
            <IconToggleButton
              id="comfortable"
              size="xs"
              variant="ghost"
              aria-label={dataTableMessages.getStringLocale(
                "comfortable",
                locale
              )}
              px="300"
              flex="1"
            >
              <DensitySmall />
              {dataTableMessages.getStringLocale("comfortable", locale)}
            </IconToggleButton>
            <IconToggleButton
              id="compact"
              size="xs"
              variant="ghost"
              aria-label={dataTableMessages.getStringLocale("compact", locale)}
              px="300"
              flex="1"
            >
              <FormatAlignJustify />
              {dataTableMessages.getStringLocale("compact", locale)}
            </IconToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
    </SimpleGrid>
  );
};
