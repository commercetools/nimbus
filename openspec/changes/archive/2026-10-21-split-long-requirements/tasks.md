# Tasks

## 1. Split the long requirements

- [x] 1.1 For each requirement that `openspec validate --all --strict` reports as longer than 500 characters, copy the whole block under `## MODIFIED Requirements` with its header and every scenario unchanged
- [x] 1.2 Cut each description down to one behavior without changing its meaning; move examples and edge cases into new scenarios of the same requirement
- [x] 1.3 Add each removed behavior as an ADDED requirement with its own scenarios
- [x] 1.4 Check that every new requirement and scenario restates a rule from the original description

## 2. Validate and archive

- [x] 2.1 `openspec validate split-long-requirements --strict`
- [x] 2.2 Archive the change and run `openspec validate --all --strict`
