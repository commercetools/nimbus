import { FigmaLink } from "@/components/utils/figma-link";
import { GithubRepoLink } from "@/components/utils/github-repo-link";
import { TrashDocumentLink } from "@/components/utils/trash-document-link";
import { VsCodeEditLink } from "@/components/utils/vs-code-edit-link";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";
import { Box, Stack } from "@commercetools/nimbus";

export const DocumentActionButtons = () => {
  const { meta } = useUpdateDocument();

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
