import { useMemo } from "react";
import { type Key } from "react-aria-components";

import { TagGroup } from "@/components";

import type { ComboBoxMultiSelectValueProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";

export const MultiSelectValue =
  /* eslint-disable @typescript-eslint/no-explicit-any */
  <T extends Record<string, any>>({
    selectedKeys = new Set(),
    items,
    itemID = "id",
    itemValue = "name",
    onSelectionChange,
    ref,
  }: ComboBoxMultiSelectValueProps<T>) => {
    const selectedItems = useMemo(() => {
      return [...selectedKeys]
        .map((key) =>
          items
            ? Array.from(items).find((item) => item[itemID] === key)
            : undefined
        )
        .filter((item): item is T => item !== undefined);
    }, [items, selectedKeys]);

    const handleRemoveSelectedItem = (key: Set<Key>) => {
      if (selectedKeys instanceof Set && key.isSubsetOf(selectedKeys)) {
        const newSelectedKeys = selectedKeys.difference(key);

        onSelectionChange?.(newSelectedKeys);
      }
    };
    return (
      <ComboBoxValueSlot
        asChild
        alignItems="space-between"
        justifyContent="center"
        ref={ref}
      >
        <TagGroup.Root
          size="md"
          onRemove={handleRemoveSelectedItem}
          aria-label="Selected values"
          selectionMode="none"
        >
          <TagGroup.TagList
            items={selectedItems}
            renderEmptyState={() => "search.."}
          >
            {(item) => <TagGroup.Tag>{item[itemValue]}</TagGroup.Tag>}
          </TagGroup.TagList>
        </TagGroup.Root>
      </ComboBoxValueSlot>
    );
  };
