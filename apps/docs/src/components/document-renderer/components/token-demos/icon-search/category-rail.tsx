import { Box, ListBox, Text } from "@commercetools/nimbus";
import type { Selection } from "react-aria-components";
import { useId, useMemo } from "react";
import { ALL_CATEGORIES, slugifyCategory, titleCase } from "./use-icon-data";
import { useIconRouteState } from "./use-icon-route-state";

type CategoryOption = { id: string; label: string; count: number };

/**
 * The category list of the Icons page. The page has no site menu, so this
 * list takes the place of the menu: same column, same group title style.
 *
 * Each count is the number of results in that category for the current
 * search and keyword, so a reader sees where the matches are. A category
 * without results cannot be selected, except the selected one, so the list
 * never leads to an empty grid.
 *
 * A single-select `ListBox`, so the list is one Tab stop: arrow keys move
 * between categories and Enter or Space selects. The selection is the
 * `?category=` URL parameter.
 */
export const CategoryRail = ({
  categories,
  counts,
  allCount,
  onSelect,
}: {
  /** Every category, in a fixed order (most icons first). */
  categories: { name: string; count: number }[];
  /** Results per category slug for the current search and keyword. */
  counts: Map<string, number>;
  /** Results in all categories for the current search and keyword. */
  allCount: number;
  /** Called after a category is selected (closes the drawer on narrow screens). */
  onSelect?: () => void;
}) => {
  const { category, goToCategory } = useIconRouteState();
  // The list is rendered twice (left column and drawer), so the id is unique.
  const titleId = useId();

  const items = useMemo<CategoryOption[]>(
    () => [
      { id: ALL_CATEGORIES, label: "All icons", count: allCount },
      ...categories.map(({ name }) => {
        const id = slugifyCategory(name);
        return { id, label: titleCase(name), count: counts.get(id) ?? 0 };
      }),
    ],
    [categories, counts, allCount]
  );

  const disabledKeys = useMemo(
    () =>
      items
        .filter((item) => item.count === 0 && item.id !== category)
        .map((item) => item.id),
    [items, category]
  );

  const handleSelectionChange = (keys: Selection) => {
    const key = keys === "all" ? undefined : [...keys][0];
    if (key == null) return;
    goToCategory(String(key));
    onSelect?.();
  };

  return (
    <Box ml="100">
      <Text
        id={titleId}
        display="block"
        color="neutral.12"
        fontWeight="700"
        px="400"
        py="100"
        mb="300"
      >
        Categories
      </Text>
      <Box px="200">
        <ListBox.Root
          aria-labelledby={titleId}
          variant="plain"
          size="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[category]}
          disabledKeys={disabledKeys}
          onSelectionChange={handleSelectionChange}
          items={items}
        >
          {(item) => (
            <ListBox.Item
              id={item.id}
              textValue={item.label}
              trailing={
                // A plain span: a `Text` here would take React Aria's label
                // slot, and the count would become the name of the option.
                <Box
                  as="span"
                  textStyle="xs"
                  color="neutral.10"
                  css={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {item.count}
                </Box>
              }
            >
              {item.label}
            </ListBox.Item>
          )}
        </ListBox.Root>
      </Box>
    </Box>
  );
};
