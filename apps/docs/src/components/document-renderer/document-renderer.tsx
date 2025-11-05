import { useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Flex, Stack, Text, Badge } from "@commercetools/nimbus";
import { memo, useMemo } from "react";
import { brandNameAtom } from "@/atoms/brand";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";
import { useActiveDoc } from "@/hooks/useActiveDoc";
import { useActiveView } from "@/hooks/use-active-view";
import { ViewTabs } from "@/components/view-tabs";
import { DocMetadata } from "@/components/doc-metadata";
import type { TabMetadata } from "@/types";

// Constant empty array to prevent creating new references on every render
const EMPTY_TABS: TabMetadata[] = [];

const DocumentRendererComponent = () => {
  const brandName = useAtomValue(brandNameAtom);
  const { doc: activeDoc, isLoading, error } = useActiveDoc();
  const activeView = useActiveView();

  const meta = activeDoc?.meta;
  const tabs = meta?.tabs || EMPTY_TABS;
  const hasMultipleViews = tabs.length > 1;

  // Determine which content to show based on active view
  const content = useMemo(() => {
    if (!activeDoc) return undefined;

    // If a specific view is active and available in views object, use it
    if (activeView && activeDoc.views?.[activeView]) {
      return activeDoc.views[activeView].mdx;
    }

    // Fallback to first tab's view or main content
    const defaultViewKey = tabs[0]?.key || "overview";
    if (activeDoc.views?.[defaultViewKey]) {
      return activeDoc.views[defaultViewKey].mdx;
    }

    // Final fallback to main mdx content
    return activeDoc.mdx;
  }, [activeDoc, activeView, tabs]);

  const lifecycleState = meta?.lifecycleState;
  const lifecycleInfo = lifecycleState
    ? lifecycleStateDescriptions[lifecycleState]
    : null;

  const pageTitle = useMemo(() => {
    return meta?.menu
      ? `${[...meta.menu].reverse().join(" / ")} | ${brandName}`
      : `${brandName} | Home`;
  }, [meta?.menu, brandName]);

  // Don't show 404 while loading
  if (isLoading) {
    return null;
  }

  // Only show 404 if not loading and there's no content
  if (!content || !meta || error) {
    return (
      <Box>
        <Text fontWeight="700">404 - This page does not exist.</Text>
      </Box>
    );
  }

  return (
    <>
      <title>{pageTitle}</title>
      <Box width="full" maxWidth="4xl">
        <Stack gap="400">
          {!hasMultipleViews && lifecycleInfo && (
            <Flex alignItems="center" justifyContent="flex-end">
              <Badge size="xs" colorPalette={lifecycleInfo.colorPalette}>
                {lifecycleInfo.label}
              </Badge>
            </Flex>
          )}

          {/* Show metadata introduction if multiple views are available */}
          {hasMultipleViews && (
            <DocMetadata
              title={meta.title}
              description={meta.description}
              tags={meta.tags}
              lifecycleState={meta.lifecycleState}
              figmaLink={meta.figmaLink}
            />
          )}

          {/* Show tabs if multiple views are available */}
          {hasMultipleViews && <ViewTabs tabs={tabs} />}

          <Box pb="2400">
            <MdxStringRenderer content={content} />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const DocumentRenderer = memo(DocumentRendererComponent);
