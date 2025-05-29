import { useMemo, type ForwardedRef } from "react";
import { type Key } from "react-aria-components";

import { TagGroup } from "@/components";

import type { ComboBoxMultiSelectRootProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const MultiSelectValue = fixedForwardRef(
  <T extends object>(
    {
      selectedKeys = new Set(),
      items,
      itemID = "id",
      itemText = "name",
      setSelectedKeys,
      ...props
    }: ComboBoxMultiSelectRootProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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

        setSelectedKeys(newSelectedKeys);
      }
    };
    return (
      <ComboBoxValueSlot
        asChild
        alignItems="space-between"
        justifyContent="center"
      >
        <TagGroup.Root
          size="md"
          onRemove={handleRemoveSelectedItem}
          aria-label="nimbus-combobox"
          selectionMode="none"
        >
          <TagGroup.TagList
            items={selectedItems}
            renderEmptyState={() => "search.."}
          >
            {(item) => <TagGroup.Tag>{item[itemText]}</TagGroup.Tag>}
          </TagGroup.TagList>
        </TagGroup.Root>
      </ComboBoxValueSlot>
    );
  }
);
