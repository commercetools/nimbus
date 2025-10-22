import { useIntl } from "react-intl";
import {
  Button,
  SimpleGrid,
  Stack,
  Box,
  Text,
  DraggableList,
  SearchInput,
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
  const [searchValue, setSearchValue] = useState("");
  const { formatMessage } = useIntl();

  if (!hiddenItems || !visibleItems) {
    return null;
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  console.log("searchValue", searchValue, {
    hiddenItems: hiddenItems.filter((item) =>
      item.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
    ),
  });

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
              boxShadow="none"
              borderRadius="0"
              borderBottom="1px solid {colors.neutral.3}"
              placeholder={formatMessage(messages.searchHiddenColumns)}
              onChange={handleSearch}
              value={searchValue}
            />
            <DraggableList.Root
              border="none"
              borderColor="none"
              h="full"
              p="0"
              items={hiddenItems.filter((item) =>
                item.label
                  ?.toString()
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )}
              // onUpdateItems={(updatedItems) => {
              // console.log("updatedItems", updatedItems);
              // setHiddenItems(updatedItems);
              // }}
              aria-label={formatMessage(messages.hiddenColumnsAriaLabel)}
              renderEmptyState={
                <Text fontSize="sm" color="gray.9">
                  {formatMessage(messages.noHiddenColumns)}
                </Text>
              }
            />
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
            onUpdateItems={handleVisibleColumnsUpdate}
            aria-label={formatMessage(messages.visibleColumnsAria)}
          />
        </Box>
      </SimpleGrid>

      {/* Reset Button */}
      <Box>
        <Button
          variant="ghost"
          tone="primary"
          size="md"
          onClick={handleResetColumns}
        >
          <Refresh />
          {formatMessage(messages.reset)}
        </Button>
      </Box>
    </Stack>
  );
};

export default VisibleColumnsPanel;
