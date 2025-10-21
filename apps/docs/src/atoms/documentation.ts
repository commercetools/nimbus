import { atom } from "jotai";
import { MdxFileFrontmatter } from "../types";

/**
 * The path to the mdx-document within the repository.
 */
type RepoPath = string;

/**
 * Type definition for the documentation JSON object.
 */
type DocumentationJson = Record<RepoPath, MdxFileFrontmatter>;

/**
 * Async atom to manage the documentation state.
 * Uses dynamic import to properly handle module loading in production builds.
 * This prevents race conditions where components render before data is available.
 */
export const documentationAtom = atom<Promise<DocumentationJson>>(async () => {
  const module = await import("./../data/docs.json");
  return module.default as DocumentationJson;
});
