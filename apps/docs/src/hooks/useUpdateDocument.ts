import { useState } from "react";
import axios from "axios";
import { mdxDocumentPayloadSchema } from "@/schemas/mdx-document";
import yaml from "js-yaml";
import { MdxFileFrontmatterPayload } from "@/types";
import { useActiveDoc } from "./useActiveDoc";

/**
 * Type for the payload used in the handleSubmit function.
 */
type HandleSubmitPayload = {
  metaPayload?: Partial<MdxFileFrontmatterPayload["meta"]>;
  mdxPayload?: MdxFileFrontmatterPayload["mdx"];
};

/**
 * Hook to handle the updating of an existing document.
 */
export const useUpdateDocument = () => {
  const { doc: activeDoc } = useActiveDoc();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the submission of the document update form.
   * @param {Partial<MdxFileFrontmatterPayload["meta"]>} metaPayload - The metadata payload to update.
   * @param {string} mdxPayload - The MDX content payload to update.
   */
  const handleSubmit = async ({
    metaPayload = {},
    mdxPayload = "",
  }: HandleSubmitPayload) => {
    if (!activeDoc) return;

    const { meta: existingMeta, mdx: existingMdx } = activeDoc;

    // Merge the existing meta with the new meta
    const meta = {
      ...existingMeta,
      ...metaPayload,
    };

    const mdx = mdxPayload || existingMdx;
    const valid = mdxDocumentPayloadSchema.parse({ meta, mdx });
    const content = ["---", yaml.dump(valid.meta), "---", valid.mdx].join("\n");

    try {
      setIsLoading(true);
      await axios.put("/api/fs", { repoPath: existingMeta.repoPath, content });
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating file:", error);
      setIsLoading(false);
    }
  };

  /**
   * Updates the metadata of the document.
   * @param {Partial<MdxFileFrontmatterPayload["meta"]>} metaObj - The new metadata.
   */
  const updateMeta = async (metaObj: HandleSubmitPayload["metaPayload"]) => {
    handleSubmit({ metaPayload: metaObj });
  };

  return {
    isLoading,
    updateMeta,
    meta: activeDoc?.meta,
    mdx: activeDoc?.mdx,
  };
};
