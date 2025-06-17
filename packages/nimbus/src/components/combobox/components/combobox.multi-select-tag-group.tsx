import { useMemo, useCallback } from "react";
import { type Key, type Selection } from "react-aria-components";
import { ClearPressResponder } from "@react-aria/interactions";
import { TagGroup } from "@/components";
import type { ComboBoxMultiSelectValueProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";

// Type guard to check if an item has children array (sectioned data)
function hasChildrenArray<T extends object>(
  item: unknown
): item is { children: T[] } {
  return (
    item !== null &&
    item !== undefined &&
    typeof item === "object" &&
    "children" in item &&
    Array.isArray((item as { children: unknown }).children)
  );
}

function checkItemValidity(
  item: Record<string, unknown>,
  idKey: string,
  valueKey: string
) {
  if (!item) return;
  if (!Object.prototype.hasOwnProperty.call(item, "id") && idKey === "id") {
    throw new Error(
      "ComboBox: if items do not have an `id` key, you must specify which key uniquely identifies items using the `itemID` prop"
    );
  }
  if (
    !Object.prototype.hasOwnProperty.call(item, "name") &&
    valueKey === "name"
  ) {
    throw new Error(
      "ComboBox: if items do not have a `name` key, you must specify which key can be used as a text value using the `itemValue` prop"
    );
  }
}

export const MultiSelectTagGroup =
  /* eslint-disable @typescript-eslint/no-explicit-any */
  <T extends Record<string, any>>({
    selectedKeys = new Set(),
    items,
    itemID = "id",
    itemValue = "name",
    placeholder,
    onSelectionChange,
    isDisabled,
    isReadOnly,
    size,
    containerRef,
    ref,
  }: ComboBoxMultiSelectValueProps<T>) => {
    const selectedItems = useMemo(() => {
      if (!items) return [];

      const selectedKeysArray = Array.from(selectedKeys);
      // Handle sectioned data structure
      if (Array.isArray(items)) {
        // Check if items are sections (have children property)
        const firstItem = items[0] as unknown;
        if (firstItem && hasChildrenArray<T>(firstItem)) {
          // Flatten sectioned items
          const allItems: T[] = [];
          items.forEach((section) => {
            if (hasChildrenArray<T>(section as unknown)) {
              allItems.push(...(section as { children: T[] }).children);
            }
          });
          // make sure we have an id and value
          checkItemValidity(allItems?.[0], itemID, itemValue);
          return selectedKeysArray
            .map((key) => allItems.find((item) => item[itemID] === key))
            .filter((item): item is T => item !== undefined);
        }

        // Handle flat array - cast to T[] since we know it's not sectioned
        const flatItems = items as T[];
        // make sure we have an id and value
        checkItemValidity(flatItems?.[0], itemID, itemValue);
        return selectedKeysArray
          .map((key) => flatItems.find((item) => item[itemID] === key))
          .filter((item): item is T => item !== undefined);
      }

      // Handle other iterable types
      const iterableItems = selectedKeysArray
        .map((key) => Array.from(items).find((item) => item[itemID] === key))
        .filter((item): item is T => item !== undefined);
      // make sure we have an id and value
      checkItemValidity(iterableItems?.[0], itemID, itemValue);
      return iterableItems;
    }, [items, selectedKeys, itemID]);

    const handleRemoveSelectedItem = useCallback(
      (keys: Set<Key>) => {
        // Don't allow removal if disabled
        if (isDisabled || isReadOnly) return;

        if (selectedKeys instanceof Set) {
          // Create new selection by removing the specified keys
          const currentKeys = selectedKeys as Set<Key>;
          const newSelectedKeys: Selection = new Set(
            [...currentKeys].filter((key) => !keys.has(key))
          );

          onSelectionChange?.(newSelectedKeys);

          if (containerRef?.current) {
            containerRef.current.focus();
          }
        }
      },
      [isDisabled, isReadOnly, selectedKeys, onSelectionChange]
    );
    return (
      <ClearPressResponder>
        <ComboBoxValueSlot
          asChild
          alignItems="space-between"
          justifyContent="center"
          ref={ref}
        >
          <TagGroup.Root
            size={size}
            onRemove={handleRemoveSelectedItem}
            aria-label="Selected values"
            selectionMode="none"
            disabledKeys={isDisabled || isReadOnly ? selectedKeys : undefined}
            data-disabled={isDisabled}
          >
            <TagGroup.TagList
              items={selectedItems}
              dependencies={[itemID]}
              maxW={"100%"}
              tabIndex={
                selectedItems.length === 0 || isDisabled || isReadOnly
                  ? -1
                  : undefined
              }
              renderEmptyState={() =>
                placeholder && (
                  <div
                    data-placeholder="true"
                    style={{
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {placeholder}
                  </div>
                )
              }
            >
              {(item) => {
                return (
                  <TagGroup.Tag id={item[itemID] as string} maxW={"100%"}>
                    {item[itemValue]}
                  </TagGroup.Tag>
                );
              }}
            </TagGroup.TagList>
          </TagGroup.Root>
        </ComboBoxValueSlot>
      </ClearPressResponder>
    );
  };
