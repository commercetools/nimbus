import { useContext } from "react";
import {
  TagGroupContext,
  type ContextValue,
  type TagGroupProps,
} from "react-aria-components";
import { TagGroup } from "@/components";
import { useComboBoxRootContext } from "./combobox.root-context";
import { ComboBoxTagGroupSlot } from "../combobox.slots";
import type { ComboBoxTagGroupProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.TagGroup (Internal Component)
 *
 * Internal component that displays selected items as tags in multi-select mode.
 * Automatically rendered by ComboBox.Trigger - not exposed to consumers.
 *
 * Consumes React-Aria's TagGroupContext, which is populated by the
 * TagGroupContextProvider in ComboBox.Root with:
 * - items: selected items array from collection
 * - onRemove: handler to remove tags
 * - size: tag size matching ComboBox size
 * - aria-label: accessible label for the tag group
 * - id: generated in ComboBox.Root
 * - selectionMode: "none" (tags are not selectable)
 * - disabledKeys: disabled tag keys
 *
 * Renders null in single-select mode to avoid unnecessary DOM elements.
 *
 * @internal
 * @supportsStyleProps
 */
export const ComboBoxTagGroup = (props: ComboBoxTagGroupProps) => {
  const { selectionMode, size, getKey, getTextValue, isDisabled, isReadOnly } =
    useComboBoxRootContext();
  const [styleProps, functionalProps] = extractStyleProps(props);

  const tagGroupContext =
    useContext<
      ContextValue<TagGroupProps & { items?: object[] }, HTMLDivElement>
    >(TagGroupContext);

  // Extract items from context, handling both direct values and slotted values
  const items =
    (tagGroupContext && "items" in tagGroupContext
      ? tagGroupContext.items
      : undefined) ?? [];

  // Only render in multi-select mode
  if (selectionMode !== "multiple") {
    return null;
  }

  return (
    <ComboBoxTagGroupSlot {...styleProps} {...functionalProps} asChild>
      {/* TagGroup.Root receives id from TagGroupContext set by custom-context */}
      <TagGroup.Root size={size}>
        <TagGroup.TagList items={items} display="contents">
          {(item) => {
            const itemKey = getKey(item);
            const itemValue = getTextValue(item);
            return (
              <TagGroup.Tag
                id={itemKey}
                textValue={itemValue}
                isDisabled={isDisabled || isReadOnly}
                maxW="100%"
              >
                {itemValue}
              </TagGroup.Tag>
            );
          }}
        </TagGroup.TagList>
      </TagGroup.Root>
    </ComboBoxTagGroupSlot>
  );
};

ComboBoxTagGroup.displayName = "ComboBox.TagGroup";
