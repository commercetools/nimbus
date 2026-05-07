import { memo, useCallback, useContext } from "react";
import { TagGroupContext, ButtonContext } from "react-aria-components";
import type { Key } from "react-stately";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { Box } from "@/components/box";
import { IconButton } from "@/components/icon-button/icon-button";
import { useComboBoxRootContext } from "./combobox.root-context";
import { ComboBoxTagGroupSlot, ComboBoxTagSlot } from "../combobox.slots";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { comboboxMessagesStrings } from "../combobox.messages";

/**
 * # ComboBox.TagGroup (Internal Component)
 *
 * Internal component that displays selected items as tags in multi-select mode.
 * Automatically rendered by ComboBox.Trigger - not exposed to consumers.
 *
 * Uses lightweight plain elements instead of React Aria's TagGroup collection
 * system for performance — avoids the collection reconciliation overhead when
 * rendering many selected tags.
 *
 * Consumes React-Aria's TagGroupContext, which is populated by the
 * TagGroupContextProvider in ComboBox.Root with:
 * - items: selected items array from collection
 * - onRemove: handler to remove tags
 * - aria-label: accessible label for the tag group
 * - id: generated in ComboBox.Root
 *
 * Renders null in single-select mode to avoid unnecessary DOM elements.
 *
 * @internal
 * @supportsStyleProps
 */

type LightweightTagProps = {
  itemKey: Key;
  itemValue: string;
  isDisabled: boolean;
  onRemove?: (keys: Set<Key>) => void;
};

const LightweightTag = memo(function LightweightTag({
  itemKey,
  itemValue,
  isDisabled,
  onRemove,
}: LightweightTagProps) {
  const msg = useLocalizedStringFormatter(comboboxMessagesStrings);

  const handleRemove = useCallback(() => {
    onRemove?.(new Set([itemKey]));
  }, [onRemove, itemKey]);

  return (
    <ComboBoxTagSlot role="listitem" data-disabled={isDisabled || undefined}>
      {itemValue}
      {!isDisabled && onRemove && (
        <ButtonContext.Provider value={{}}>
          <IconButton
            size="2xs"
            variant="ghost"
            colorPalette="neutral"
            onPress={handleRemove}
            aria-label={msg.format("removeTag", { tagName: itemValue })}
          >
            <CloseIcon />
          </IconButton>
        </ButtonContext.Provider>
      )}
    </ComboBoxTagSlot>
  );
});

export const ComboBoxTagGroup = (props: Record<string, unknown>) => {
  const { selectionMode, getKey, getTextValue, isDisabled, isReadOnly } =
    useComboBoxRootContext();
  const [styleProps, functionalProps] = extractStyleProps(props);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagGroupContext = useContext<any>(TagGroupContext);

  const items: object[] =
    (tagGroupContext && "items" in tagGroupContext
      ? tagGroupContext.items
      : undefined) ?? [];

  const onRemove: ((keys: Set<Key>) => void) | undefined =
    tagGroupContext && "onRemove" in tagGroupContext
      ? tagGroupContext.onRemove
      : undefined;

  const contextId: string | undefined =
    tagGroupContext && "id" in tagGroupContext ? tagGroupContext.id : undefined;

  const contextAriaLabel: string | undefined =
    tagGroupContext && "aria-label" in tagGroupContext
      ? tagGroupContext["aria-label"]
      : undefined;

  if (selectionMode !== "multiple") {
    return null;
  }

  return (
    <ComboBoxTagGroupSlot {...styleProps} {...functionalProps}>
      <Box
        role="list"
        id={contextId}
        aria-label={contextAriaLabel}
        display="contents"
      >
        {items.map((item) => (
          <LightweightTag
            key={getKey(item)}
            itemKey={getKey(item)}
            itemValue={getTextValue(item)}
            isDisabled={isDisabled || isReadOnly}
            onRemove={onRemove}
          />
        ))}
      </Box>
    </ComboBoxTagGroupSlot>
  );
};

ComboBoxTagGroup.displayName = "ComboBox.TagGroup";
