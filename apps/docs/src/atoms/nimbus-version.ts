import { atom } from "jotai";
import { version as nimbusVersion } from "@commercetools/nimbus/package.json";

export const nimbusPackageVersionAtom = atom(nimbusVersion);
