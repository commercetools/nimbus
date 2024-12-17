import { documentEditModeAtom } from "@/atoms/document-edit-mode";
import { FigmaLink } from "@/components/utils/figma-link";
import { GithubRepoLink } from "@/components/utils/github-repo-link";
import { TrashDocumentLink } from "@/components/utils/trash-document-link";
import { VsCodeEditLink } from "@/components/utils/vs-code-edit-link";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";
import { Pencil, PencilOff } from "@bleh-ui/icons";
import { Box, Button, Stack } from "@bleh-ui/react";
import { useAtom } from "jotai";

export const DocumentActionButtons = () => {
  const { meta } = useUpdateDocument();
  const [editMode, setEditMode] = useAtom(documentEditModeAtom);

  return (
    <Stack direction="row" alignItems="center">
      <Button size="xs" variant="ghost" onClick={() => setEditMode(!editMode)}>
        {!editMode && <Pencil size="1em" />}
        {editMode && <PencilOff size="1em" />}
      </Button>

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
