---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.tsx
---
export const <%= h.changeCase.pascal(name) %> = ()=> {
    return <div>Im a component</div>
}