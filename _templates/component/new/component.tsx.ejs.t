---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.tsx
---

import { forwardRef } from "react";
import type { <%= h.changeCase.pascalCase(name) %>Props } from "./<%= h.changeCase.paramCase(name) %>.types"

export const <%= h.changeCase.pascal(name) %> = forwardRef<<%= elementType %>, <%= h.changeCase.pascalCase(name) %>Props>(
({children, ...props}, ref) => {
    return (
     <<%= h.changeCase.lowerCase(element) %> ref={ref} {...props}>{children}</<%= h.changeCase.lowerCase(element) %>>
    )
 }
);
<%= h.changeCase.pascalCase(name) %>.displayName = "<%= h.changeCase.pascalCase(name) %>";