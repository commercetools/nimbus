import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtom, useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Flex, Stack, Text } from "@nimbus/react";
import { components } from "./components";
import { BreadcrumbNav } from "../navigation/breadcrumb";
import { MdxEditor } from "./mdx-editor";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { brandNameAtom } from "@/atoms/brand";
import { documentEditModeAtom } from "@/atoms/document-edit-mode.ts";

export const DocumentRenderer = () => {
  const brandName = useAtomValue(brandNameAtom);
  const activeDoc = useAtomValue(activeDocAtom);
  const [editMode, setEditMode] = useAtom(documentEditModeAtom);

  useEffect(() => {
    setEditMode(false);
  }, [activeDoc]);

  const content = activeDoc?.mdx;
  const meta = activeDoc?.meta;

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
            <Flex height="46px" alignItems="center">
              <BreadcrumbNav />
            </Flex>
          )}

          <Box pb="2400">
            {!editMode && (
              <MdxStringRenderer content={content} components={components} />
            )}
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
