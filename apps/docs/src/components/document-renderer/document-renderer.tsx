import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtom, useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Button, Flex, Stack, Text } from "@bleh-ui/react";
import { components } from "./components";
import { BreadcrumbNav } from "../navigation/breadcrumb";
import { GithubRepoLink } from "../utils/github-repo-link.tsx";
import { MdxEditor } from "./mdx-editor";
import { VsCodeEditLink } from "../utils/vs-code-edit-link.tsx";
import { DevOnly } from "../utils/dev-only.tsx";
import { useEffect, useState } from "react";
import { Pencil, PencilOff } from "@bleh-ui/icons";
import { Helmet } from "react-helmet-async";
import { TrashDocumentLink } from "../utils/trash-document-link.tsx";
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
        <Text fontWeight="bold">404 - This page does not exist.</Text>
      </Box>
    );

  return (
    <>
      <Helmet>
        <title>
          {[...meta.menu].join(" > ")} | {brandName}
        </title>
      </Helmet>
      <Box width="100%" maxWidth="960px">
        <Stack gap="4">
          {!editMode && (
            <Flex height="46px" alignItems="center">
              <BreadcrumbNav />
            </Flex>
          )}

          <Box pb="24">
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
