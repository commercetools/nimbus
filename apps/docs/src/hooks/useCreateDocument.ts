import { useState } from "react";
import { useAtomValue } from "jotai";
import { activeDocAtom } from "@/src/atoms/active-doc.ts";
import { sluggify } from "@/src/utils/sluggify.ts";
import axios from "axios";
import { mdxDocumentPayloadSchema } from "@/schemas/mdx-document";
import yaml from "js-yaml";

/**
 * Hook to handle the creation of a new document.
 */
export const useCreateDocument = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [menuLabel, setMenuLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const isFormValid = title && description && menuLabel;

  /**
   * Handles the submission of the new document creation form.
   */
  const handleSubmit = async () => {
    if (!activeDoc || !isFormValid) return;

    const fileNameSeed = [...activeDoc.meta.menu, menuLabel, Date.now()].join(
      "-"
    );
    const fileName = `${sluggify(fileNameSeed)}.mdx`;
    const repoPath = `${activeDoc.meta.repoPath.replace(/\/[^\/]+$/, "")}/${fileName}`;

    const meta = {
      id: fileNameSeed,
      title,
      description,
      documentState: "InitialDraft",
      order: 999,
      repoPath,
      menu: [...activeDoc.meta.menu, menuLabel],
      tags: [],
    };

    const mdx = `
# ${title}

${description}
`;
    const valid = mdxDocumentPayloadSchema.parse({ meta, mdx });
    const content = ["---", yaml.dump(valid.meta), "---", valid.mdx].join("\n");

    try {
      setIsLoading(true);
      await axios.post("/api/fs", { repoPath, content });
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("Error creating file:", error);
      setIsLoading(false);
    }
  };

  /**
   * Resets the form fields and closes the dialog.
   */
  const resetForm = () => {
    setIsLoading(false);
    setIsOpen(false);
    setTitle("");
    setDescription("");
    setMenuLabel("");
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    menuLabel,
    setMenuLabel,
    isOpen,
    setIsOpen,
    isLoading,
    isFormValid,
    handleSubmit,
  };
};
