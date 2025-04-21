import { activeDocAtom } from "@/src/atoms/active-doc.ts";
import { useAtom, useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Flex, Stack, Text } from "@commercetools/nimbus";
import { components } from "./components";
import { BreadcrumbNav } from "../navigation/breadcrumb";
import { MdxEditor } from "./mdx-editor";
import { useEffect, memo, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { brandNameAtom } from "@/src/atoms/brand";
import { documentEditModeAtom } from "@/src/atoms/document-edit-mode.ts";
import { DocumentTitle } from "./components/document-title";

const DocumentRendererComponent = () => {
  const brandName = useAtomValue(brandNameAtom);
  const activeDoc = useAtomValue(activeDocAtom);
  const [editMode, setEditMode] = useAtom(documentEditModeAtom);

  useEffect(() => {
    setEditMode(false);
  }, [activeDoc]);

  const content = activeDoc?.mdx;
  const meta = activeDoc?.meta;

  // Extract the first h1 heading as the document title
  const { title, contentWithoutTitle } = useMemo(() => {
    if (!content) return { title: "", contentWithoutTitle: "" };

    // Regular expression to match the first # heading
    const titleMatch = content.match(/^#\s+(.+?)(?:\n|$)/m);
    if (titleMatch) {
      const title = titleMatch[1];
      // Remove the first heading from the content
      const contentWithoutTitle = content.replace(titleMatch[0], "");
      return { title, contentWithoutTitle };
    }

    return { title: meta?.title || "", contentWithoutTitle: content };
  }, [content, meta]);

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
              <>
                <DocumentTitle title={title} />
                <MdxStringRenderer
                  content={contentWithoutTitle}
                  components={components}
                />
              </>
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

export const DocumentRenderer = memo(DocumentRendererComponent);
