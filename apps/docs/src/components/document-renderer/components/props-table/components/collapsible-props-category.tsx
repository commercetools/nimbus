import {
  Box,
  CollapsibleMotion,
  Stack,
  Text,
  Badge,
} from "@commercetools/nimbus";
import { useState } from "react";
import { PropsCategoryTable } from "./props-category-table";
import type { PropItem } from "../types";
import { ArrowForwardIos } from "@commercetools/nimbus-icons";

interface CollapsiblePropsCategoryProps {
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
          cursor="pointer"
          focusRing="outside"
        >
          <Stack direction="row" gap="300" alignItems="center">
            {/* Chevron icon */}
            <Box
              display="inline-flex"
              transform={isExpanded ? "rotate(90deg)" : "rotate(0deg)"}
              transition="transform 0.2s"
            >
              <ArrowForwardIos />
            </Box>

            {/* Category name */}
            <Text textStyle="lg" fontWeight="600" textTransform="capitalize">
              {displayName}
            </Text>
          </Stack>

          {/* Props count badge */}
          <Badge size="xs" tone="neutral" variant="subtle">
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
