import { activeDocAtom } from "@/atoms/active-doc";
import { mdxDocumentPayloadSchema } from "@/schemas/mdx-document";
import { MdxFileFrontmatterPayload } from "@/types";
import axios from "axios";
import { useAtomValue } from "jotai";
import yaml from "js-yaml";

export const useDocumentMetaSettings = () => {
  const doc = useAtomValue(activeDocAtom);
  console.log("new doc");
  const noDoc = !doc;
  const meta = doc?.meta;
  const mdx = doc?.mdx;
  const repoPath = meta?.repoPath;

  const save = async (payload: MdxFileFrontmatterPayload["meta"]) => {
    try {
      // Validate data before converting to a string
      const validData = mdxDocumentPayloadSchema.parse({ meta: payload, mdx });
      const content = [
        "---",
        yaml.dump(validData.meta),
        "---\n",
        validData.mdx,
      ].join("\n");

      // Convert the object to a YAML string
      console.log(content);

      await axios.put("/api/fs", { repoPath, content });
      return;
    } catch (error) {
      console.error("Error serializing frontmatter:", error);
      throw error;
    }
  };

  return {
    noDoc,
    meta,
    save,
  };
};
