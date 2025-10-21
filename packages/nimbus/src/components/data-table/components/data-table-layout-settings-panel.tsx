import { useState } from "react";
import { useIntl } from "react-intl";
import { ToggleButtonGroup, Text, SimpleGrid } from "@/components";
import {
  WrapText,
  ShortText,
  DensitySmall,
  FormatAlignJustify,
} from "@commercetools/nimbus-icons";
import { messages } from "../data-table.i18n";
import { useDataTableContext } from "./data-table.context";

export type DataTableManagerProps = {
  // /** Position of the settings button - can be a render prop for custom positioning */
  renderTrigger?: (props: { onClick: () => void }) => React.ReactNode;
};

const LayoutSettingsPanel = () => {
  const { formatMessage } = useIntl();
  const context = useDataTableContext();

  // Local state for text visibility and row density
  // In a real implementation, these would be controlled via DataTable props
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
      // TODO: Implement callback to update isTruncated in DataTable context
      // This would typically be done via an onLayoutChange callback
    }
  };

  const handleRowDensityChange = (keys: Set<string | number>) => {
    const selected = Array.from(keys)[0] as "comfortable" | "compact";
    if (selected) {
      setRowDensity(selected);
      // TODO: Implement callback to update density in DataTable context
      // This would typically be done via an onLayoutChange callback
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
        <ToggleButtonGroup.Root
          tone="primary"
          selectedKeys={[textVisibility]}
          onSelectionChange={handleTextVisibilityChange}
          aria-label={formatMessage(messages.textVisibilityAriaLabel)}
        >
          <ToggleButtonGroup.Button id="full">
            <WrapText />
            {formatMessage(messages.fullText)}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="preview">
            <ShortText />
            {formatMessage(messages.TextPreviews)}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
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
        <ToggleButtonGroup.Root
          tone="primary"
          selectedKeys={[rowDensity]}
          onSelectionChange={handleRowDensityChange}
          aria-label={formatMessage(messages.RowDensityAriaLabel)}
        >
          <ToggleButtonGroup.Button id="comfortable">
            <DensitySmall />
            {formatMessage(messages.comfortable)}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="compact">
            <FormatAlignJustify />
            {formatMessage(messages.compact)}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </SimpleGrid.Item>
    </SimpleGrid>
  );
};

export default LayoutSettingsPanel;
