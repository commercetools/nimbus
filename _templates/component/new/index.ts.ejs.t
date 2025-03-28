---
to: packages/nimbus/src/components/<%= h.changeCase.paramCase(name) %>/index.ts
---
export * from './<%= h.changeCase.paramCase(name) %>'
export * from './<%= h.changeCase.paramCase(name) %>.types'
