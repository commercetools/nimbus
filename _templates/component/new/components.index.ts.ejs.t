---
to: packages/nimbus/src/components/index.ts
inject: true
append: true
---
export * from "./<%= h.changeCase.paramCase(name) %>";
