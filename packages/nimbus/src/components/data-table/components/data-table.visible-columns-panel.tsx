import { useCallback, useState, useMemo } from "react";
import { useLocale } from "react-aria-components";
import type { Key } from "react-aria-components";
import {
  Button,
  SimpleGrid,
  Stack,
  Box,
  Text,
  DraggableList,
  SearchInput,
  Separator,
} from "@/components";
import {
  Refresh,
  VisibilityOff,
  Visibility,
} from "@commercetools/nimbus-icons";
import type { ColumnManagerListItem } from "../data-table.types";
import { dataTableMessages } from "../data-table.messages";

// Type for items with onRemoveItem provided by DraggableList.Root
type TColumnListItemWithRemove = ColumnManagerListItem & {
  onRemoveItem?: (key: Key) => void;
};

// Type guard to check if item has onRemoveItem
function hasRemoveItem(
  item: ColumnManagerListItem
): item is TColumnListItemWithRemove {
  return "onRemoveItem" in item && typeof item.onRemoveItem === "function";
}

export const VisibleColumnsPanel = ({
  hiddenItems,
  visibleItems,
  handleVisibleColumnsUpdate,
  handleResetColumns,
}: {
  hiddenItems: ColumnManagerListItem[];
  visibleItems: ColumnManagerListItem[];
  handleVisibleColumnsUpdate: (updatedItems: ColumnManagerListItem[]) => void;
  handleResetColumns: () => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { locale } = useLocale();

  if (!hiddenItems || !visibleItems) {
    return null;
  }

  // Derive searched items from hiddenItems and searchValue using useMemo
  // This ensures searchedHiddenItems is always in sync on every render
  const searchedHiddenItems = useMemo(() => {
    return hiddenItems.filter((item) =>
      item.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [hiddenItems, searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  /**
   * Handles updates to the hidden columns list when items are dragged between lists
   * updatedSearchedItems - The updated list of items in the hidden columns (filtered by search)
   */
  const handleHiddenColumnsListUpdate = useCallback(
    (updatedSearchedItems: ColumnManagerListItem[]) => {
      const currentHiddenIds = new Set(hiddenItems.map((item) => item.id));
      const updatedSearchedIds = new Set(
        updatedSearchedItems.map((item) => item.id)
      );

      // Find items that were removed from hidden (dragged to visible)
      const removedFromHidden = hiddenItems.filter(
        (item) => !updatedSearchedIds.has(item.id)
      );

      // Find items that were added to hidden (dragged from visible)
      const addedToHidden = updatedSearchedItems.filter(
        (item) => !currentHiddenIds.has(item.id)
      );

      // Calculate new visible items list
      let newVisibleItems = [...visibleItems];

      // Items removed from hidden should be added to visible
      if (removedFromHidden.length > 0) {
        newVisibleItems = [...newVisibleItems, ...removedFromHidden];
      }

      // Items added to hidden should be removed from visible
      if (addedToHidden.length > 0) {
        const addedIds = new Set(addedToHidden.map((item) => item.id));
        newVisibleItems = newVisibleItems.filter(
          (item) => !addedIds.has(item.id)
        );
      }

      // Update parent with new visible items
      handleVisibleColumnsUpdate(newVisibleItems);
    },
    [hiddenItems, visibleItems, handleVisibleColumnsUpdate]
  );

  /**
   * Handles updates to the visible columns list when items are:
   * - Reordered within the list
   * - Dragged from hidden to visible
   * - Dragged from visible to hidden
   * - Removed via the remove button (handled by DraggableList.Root)
   * updatedVisibleItems - The updated list of visible column items with new order/content
   */
  const handleVisibleColumnsListUpdate = useCallback(
    (updatedVisibleItems: ColumnManagerListItem[]) => {
      // Simply pass through the updated list - this preserves the new order from reordering
      // or updates from drag-and-drop operations between lists
      handleVisibleColumnsUpdate(updatedVisibleItems);
    },
    [handleVisibleColumnsUpdate]
  );

  return (
    <Stack mt="800">
      <SimpleGrid gap="400" width="100%" columns={2}>
        {/* Hidden Columns Section */}
        <Box>
          <Stack direction="row" alignItems="center" mb="200">
            <VisibilityOff />
            <Text fontWeight="700" fontSize="sm" w="full">
              {dataTableMessages.getStringForLocale("hiddenColumns", locale)}
            </Text>
          </Stack>
          <Stack
            colorPalette="primary"
            border="{sizes.25} solid"
            borderColor="colorPalette.3"
            borderRadius="200"
            gap="200"
            p="300"
            h="lg"
          >
            <SearchInput
              w="full"
              size="sm"
              variant="ghost"
              placeholder={dataTableMessages.getStringForLocale(
                "searchHiddenColumns",
                locale
              )}
              aria-label={dataTableMessages.getStringForLocale(
                "searchHiddenColumns",
                locale
              )}
              onChange={handleSearch}
              value={searchValue}
              data-testid="search-hidden-columns"
            />
            <Separator
              colorPalette="primary"
              border="{sizes.25} solid"
              borderColor="colorPalette.3"
            />
            <DraggableList.Root
              border="none"
              borderColor="none"
              h="full"
              w="full"
              overflowY="auto"
              items={searchedHiddenItems}
              onUpdateItems={handleHiddenColumnsListUpdate}
              aria-label={dataTableMessages.getStringForLocale(
                "hiddenColumnsAriaLabel",
                locale
              )}
              data-testid="hidden-columns-list"
              renderEmptyState={
                <Text fontSize="sm" color="gray.9">
                  {dataTableMessages.getStringForLocale(
                    "noHiddenColumns",
                    locale
                  )}
                </Text>
              }
            >
              {(item) => (
                <DraggableList.Item
                  py="100"
                  key={item.id}
                  id={item.id}
                  aria-label={item.label?.toString() ?? item.id}
                >
                  {item.label}
                </DraggableList.Item>
              )}
            </DraggableList.Root>
          </Stack>
        </Box>

        {/* Visible Columns Section */}
        <Box>
          <Stack direction="row" alignItems="center" mb="200">
            <Visibility />
            <Text fontWeight="700" fontSize="sm">
              {dataTableMessages.getStringForLocale(
                "visibleColumnsList",
                locale
              )}
            </Text>
          </Stack>
          <DraggableList.Root
            removableItems
            p="300"
            h="lg"
            overflowY="auto"
            items={visibleItems}
            onUpdateItems={handleVisibleColumnsListUpdate}
            aria-label={dataTableMessages.getStringForLocale(
              "visibleColumnsAria",
              locale
            )}
            data-testid="visible-columns-list"
          >
            {(item) => (
              <DraggableList.Item
                py="100"
                key={item.id}
                id={item.id}
                onRemoveItem={
                  hasRemoveItem(item) ? item.onRemoveItem : undefined
                }
                aria-label={item.label?.toString() ?? item.id}
              >
                {item.label}
              </DraggableList.Item>
            )}
          </DraggableList.Root>
        </Box>
      </SimpleGrid>

      {/* Reset Button */}
      <Box>
        <Button
          variant="ghost"
          colorPalette="primary"
          size="xs"
          onClick={handleResetColumns}
          aria-label={dataTableMessages.getStringForLocale("reset", locale)}
        >
          <Refresh />
          {dataTableMessages.getStringForLocale("reset", locale)}
        </Button>
      </Box>
    </Stack>
  );
};
