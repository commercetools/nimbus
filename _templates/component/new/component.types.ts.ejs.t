---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.types.tsx
---

import type { RecipeVariantProps } from "@chakra-ui/react"
import { <%= h.changeCase.camel(name) %>Recipe } from "./<%= h.changeCase.paramCase(name) %>.recipe"

type <%= h.changeCase.pascalCase(name) %>VariantProps = RecipeVariantProps<typeof <%= h.changeCase.camel(name) %>Recipe >

export interface <%= h.changeCase.pascalCase(name) %>Props extends <%= h.changeCase.pascalCase(name) %>VariantProps {
  children?: React.ReactNode;
}
