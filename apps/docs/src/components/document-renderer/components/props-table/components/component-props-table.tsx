import { Box, Stack, Text } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { typesAtom } from "../../../../../atoms/types.ts";
import type { PropItem } from "../types";
import { hasChakraStyleProps, groupProps } from "../utils";
import { PROP_GROUPS, DEFAULT_EXPANDED } from "../constants";
import { StylePropsSupportBanner } from "./style-props-banner";
import { CollapsiblePropsCategory } from "./collapsible-props-category";

// ============================================================
// MAIN COMPONENT
// ============================================================

export const ComponentPropsTable = ({ id }: { id: string }) => {
  // Get all type definitions from global atom
  const typesArr = useAtomValue(typesAtom);

  // Find the type definition for this specific component
  const propsTableData = useMemo(() => {
    return typesArr.find((v) => v.displayName === id);
  }, [typesArr, id]);

  // Convert props object to array for easier manipulation
  const propsArr = useMemo<PropItem[]>(() => {
    if (!propsTableData?.props) return [];

    return Object.keys(propsTableData.props).map((key) => {
      const prop =
        propsTableData.props[key as keyof typeof propsTableData.props];
      return {
        ...prop,
      } as PropItem;
    });
  }, [propsTableData]);

  // Check if component supports Chakra UI style props
  const supportsStyleProps = useMemo(() => {
    return hasChakraStyleProps(propsArr);
  }, [propsArr]);

  // Group props into categories (automatically filters out style props)
  const groupedProps = useMemo(() => {
    return groupProps(propsArr);
  }, [propsArr]);

  // Component not found - show error
  if (!propsTableData) {
    return (
      <Box padding="400" backgroundColor="critical.subtle" borderRadius="4">
        <Text color="critical.emphasized">
          Error: Component with ID "{id}" not found.
        </Text>
      </Box>
    );
  }

  // No props found - show message
  if (propsArr.length === 0) {
    return <Text>No props found for this component.</Text>;
  }

  // Render style props banner (if supported) and grouped collapsible categories
  return (
    <Stack direction="column" gap="0">
      {/* Show banner if component supports Chakra UI style props */}
      {supportsStyleProps && <StylePropsSupportBanner />}

      {/* Render all prop categories dynamically in order */}
      {PROP_GROUPS.sort((a, b) => a.order - b.order).map((group) => (
        <CollapsiblePropsCategory
          key={group.category}
          category={group.category}
          displayName={group.displayName}
          props={groupedProps[group.category]}
          componentId={id}
          isDefaultExpanded={DEFAULT_EXPANDED.has(group.category)}
        />
      ))}
    </Stack>
  );
};
