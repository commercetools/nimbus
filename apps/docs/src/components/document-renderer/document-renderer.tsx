import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtomValue } from "jotai";
import { MdxStringRenderer } from "./mdx-string-renderer.tsx";
import { Box, Button, Flex, Stack, Text } from "@bleh-ui/react";
import { components } from "./components";
import { BreadcrumbNav } from "../breadcrumb";
import { GithubRepoLink } from "../github-repo-link.tsx";
import { MdxEditor } from "../mdx-editor";
import { VsCodeEditLink } from "../vs-code-edit-link.tsx";
import { DevOnly } from "../dev-only.tsx";
import { useEffect, useState } from "react";
import { Pencil, PencilOff } from "@bleh-ui/icons";
import { Helmet } from "react-helmet-async";
import { TrashDocumentLink } from "../trash-document-link.tsx";
import { brandNameAtom } from "@/atoms/brand";

export const DocumentRenderer = () => {
  const brandName = useAtomValue(brandNameAtom);
  const activeDoc = useAtomValue(activeDocAtom);
  const [editMode, setEditMode] = useState(false);

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
      <Box width="100%" maxWidth="960px" mx="">
        <Stack gap="4">
          <Flex alignItems="center">
            <Box>
              <BreadcrumbNav />
            </Box>
            <Box flexGrow="1" />
            <Box>
              <Stack direction="row" gap="4" alignItems="center">
                <DevOnly>
                  <Button
                    size="xs"
                    variant="plain"
                    mr="-2.5"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {!editMode && <Pencil size="1em" />}
                    {editMode && <PencilOff size="1em" />}
                  </Button>
                  <TrashDocumentLink filePath={meta.filePath} />
                  <VsCodeEditLink filePath={meta.filePath} />
                </DevOnly>
                <GithubRepoLink repoPath={meta.repoPath} />
              </Stack>
            </Box>
          </Flex>

          <Box>
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
