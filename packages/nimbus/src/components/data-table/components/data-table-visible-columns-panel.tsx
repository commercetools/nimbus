import { useIntl } from "react-intl";
import { Button, Flex, DraggableList } from "@/components";
import { Stack, Box, Text } from "@chakra-ui/react";
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
  const { formatMessage } = useIntl();

  if (!hiddenItems || !visibleItems) {
    return null;
  }

  return (
    <Stack gap="400" mt="400">
      <Flex gap="400" width="100%" mb="800">
        {/* Hidden Columns Section */}
        <Box>
          <Stack direction="row" alignItems="center" mb="200">
            <VisibilityOff />
            <Text fontWeight="700" fontSize="sm">
              {formatMessage(messages.hiddenColumns)}
            </Text>
          </Stack>
          <DraggableList.Root
            h="full"
            items={hiddenItems}
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
            removableItems
            h="full"
            items={visibleItems}
            onUpdateItems={handleVisibleColumnsUpdate}
            aria-label={formatMessage(messages.visibleColumnsAria)}
          />
        </Box>
      </Flex>

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
