import {
  Box,
  CollapsibleMotion,
  Stack,
  Text,
  Badge,
} from "@commercetools/nimbus";
import { useState } from "react";
import { PropsCategoryTable } from "./props-category-table";
import type { PropItem, PropCategory } from "../types";

interface CollapsiblePropsCategoryProps {
  /** Category identifier */
  category: PropCategory;
  /** Category display name */
  displayName: string;
  /** Props to display in this category */
  props: PropItem[];
  /** Component ID for table rendering */
  componentId: string;
  /** Whether this category should be expanded by default */
  isDefaultExpanded?: boolean;
}

/**
 * Renders a collapsible section for a prop category
 * Uses CollapsibleMotion for smooth expand/collapse animation
 */
export const CollapsiblePropsCategory = ({
  category,
  displayName,
  props,
  componentId,
  isDefaultExpanded = false,
}: CollapsiblePropsCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  // Don't render anything if there are no props in this category
  if (props.length === 0) {
    return null;
  }

  return (
    <Box mb="500">
      <CollapsibleMotion.Root
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
      >
        {/* Trigger button with category name and count badge */}
        <CollapsibleMotion.Trigger
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          padding="300 400"
          backgroundColor={isExpanded ? "neutral.2" : "neutral.1"}
          borderRadius="200"
          border="1px solid"
          borderColor="neutral.6"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            backgroundColor: "neutral.3",
            borderColor: "neutral.7",
          }}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "primary.9",
            outlineOffset: "2px",
          }}
        >
          <Stack direction="row" gap="300" alignItems="center">
            {/* Chevron icon */}
            <Box
              display="inline-flex"
              transform={isExpanded ? "rotate(90deg)" : "rotate(0deg)"}
              transition="transform 0.2s"
            >
              ▶
            </Box>

            {/* Category name */}
            <Text fontSize="450" fontWeight="600" textTransform="capitalize">
              {displayName}
            </Text>
          </Stack>

          {/* Props count badge */}
          <Badge size="sm" tone="neutral" variant="subtle">
            {props.length}
          </Badge>
        </CollapsibleMotion.Trigger>

        {/* Collapsible content with props table */}
        <CollapsibleMotion.Content>
          <Box mt="300">
            <PropsCategoryTable
              props={props}
              componentId={componentId}
              categoryTitle={displayName}
            />
          </Box>
        </CollapsibleMotion.Content>
      </CollapsibleMotion.Root>
    </Box>
  );
};
