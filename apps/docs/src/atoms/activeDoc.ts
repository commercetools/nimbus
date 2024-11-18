import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import { activeRouteAtom } from "./route";
import { MdxFileFrontmatter } from "../types";

export const activeDocIdAtom = atom("List");

export const activeDocAtom = atom((get) => {
  const activeRoute = get(activeRouteAtom);
  const docs = get(documentationAtom);
  const doc: MdxFileFrontmatter | undefined = Object.keys(docs)
    .map((key) => docs[key])
    .find((v) => v.meta.route === activeRoute);
  return doc;
});
