import { Button } from "@bleh-ui/react";
import { TrashIcon } from "@bleh-ui/icons";
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
    <Button variant="ghost" onClick={handleDelete} size="xs">
      <TrashIcon size="1em" />
    </Button>
  );
};
