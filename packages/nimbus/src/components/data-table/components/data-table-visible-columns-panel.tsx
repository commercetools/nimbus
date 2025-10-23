import { useEffect, useCallback, useState } from "react";
import { useIntl } from "react-intl";
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
import type { TColumnListItem } from "../data-table.types";
import { messages } from "../data-table.i18n";

export type DataTableManagerProps = {
  // /** Position of the settings button - can be a render prop for custom positioning */
  renderTrigger?: (props: { onClick: () => void }) => React.ReactNode;
};

// Type for items with onRemoveItem provided by DraggableList.Root
type TColumnListItemWithRemove = TColumnListItem & {
  onRemoveItem?: (key: Key) => void;
};

const VisibleColumnsPanel = ({
  hiddenItems,
  visibleItems,
  handleVisibleColumnsUpdate,
  handleResetColumns,
}: {
  hiddenItems: TColumnListItem[];
  visibleItems: TColumnListItem[];
  handleVisibleColumnsUpdate: (updatedItems: TColumnListItem[]) => void;
  handleResetColumns: () => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchedHiddenItems, setSearchedHiddenItems] = useState(hiddenItems);
  const { formatMessage } = useIntl();

  if (!hiddenItems || !visibleItems) {
    return null;
  }

  // Update searched items when hidden items change
  useEffect(() => {
    setSearchedHiddenItems(
      hiddenItems.filter((item) =>
        item.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
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
    (updatedSearchedItems: TColumnListItem[]) => {
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
    (updatedVisibleItems: TColumnListItem[]) => {
      // Simply pass through the updated list - this preserves the new order from reordering
      // or updates from drag-and-drop operations between lists
      handleVisibleColumnsUpdate(updatedVisibleItems);
    },
    [handleVisibleColumnsUpdate]
  );

  return (
    <Stack gap="400" mt="400">
      <SimpleGrid gap="400" width="100%" mb="800" columns={2}>
        {/* Hidden Columns Section */}
        <Box>
          <Stack direction="row" alignItems="center" mb="200">
            <VisibilityOff />
            <Text fontWeight="700" fontSize="sm" w="full">
              {formatMessage(messages.hiddenColumns)}
            </Text>
          </Stack>
          <Stack
            colorPalette="primary"
            border="{sizes.25} solid"
            borderColor="colorPalette.3"
            borderRadius="200"
            gap="200"
            p="400"
            h="full"
          >
            <SearchInput
              w="full"
              variant="ghost"
              placeholder={formatMessage(messages.searchHiddenColumns)}
              aria-label={formatMessage(messages.searchHiddenColumns)}
              onChange={handleSearch}
              value={searchValue}
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
              p="0"
              items={searchedHiddenItems}
              onUpdateItems={handleHiddenColumnsListUpdate}
              aria-label={formatMessage(messages.hiddenColumnsAriaLabel)}
              renderEmptyState={
                <Text fontSize="sm" color="gray.9">
                  {formatMessage(messages.noHiddenColumns)}
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
              {formatMessage(messages.visibleColumnsList)}
            </Text>
          </Stack>
          <DraggableList.Root
            p="400"
            removableItems
            h="full"
            items={visibleItems}
            onUpdateItems={handleVisibleColumnsListUpdate}
            aria-label={formatMessage(messages.visibleColumnsAria)}
          >
            {(item) => {
              // Cast to include onRemoveItem provided by DraggableList.Root when removableItems is true
              const itemWithRemove = item as TColumnListItemWithRemove;
              return (
                <DraggableList.Item
                  py="100"
                  key={itemWithRemove.id}
                  id={itemWithRemove.id}
                  onRemoveItem={itemWithRemove.onRemoveItem}
                  aria-label={
                    itemWithRemove.label?.toString() ?? itemWithRemove.id
                  }
                >
                  {itemWithRemove.label}
                </DraggableList.Item>
              );
            }}
          </DraggableList.Root>
        </Box>
      </SimpleGrid>

      {/* Reset Button */}
      <Box>
        <Button
          variant="ghost"
          tone="primary"
          size="md"
          onClick={handleResetColumns}
          aria-label={formatMessage(messages.reset)}
        >
          <Refresh />
          {formatMessage(messages.reset)}
        </Button>
      </Box>
    </Stack>
  );
};

export default VisibleColumnsPanel;
