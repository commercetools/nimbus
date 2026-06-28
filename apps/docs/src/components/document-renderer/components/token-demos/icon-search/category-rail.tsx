import { Box, Stack, Text } from "@commercetools/nimbus";
import { ListBox, ListBoxItem, type Selection } from "react-aria-components";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_CATEGORIES, slugifyCategory, titleCase } from "./use-icon-data";

type CategoryOption = { id: string; label: string; count: number };

/**
 * The category filter rail shown in the Splitter's aside. It is always present
 * across the `/icons` space; selecting a category navigates to its page
 * (`/icons/category/:slug`) rather than mutating local state. `activeSlug` is
 * the currently-filtered category (`ALL_CATEGORIES` on the `/icons` root); when
 * `null`, no option is highlighted.
 *
 * Rendered as a single-select React Aria `ListBox` so the rail is one Tab stop:
 * Tab moves focus in/out, Up/Down (+ Home/End + typeahead) move between
 * categories, and Enter/Space selects. The selected option is the active
 * category; selecting one navigates to its route.
 */
export const CategoryRail = ({
  categories,
  totalCount,
  activeSlug,
}: {
  categories: { name: string; count: number }[];
  totalCount: number;
  activeSlug: string | null;
}) => {
  const navigate = useNavigate();

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
    // route in sync (you can't deselect into a no-category state via the rail).
    const key = keys === "all" ? undefined : [...keys][0];
    if (key == null) return;
    navigate(key === ALL_CATEGORIES ? "/icons" : `/icons/category/${key}`);
  };

  return (
    <Stack gap="200" p="400">
      <Text textStyle="sm" fontWeight="600" color="neutral.11">
        Categories
      </Text>
      <ListBox
        aria-label="Filter icons by category"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={activeSlug ? [activeSlug] : []}
        onSelectionChange={handleSelectionChange}
        items={items}
      >
        {(item) => <CategoryItem item={item} />}
      </ListBox>
    </Stack>
  );
};

/** A single selectable row in the category filter rail. */
const CategoryItem = ({ item }: { item: CategoryOption }) => (
  <Box
    asChild
    display="flex"
    width="100%"
    justifyContent="space-between"
    alignItems="center"
    gap="200"
    px="300"
    py="200"
    borderRadius="200"
    cursor="pointer"
    textAlign="left"
    outline="none"
    color="neutral.11"
    css={{
      "&[data-hovered]:not([data-selected])": { backgroundColor: "neutral.2" },
      "&[data-selected]": {
        backgroundColor: "primary.3",
        color: "primary.11",
        fontWeight: "600",
      },
      "&[data-focus-visible]": { layerStyle: "focusRing" },
    }}
  >
    <ListBoxItem id={item.id} textValue={item.label}>
      <Text textStyle="sm" truncate>
        {item.label}
      </Text>
      <Text textStyle="xs" color="neutral.10">
        {item.count}
      </Text>
    </ListBoxItem>
  </Box>
);
