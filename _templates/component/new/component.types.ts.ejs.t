---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.types.tsx
---
import type { <%= h.changeCase.pascalCase(name) %>RootProps } from "./<%= h.changeCase.paramCase(name) %>.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { <%= h.changeCase.camelCase(name) %>Recipe } from "./<%= h.changeCase.paramCase(name) %>.recipe"

type <%= h.changeCase.pascalCase(name) %>VariantProps = <%= h.changeCase.pascalCase(name) %>RootProps & RecipeVariantProps<typeof <%= h.changeCase.camelCase(name) %>Recipe>;

export interface <%= h.changeCase.pascalCase(name) %>Props extends <%= h.changeCase.pascalCase(name) %>VariantProps {
  children?: React.ReactNode;
}
