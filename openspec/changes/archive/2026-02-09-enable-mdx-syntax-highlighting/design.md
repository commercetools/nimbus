## Context

VS Code and other editors use the language identifier on fenced code blocks for
syntax highlighting. Custom identifiers like `jsx-live` are unrecognized,
resulting in no highlighting for documentation authors editing MDX files.

The docs site's `Code` component detects live code blocks by checking for
`-live` in the `className` attribute (which comes from the MDAST `lang` field
prefixed with `language-`).

## Goals / Non-Goals

- **Goal**: Enable VS Code syntax highlighting for live code examples in MDX
- **Goal**: Maintain full backward compatibility with the existing Code component
- **Goal**: Zero new runtime dependencies
- **Non-Goal**: Changing the Code component's detection logic
- **Non-Goal**: Adding VS Code extension or TextMate grammar for custom langs

## Decisions

- **Decision**: Use standard `jsx` lang with meta strings (`jsx live`,
  `jsx live-dev`) instead of custom language identifiers
  - **Why**: This is the simplest approach — VS Code already highlights `jsx`,
    and meta strings are a standard part of fenced code block syntax
  - **Alternative considered**: VS Code TextMate grammar extension to register
    `jsx-live` as a language — rejected because it requires every author to
    install the extension and doesn't help other editors
  - **Alternative considered**: VS Code `files.associations` setting — rejected
    because it doesn't work at the code fence level

- **Decision**: Remark plugin with manual tree walk (no `unist-util-visit`
  dependency)
  - **Why**: Keeps the plugin self-contained with zero new dependencies. The
    tree walk is trivial (< 20 lines).

- **Decision**: Bulk-migrate all MDX files to new syntax
  - **Why**: Consistent authoring experience. Old syntax still works at runtime
    but having a single convention avoids confusion.

## Risks / Trade-offs

- **Risk**: Sed-based bulk replacement could produce false positives
  - **Mitigation**: Replace longer `jsx-live-dev` pattern first; verify counts
    before and after match exactly
- **Risk**: Authors accustomed to old syntax may be confused
  - **Mitigation**: All documentation, templates, skills, and guides updated to
    reference new syntax

## Open Questions

- None — implementation is complete and verified.
