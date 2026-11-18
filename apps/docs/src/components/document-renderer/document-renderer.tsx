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
import { useManifest } from "@/contexts/manifest-context";
import { RelatedDocuments } from "./components/related-documents";
import { ViewLabelContext } from "./view-label-context";

const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
} as const;

// Constant empty array to prevent creating new references on every render
const EMPTY_TABS: TabMetadata[] = [];

const DocumentRendererComponent = () => {
  const brandName = useAtomValue(brandNameAtom);
  const { doc: activeDoc, isLoading, error } = useActiveDoc();
  const activeView = useActiveView();
  const { routeManifest } = useManifest();

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

  const activeViewKey = activeView ?? tabs[0]?.key ?? "overview";

  // The tab label tells the `h2` tag which heading only repeats the tab.
  const viewLabel = hasMultipleViews
    ? tabs.find((tab) => tab.key === activeViewKey)?.title
    : undefined;

  const lifecycleState = meta?.lifecycleState;
  // The header (title, description, links, illustration) is shown on every
  // `app-frame` page. `wide` and `no-sidebar` pages keep their own heading and
  // only get it when they have several views.
  const showHeader = meta?.layout === "app-frame" || hasMultipleViews;
  const illustration = routeManifest?.routes.find(
    (route) => route.id === meta?.id
  )?.illustrations[0];

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
      {/* The page fills its column. Paragraphs and lists limit their own width. */}
      <Box width="full">
        <Stack gap="400">
          {!showHeader && lifecycleInfo && (
            <Flex alignItems="center" justifyContent="flex-end">
              <Badge size="xs" colorPalette={lifecycleInfo.colorPalette}>
                {lifecycleInfo.label}
              </Badge>
            </Flex>
          )}

          {showHeader && (
            <DocMetadata
              title={meta.title}
              description={meta.description}
              lifecycleState={meta.lifecycleState}
              figmaLink={meta.figmaLink}
              storybookLink={meta.storybookLink}
              githubLink={meta.githubLink}
              illustration={illustration}
            />
          )}

          {/* Show tabs if multiple views are available */}
          {hasMultipleViews && <ViewTabs tabs={tabs} />}

          <Box
            css={{
              // The first `h2` that repeats the tab label stays in the page
              // for screen readers and anchors but is not shown.
              "& > h2[data-view-title]:first-of-type": visuallyHiddenStyle,
              // Keep the space the heading gave to the content below it.
              "& > h2[data-view-title]:first-of-type + *": { mt: "600" },
            }}
          >
            <ViewLabelContext.Provider value={viewLabel}>
              <MdxStringRenderer content={content} />
            </ViewLabelContext.Provider>
          </Box>

          {/* Related content comes after the page, so it does not interrupt
              the text. */}
          {showHeader && (
            <Box
              mt="2400"
              pt="800"
              borderTop="1px solid"
              borderColor="neutral.6"
            >
              <RelatedDocuments />
            </Box>
          )}

          <Box pb="2400" />
        </Stack>
      </Box>
    </>
  );
};

export const DocumentRenderer = memo(DocumentRendererComponent);
