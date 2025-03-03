import { atom } from "jotai";
import json from "./../data/docs.json";
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
 * Atom to manage the documentation state.
 * It uses the JSON data imported from docs.json.
 */
export const documentationAtom = atom<DocumentationJson>(
  json as DocumentationJson
);
