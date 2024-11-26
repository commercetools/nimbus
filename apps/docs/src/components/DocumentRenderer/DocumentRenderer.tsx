import { activeDocAtom } from "../../atoms/activeDoc";
import { useAtomValue } from "jotai";
import { MdxStringRenderer } from "../MdxStringRenderer";
import { Box, Button, Flex, Stack, Text } from "@bleh-ui/react";
import { components } from "./components";
import { BreadcrumbNav } from "../Breadcrumb";
import { GithubRepoLink } from "../GithubRepoLink";
import { MdxEditor } from "../MdxEditor";
import { VsCodeEditLink } from "../VsCodeEditLink";
import { DevOnly } from "../DevOnly";
import { useEffect, useState } from "react";
import { Pencil, PencilOff } from "@bleh-ui/icons";
import { Helmet } from "react-helmet-async";
import { TrashDocumentLink } from "../TrashDocumentLink";

export const DocumentRenderer = () => {
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
        <title>{[...meta.menu].join(" > ")} | @bleh-ui/react</title>
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
