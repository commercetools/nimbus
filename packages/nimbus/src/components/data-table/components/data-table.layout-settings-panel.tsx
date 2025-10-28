import { useIntl } from "react-intl";
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
import { messages } from "../data-table.i18n";
import { useDataTableContext } from "./data-table.context";
import type { DataTableProps } from "../data-table.types";

export const LayoutSettingsPanel = ({
  onSettingsChange,
}: {
  onSettingsChange?: DataTableProps["onSettingsChange"];
}) => {
  const { formatMessage } = useIntl();
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
        <Text fontWeight="500">{formatMessage(messages.textVisibility)}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Toolbar orientation="horizontal" variant="outline" size="xs" w="full">
          <ToggleButtonGroup.Root
            w="full"
            selectedKeys={textVisibility ? ["preview"] : ["full"]}
            onSelectionChange={handleTextVisibilityChange}
            aria-label={formatMessage(messages.textVisibilityAriaLabel)}
          >
            <IconToggleButton
              id="full"
              size="xs"
              aria-label={formatMessage(messages.fullText)}
              variant="ghost"
              px="300"
              flex="1"
            >
              <WrapText />
              {formatMessage(messages.fullText)}
            </IconToggleButton>
            <IconToggleButton
              id="preview"
              size="xs"
              aria-label={formatMessage(messages.TextPreviews)}
              variant="ghost"
              px="300"
              flex="1"
            >
              <ShortText />
              {formatMessage(messages.TextPreviews)}
            </IconToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
      {/* Row density section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">{formatMessage(messages.RowDensity)}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Toolbar orientation="horizontal" variant="outline" size="xs" w="full">
          <ToggleButtonGroup.Root
            w="full"
            colorPalette="primary"
            selectedKeys={[rowDensity]}
            onSelectionChange={handleRowDensityChange}
            aria-label={formatMessage(messages.RowDensityAriaLabel)}
          >
            <IconToggleButton
              id="comfortable"
              size="xs"
              variant="ghost"
              aria-label={formatMessage(messages.comfortable)}
              px="300"
              flex="1"
            >
              <DensitySmall />
              {formatMessage(messages.comfortable)}
            </IconToggleButton>
            <IconToggleButton
              id="compact"
              size="xs"
              variant="ghost"
              aria-label={formatMessage(messages.compact)}
              px="300"
              flex="1"
            >
              <FormatAlignJustify />
              {formatMessage(messages.compact)}
            </IconToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
    </SimpleGrid>
  );
};
