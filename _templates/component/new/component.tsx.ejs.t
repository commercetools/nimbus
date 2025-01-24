---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.tsx
---
import { forwardRef } from "react";
import { <%= h.changeCase.pascal(name) %>Root } from "./<%= h.changeCase.paramCase(name) %>.slots";
import type { <%= h.changeCase.pascalCase(name) %>Props } from "./<%= h.changeCase.paramCase(name) %>.types"

export const <%= h.changeCase.pascal(name) %> = forwardRef<<%= elementType %>, <%= h.changeCase.pascalCase(name) %>Props>(
({children, ...props}, ref) => {
    return (
     <<%= h.changeCase.pascal(name) %>Root ref={ref} {...props}>{children}</<%= h.changeCase.pascal(name) %>Root>
    )
 }
);
<%= h.changeCase.pascalCase(name) %>.displayName = "<%= h.changeCase.pascalCase(name) %>";