import { Box, Stack, Text, LoadingSpinner } from "@commercetools/nimbus";
import { useState, useEffect, useMemo } from "react";
import type { ComponentDoc } from "react-docgen-typescript";
import { loadComponentType } from "../../../../../atoms/types.ts";
import { useManifest } from "../../../../../contexts/manifest-context";
import type { PropItem } from "../types";
import { groupProps } from "../utils";
import { PROP_GROUPS, DEFAULT_EXPANDED } from "../constants";
import { StylePropsSupportBanner } from "./style-props-banner";
import { CollapsiblePropsCategory } from "./collapsible-props-category";

// ============================================================
// MAIN COMPONENT
// ============================================================

export const ComponentPropsTable = ({ id }: { id: string }) => {
  const { typesManifest, isLoading: isManifestLoading } = useManifest();

  // State for async loading
  const [propsTableData, setPropsTableData] = useState<ComponentDoc | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load component type data when manifest is ready
  useEffect(() => {
    if (isManifestLoading) return; // Wait for manifest to load

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    loadComponentType(id, typesManifest)
      .then((data) => {
        if (!cancelled) {
          setPropsTableData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load component types");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, typesManifest, isManifestLoading]);

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
  // Use metadata from types.json instead of checking props
  const supportsStyleProps = propsTableData?.supportsStyleProps ?? false;

  // Group props into categories (automatically filters out style props)
  const groupedProps = useMemo(() => {
    return groupProps(propsArr);
  }, [propsArr]);

  // Loading state
  if (isLoading) {
    return (
      <Box
        padding="600"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <LoadingSpinner size="md" />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box padding="400" backgroundColor="critical.subtle" borderRadius="4">
        <Text color="critical.emphasized">
          Error loading component types: {error}
        </Text>
      </Box>
    );
  }

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

  // No props found - show style props banner if supported, or message
  if (propsArr.length === 0) {
    return (
      <Stack direction="column" gap="0">
        {/* Show banner if component supports Chakra UI style props */}
        {supportsStyleProps && <StylePropsSupportBanner />}

        {/* Show message only if no style props support */}
        {!supportsStyleProps && (
          <Text>No component-specific props found for this component.</Text>
        )}
      </Stack>
    );
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
