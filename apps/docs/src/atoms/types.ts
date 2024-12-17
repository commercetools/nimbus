import { atom } from "jotai";
import typeData from "./../assets/types.json";

/**
 * Atom to manage the state of type data.
 * Initialized with data from a JSON file.
 */
export const typesAtom = atom(typeData);
