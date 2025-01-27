---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.types.tsx
---
import type { <%= h.changeCase.pascalCase(name) %>RootProps } from "./<%= h.changeCase.paramCase(name) %>.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { <%= h.changeCase.camelCase(name) %>Recipe } from "./<%= h.changeCase.paramCase(name) %>.recipe"

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type <%= h.changeCase.pascalCase(name) %>VariantProps = <%= h.changeCase.pascalCase(name) %>RootProps & RecipeVariantProps<typeof <%= h.changeCase.camelCase(name) %>Recipe>;

/**
 * Main props interface for the <%= h.changeCase.pascalCase(name) %> component.
 * Extends <%= h.changeCase.pascalCase(name) %>VariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface <%= h.changeCase.pascalCase(name) %>Props extends <%= h.changeCase.pascalCase(name) %>VariantProps {
  children?: React.ReactNode;
}
