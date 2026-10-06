import {
  ToggleButtonGroup,
  Select,
  Text,
  SimpleGrid,
  Toolbar,
} from "@/components";
import type { Key } from "react-aria-components";
import { ToggleButton } from "@/components/toggle-button/toggle-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { UPDATE_ACTIONS } from "../constants";
import { WrapText, ShortText } from "@commercetools/nimbus-icons";
import { dataTableMessagesStrings } from "../data-table.messages";
import { useStableDataTableContext } from "./data-table.context";
import type { DataTableProps, DataTableSize } from "../data-table.types";

// The deprecated `xl` is offered only while it is the active size, so a
// consumer who has chosen one of the other sizes cannot go back to it.
const SIZE_LABEL_KEYS = {
  sm: "sizeSmall",
  md: "sizeMedium",
  lg: "sizeLarge",
  xl: "sizeExtraLarge",
} as const satisfies Record<DataTableSize, string>;

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
  const sizeOptions =
    size === "xl" ? SIZE_OPTIONS.withXl : SIZE_OPTIONS.withoutXl;

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
      {/* Row size section */}
      <SimpleGrid.Item colSpan={1}>
        <Text fontWeight="500">{msg.format("rowSize")}</Text>
      </SimpleGrid.Item>
      <SimpleGrid.Item colSpan={3}>
        <Select.Root
          size="sm"
          w="full"
          selectedKey={size}
          onSelectionChange={handleSizeChange}
          aria-label={msg.format("rowSizeAriaLabel")}
        >
          <Select.Options>
            {sizeOptions.map((option) => (
              <Select.Option key={option} id={option}>
                {msg.format(SIZE_LABEL_KEYS[option])}
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>
      </SimpleGrid.Item>
    </SimpleGrid>
  );
};
