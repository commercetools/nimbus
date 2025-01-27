---
to: packages/bleh-ui/src/components/index.ts
inject: true
append: true
---
export * from "./<%= h.changeCase.paramCase(name) %>";