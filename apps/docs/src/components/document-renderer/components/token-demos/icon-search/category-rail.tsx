import { ListBox, Stack, Text } from "@commercetools/nimbus";
import type { Selection } from "react-aria-components";
import { useMemo } from "react";
import { ALL_CATEGORIES, slugifyCategory, titleCase } from "./use-icon-data";
import { useIconRouteState } from "./use-icon-route-state";

type CategoryOption = { id: string; label: string; count: number };

/**
 * The category filter rail shown in the Splitter's aside. It is always present
 * across the `/icons` space; selecting a category sets the `?category=` filter
 * (via `useIconRouteState`) rather than mutating local state. The active
 * category comes from the URL — `ALL_CATEGORIES` ("all") on the `/icons` root,
 * which highlights the "All" option.
 *
 * Rendered as a single-select Nimbus `ListBox` so the rail is one Tab stop:
 * Tab moves focus in/out, Up/Down (+ Home/End + typeahead) move between
 * categories, and Enter/Space selects. The selected option is the active
 * category; selecting one updates the URL.
 */
export const CategoryRail = ({
  categories,
  totalCount,
}: {
  categories: { name: string; count: number }[];
  totalCount: number;
}) => {
  const { category, goToCategory } = useIconRouteState();

  const items = useMemo<CategoryOption[]>(
    () => [
      { id: ALL_CATEGORIES, label: "All", count: totalCount },
      ...categories.map(({ name, count }) => ({
        id: slugifyCategory(name),
        label: titleCase(name),
        count,
      })),
    ],
    [categories, totalCount]
  );

  const handleSelectionChange = (keys: Selection) => {
    // Single selection → a Set with one key. `disallowEmptySelection` keeps the
    // URL in sync (you can't deselect into a no-category state via the rail).
    const key = keys === "all" ? undefined : [...keys][0];
    if (key == null) return;
    // `goToCategory` stays on the grid path (dropping any open dialog) and
    // preserves the other filters; selecting "all" clears the `?category=` param.
    goToCategory(String(key));
  };

  return (
    <Stack gap="200" p="400">
      <Text textStyle="sm" fontWeight="600" color="neutral.11">
        Categories
      </Text>
      <ListBox.Root
        aria-label="Filter icons by category"
        variant="plain"
        size="sm"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[category]}
        onSelectionChange={handleSelectionChange}
        items={items}
      >
        {(item) => (
          <ListBox.Item
            id={item.id}
            textValue={item.label}
            trailing={
              <Text textStyle="xs" color="neutral.10">
                {item.count}
              </Text>
            }
          >
            {item.label}
          </ListBox.Item>
        )}
      </ListBox.Root>
    </Stack>
  );
};
