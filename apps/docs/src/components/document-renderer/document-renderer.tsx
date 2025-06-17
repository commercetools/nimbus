import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtom, useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Flex, Stack, Text, Badge } from "@commercetools/nimbus";
import { BreadcrumbNav } from "../navigation/breadcrumb";
import { MdxEditor } from "./mdx-editor";
import { useEffect, memo } from "react";
import { Helmet } from "react-helmet-async";
import { brandNameAtom } from "@/atoms/brand";
import { documentEditModeAtom } from "@/atoms/document-edit-mode.ts";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";

const DocumentRendererComponent = () => {
  const brandName = useAtomValue(brandNameAtom);
  const activeDoc = useAtomValue(activeDocAtom);
  const [editMode, setEditMode] = useAtom(documentEditModeAtom);

  useEffect(() => {
    setEditMode(false);
  }, [activeDoc]);

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
      <Helmet>
        <title>
          {[...meta.menu].join(" > ")} | {brandName}
        </title>
      </Helmet>
      <Box width="full" maxWidth="4xl">
        <Stack gap="400">
          {!editMode && (
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
          )}

          <Box pb="2400">
            {!editMode && <MdxStringRenderer content={content} />}
            {editMode && (
              <MdxEditor
                meta={meta}
                markdown={content}
                onCloseRequest={() => setEditMode(false)}
              />
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const DocumentRenderer = memo(DocumentRendererComponent);
