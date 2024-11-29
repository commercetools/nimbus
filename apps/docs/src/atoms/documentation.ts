import { atom } from "jotai";
import json from "./../assets/docs.json";
import { MdxFileFrontmatter } from "../types";

export const documentationAtom = atom(
  json as Record<string, MdxFileFrontmatter>
);
