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
 * # ComboBox.TagGroup
 *
 * Displays selected items as tags in multi-select mode.
 * Uses Nimbus TagGroup component which reads from TagGroupContext.
 *
 * TagGroupContext (provided by custom context provider) includes:
 * - items: selected items array from collection
 * - onRemove: handler to remove tags
 * - size: tag size variant
 * - aria-label: accessible label
 * - selectionMode: "none" for tags
 * - disabledKeys: disabled tag keys
 *
 * Only renders content in multi-select mode.
 *
 * @example
 * ```tsx
 * <ComboBox.Trigger>
 *   <ComboBox.TagGroup />
 *   <ComboBox.Input />
 * </ComboBox.Trigger>
 * ```
 *
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
