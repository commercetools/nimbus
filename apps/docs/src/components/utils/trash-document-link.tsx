import { IconButton } from "@bleh-ui/react";
import { Delete } from "@bleh-ui/icons";
import { useRemoveDocument } from "@/hooks/useRemoveDocument";

/**
 * Props for the TrashDocumentLink component
 */
export interface TrashDocumentLinkProps {
  repoPath: string;
}

/**
 * TrashDocumentLink component
 *
 * A button that allows the user to delete a document.
 *
 * @param {TrashDocumentLinkProps} props - The props for the component.
 * @returns The rendered component.
 */
export const TrashDocumentLink = ({ repoPath }: TrashDocumentLinkProps) => {
  const { remove } = useRemoveDocument();
  /**
   * Handles the delete action
   */
  const handleDelete = async (): Promise<void> => {
    const userConfirmed = confirm(
      "Are you sure you want to delete this document?"
    );

    if (!userConfirmed) return;

    try {
      await remove(repoPath);
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  return (
    <IconButton variant="ghost" onClick={handleDelete}>
      <Delete />
    </IconButton>
  );
};
