import { documentEditModeAtom } from "@/src/atoms/document-edit-mode";
import { FigmaLink } from "@/src/components/utils/figma-link";
import { GithubRepoLink } from "@/src/components/utils/github-repo-link";
import { TrashDocumentLink } from "@/src/components/utils/trash-document-link";
import { VsCodeEditLink } from "@/src/components/utils/vs-code-edit-link";
import { useUpdateDocument } from "@/src/hooks/useUpdateDocument";
import { Edit, EditOff } from "@commercetools/nimbus-icons";
import { Box, IconButton, Stack } from "@commercetools/nimbus";
import { useAtom } from "jotai";

export const DocumentActionButtons = () => {
  const { meta } = useUpdateDocument();
  const [editMode, setEditMode] = useAtom(documentEditModeAtom);

  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        size="xs"
        variant="ghost"
        onClick={() => setEditMode(!editMode)}
      >
        {!editMode && <Edit />}
        {editMode && <EditOff />}
      </IconButton>

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
