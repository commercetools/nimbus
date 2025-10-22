import { useState } from "react";
import { useIntl } from "react-intl";
import {
  ToggleButtonGroup,
  Text,
  SimpleGrid,
  Toolbar,
  IconToggleButton,
} from "@/components";
import {
  WrapText,
  ShortText,
  DensitySmall,
  FormatAlignJustify,
} from "@commercetools/nimbus-icons";
import { messages } from "../data-table.i18n";
import { useDataTableContext } from "./data-table.context";
import type { DataTableProps } from "../data-table.types";

const LayoutSettingsPanel = ({
  onSettingsChange,
}: {
  onSettingsChange?: DataTableProps["onSettingsChange"];
}) => {
  const { formatMessage } = useIntl();
  const context = useDataTableContext();

  // Local state for text visibility and row density
  // TODO: Would be controlled via DataTable props
  const [textVisibility, setTextVisibility] = useState<"full" | "preview">(
    "full"
  );
  const [rowDensity, setRowDensity] = useState<"comfortable" | "compact">(
    context.density === "condensed" ? "compact" : "comfortable"
  );

  const handleTextVisibilityChange = (keys: Set<string | number>) => {
    const selected = Array.from(keys)[0] as "full" | "preview";
    if (selected) {
      setTextVisibility(selected);
      onSettingsChange?.("toggleTextVisibility");
    }
  };

  const handleRowDensityChange = (keys: Set<string | number>) => {
    const selected = Array.from(keys)[0] as "comfortable" | "compact";
    if (selected) {
      setRowDensity(selected);
      onSettingsChange?.("toggleRowDensity");
    }
  };

  return (
    <SimpleGrid
      columns={{
        base: 2,
        md: 4,
      }}
      columnGap="400"
      rowGap="600"
      mt="800"
      alignItems="center"
    >
      {/* Text visibility section */}
      <SimpleGrid.Item
        colSpan={{
          base: 1,
          md: 1,
        }}
      >
        <Text fontWeight="500">{formatMessage(messages.textVisibility)}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item
        colSpan={{
          base: 1,
          md: 3,
        }}
      >
        <Toolbar orientation="horizontal" variant="outline" size="xs">
          <ToggleButtonGroup.Root
            selectedKeys={[textVisibility]}
            onSelectionChange={handleTextVisibilityChange}
            aria-label={formatMessage(messages.textVisibilityAriaLabel)}
          >
            <IconToggleButton
              id="full"
              size="xs"
              aria-label={formatMessage(messages.fullText)}
              variant="ghost"
              px="300"
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
            >
              <ShortText />
              {formatMessage(messages.TextPreviews)}
            </IconToggleButton>
          </ToggleButtonGroup.Root>
        </Toolbar>
      </SimpleGrid.Item>
      {/* Row density section */}
      <SimpleGrid.Item
        colSpan={{
          base: 1,
          md: 1,
        }}
      >
        <Text fontWeight="500">{formatMessage(messages.RowDensity)}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item
        colSpan={{
          base: 1,
          md: 3,
        }}
      >
        <Toolbar orientation="horizontal" variant="outline" size="xs">
          <ToggleButtonGroup.Root
            tone="primary"
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

export default LayoutSettingsPanel;
