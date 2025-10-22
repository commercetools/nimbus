import { useEffect, useCallback } from "react";
import { useIntl } from "react-intl";
import { useListData } from "react-stately";
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
import { useState } from "react";

export type DataTableManagerProps = {
  // /** Position of the settings button - can be a render prop for custom positioning */
  renderTrigger?: (props: { onClick: () => void }) => React.ReactNode;
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
  const visibleItemsList = useListData({ initialItems: visibleItems });
  const hiddenItemsList = useListData({ initialItems: hiddenItems });
  const [searchValue, setSearchValue] = useState("");
  const [searchedHiddenItems, setSearchedHiddenItems] = useState(hiddenItems);
  const { formatMessage } = useIntl();

  if (!hiddenItems || !visibleItems) {
    return null;
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    setSearchedHiddenItems(
      hiddenItemsList.items.filter((item) =>
        item.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, hiddenItemsList.items]);

  const handleRemoveItem = useCallback(
    (key: string) => {
      const item = visibleItemsList.getItem(key);
      if (item) {
        hiddenItemsList.append(item);
        setSearchedHiddenItems([...hiddenItemsList.items]);
      }
      visibleItemsList.remove(key);
    },
    [visibleItemsList.remove, searchedHiddenItems]
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
            items={visibleItemsList.items}
            onUpdateItems={handleVisibleColumnsUpdate}
            aria-label={formatMessage(messages.visibleColumnsAria)}
          >
            {(item) => (
              <DraggableList.Item
                py="100"
                key={item.id}
                id={item.id}
                onRemoveItem={() => handleRemoveItem(item.id)}
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
