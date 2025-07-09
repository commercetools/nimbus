import { FigmaLink } from "@/components/utils/figma-link";
import { GithubRepoLink } from "@/components/utils/github-repo-link";
import { TrashDocumentLink } from "@/components/utils/trash-document-link";
import { VsCodeEditLink } from "@/components/utils/vs-code-edit-link";
import { Box, Stack } from "@commercetools/nimbus";
import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtomValue } from "jotai";

export const DocumentActionButtons = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const meta = activeDoc?.meta;

  return (
    <Stack direction="row" alignItems="center">
      {meta && (
        <>
          <TrashDocumentLink repoPath={meta.repoPath} />
          <Box flexGrow="1" />
          <VsCodeEditLink repoPath={meta.repoPath} />
          <GithubRepoLink repoPath={meta.repoPath} />
          <FigmaLink />
        </>
      )}
    </Stack>
  );
};
