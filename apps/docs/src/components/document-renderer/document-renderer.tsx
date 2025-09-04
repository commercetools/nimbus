import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Flex, Stack, Text, Badge } from "@commercetools/nimbus";
import { BreadcrumbNav } from "../navigation/breadcrumb";
import { memo } from "react";
import { brandNameAtom } from "@/atoms/brand";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";

const DocumentRendererComponent = () => {
  const brandName = useAtomValue(brandNameAtom);
  const activeDoc = useAtomValue(activeDocAtom);

  const content = activeDoc?.mdx;
  const meta = activeDoc?.meta;

  const lifecycleState = meta?.lifecycleState;
  const lifecycleInfo = lifecycleState
    ? lifecycleStateDescriptions[lifecycleState]
    : null;

  if (!content || !meta)
    return (
      <Box>
        <Text fontWeight="700">404 - This page does not exist.</Text>
      </Box>
    );

  return (
    <>
      <title>
        {[...meta.menu].join(" > ")} | {brandName}
      </title>
      <Box width="full" maxWidth="4xl">
        <Stack gap="400">
          <Flex
            height="46px"
            alignItems="center"
            justifyContent="space-between"
          >
            <BreadcrumbNav />
            {lifecycleInfo && (
              <Badge size="xs" colorPalette={lifecycleInfo.colorPalette}>
                {lifecycleInfo.label}
              </Badge>
            )}
          </Flex>

          <Box pb="2400">
            <MdxStringRenderer content={content} />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const DocumentRenderer = memo(DocumentRendererComponent);
