import { useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Flex, Stack, Text, Badge } from "@commercetools/nimbus";
import { memo, useMemo } from "react";
import { brandNameAtom } from "@/atoms/brand";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";
import { useActiveDoc } from "@/hooks/useActiveDoc";

const DocumentRendererComponent = () => {
  const brandName = useAtomValue(brandNameAtom);
  const { doc: activeDoc, isLoading, error } = useActiveDoc();

  const content = activeDoc?.mdx;
  const meta = activeDoc?.meta;

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
          {lifecycleInfo && (
            <Flex alignItems="center" justifyContent="flex-end">
              <Badge size="xs" colorPalette={lifecycleInfo.colorPalette}>
                {lifecycleInfo.label}
              </Badge>
            </Flex>
          )}

          <Box pb="2400">
            <MdxStringRenderer content={content} />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const DocumentRenderer = memo(DocumentRendererComponent);
