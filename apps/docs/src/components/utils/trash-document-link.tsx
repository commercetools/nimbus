import axios from "axios";
import { Button } from "@bleh-ui/react";
import { TrashIcon } from "@bleh-ui/icons";

interface TrashDocumentLinkProps {
  repoPath: string;
}

export const TrashDocumentLink = ({ repoPath }: TrashDocumentLinkProps) => {
  const handleDelete = async () => {
    const yes = confirm("Are you sure you want to delete this document?");

    if (!yes) return;

    try {
      await axios.delete("/api/fs", { data: { repoPath } });
      // Handle successful delete (e.g., show a message, update UI)
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <Button variant="plain" onClick={handleDelete} size="xs">
      <TrashIcon size="1em" />
    </Button>
  );
};
