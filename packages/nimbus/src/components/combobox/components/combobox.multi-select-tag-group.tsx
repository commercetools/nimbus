import { useMemo, useCallback } from "react";
import { type Key, type Selection } from "react-aria-components";

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
    ref,
  }: ComboBoxMultiSelectValueProps<T>) => {
    const selectedItems = useMemo(() => {
      if (!items) return [];

      const selectedKeysArray = Array.from(selectedKeys);
      // Handle sectioned data structure
      // TODO: should the method to flatten sectioned data be a util?
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

          return selectedKeysArray
            .map((key) => allItems.find((item) => item[itemID] === key))
            .filter((item): item is T => item !== undefined);
        }

        // Handle flat array - cast to T[] since we know it's not sectioned
        const flatItems = items as T[];
        return selectedKeysArray
          .map((key) => flatItems.find((item) => item[itemID] === key))
          .filter((item): item is T => item !== undefined);
      }

      // Handle other iterable types
      return selectedKeysArray
        .map((key) => Array.from(items).find((item) => item[itemID] === key))
        .filter((item): item is T => item !== undefined);
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
        }
      },
      [isDisabled, isReadOnly, selectedKeys, onSelectionChange]
    );

    return (
      <ComboBoxValueSlot
        asChild
        alignItems="space-between"
        justifyContent="center"
        ref={ref}
      >
        <TagGroup.Root
          size={size}
          onRemove={
            isReadOnly || isDisabled ? undefined : handleRemoveSelectedItem
          }
          aria-label="Selected values"
          selectionMode="none"
          disabledKeys={isDisabled ? "all" : undefined}
        >
          <TagGroup.TagList
            items={selectedItems}
            dependencies={[itemID]}
            tabIndex={-1}
            maxW={"100%"}
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
                <TagGroup.Tag maxW={"100%"}>{item[itemValue]}</TagGroup.Tag>
              );
            }}
          </TagGroup.TagList>
        </TagGroup.Root>
      </ComboBoxValueSlot>
    );
  };
