import { Box, Stack, Text } from "@commercetools/nimbus";
import { useNavigate } from "react-router-dom";
import { ALL_CATEGORIES, slugifyCategory, titleCase } from "./use-icon-data";

/**
 * The category filter rail shown in the Splitter's aside. It is always present
 * across the `/icons` space; selecting a category navigates to its page
 * (`/icons/category/:slug`) rather than mutating local state. `activeSlug` is
 * the currently-filtered category (or `ALL_CATEGORIES`), and `null` while an
 * icon detail page is open (no category is highlighted then).
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

  return (
    <Stack as="nav" aria-label="Filter icons by category" gap="0" p="400">
      <Text textStyle="sm" fontWeight="600" color="neutral.11" mb="200">
        Categories
      </Text>
      <CategoryItem
        label="All"
        count={totalCount}
        active={activeSlug === ALL_CATEGORIES}
        onSelect={() => navigate("/icons")}
      />
      {categories.map(({ name, count }) => (
        <CategoryItem
          key={name}
          label={titleCase(name)}
          count={count}
          active={slugifyCategory(name) === activeSlug}
          onSelect={() => navigate(`/icons/category/${slugifyCategory(name)}`)}
        />
      ))}
    </Stack>
  );
};

/** A single selectable row in the category filter rail. */
const CategoryItem = ({
  label,
  count,
  active,
  onSelect,
}: {
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) => (
  <Box
    as="button"
    onClick={onSelect}
    aria-pressed={active}
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
    bg={active ? "primary.3" : "transparent"}
    color={active ? "primary.11" : "neutral.11"}
    fontWeight={active ? "600" : "400"}
    _hover={{ bg: active ? "primary.3" : "neutral.2" }}
  >
    <Text textStyle="sm" truncate>
      {label}
    </Text>
    <Text textStyle="xs" color="neutral.10">
      {count}
    </Text>
  </Box>
);
