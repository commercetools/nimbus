# ADR: Standardizing Compound Component Extraction to a `components` Directory

## Context

To enhance the organization, maintainability, and scalability of our components
that utilize the compound component pattern, we are establishing a consistent
directory structure for their implementation. This ADR outlines the principle of
extracting the core root component and its associated compound sub-components
into a dedicated `components` subdirectory.

## Decision

For any component (`<ComponentName>`) that follows the compound component
pattern (where sub-components like `<ComponentName.Part>`,
`<ComponentName.Control>`, etc., are defined as properties of the main
component), we will adopt the following directory structure:

- The main component's directory will be
  `packages/nimbus/src/components/<component-name>/`.
- A subdirectory named `components` will be created within the main component's
  directory: `packages/nimbus/src/components/<component-name>/components/`.
- The implementation files for the root component (`<ComponentName.Root>` or
  simply `<ComponentName>` if no explicit `.Root` is used) and all its compound
  sub-components (`<ComponentName.Part>`, `<ComponentName.Control>`, etc.) will
  reside within this `components` subdirectory.
- The main `<component-name>.tsx` file within the `<component-name>` directory
  will be responsible for:
  - Importing the root component and all sub-components from the `components`
    subdirectory.
  - Re-exporting them as properties of the main `ComponentName` object.

Storybook files (`<component-name>.stories.tsx`) will be updated to reflect this
structure, primarily by referencing the appropriate root component (e.g.,
`ComponentName.Root` or `ComponentName`) in the `Meta` configuration.

## Why this is better:

- **Consistent Code Organization:** This standardized structure will make it
  easier for developers to locate the implementation files for any component
  utilizing the compound pattern.
- **Improved Maintainability:** Isolating the implementation of each part of a
  compound component within its own file reduces the complexity of individual
  files and minimizes the risk of unintended side effects during modifications.
- **Enhanced Scalability:** As components grow and incorporate more
  sub-components, this structure provides a clear and manageable way to organize
  the increasing number of files.
- **Clear Separation of Concerns:** Each file within the `components` directory
  will focus on the implementation details of a specific part of the compound
  component.

## Consequences

- **New Directory Structure:** Developers will need to be aware of this new
  directory structure for all future and refactored compound components.
- **Import Path Updates:** When working directly with the individual root or
  sub-component implementations, import paths will need to reflect their
  location within the `components` subdirectory. However, the main `index.tsx`
  re-export should abstract this for most consumers using the compound component
  API.
- **Storybook Updates:** The `Meta` configuration in Storybook files for
  compound components will need to point to the appropriate root component.

## Examples

**With `components` Subdirectory:**

```
packages/bleh-ui/src/components/component-name/index.tsx
packages/bleh-ui/src/components/component-name/component-name.tsx
packages/bleh-ui/src/components/component-name/components/component-name.root.tsx
packages/bleh-ui/src/components/component-name/components/component-name.part.tsx
packages/bleh-ui/src/components/component-name/components/component-name.control.tsx
packages/bleh-ui/src/components/component-name/component-name.stories.tsx
```

## Summary

Adopting this standardized directory structure for compound components will lead
to a more organized, maintainable, and scalable UI Kit. By consistently
separating the implementation details of the root and sub-components into a
dedicated `components` subdirectory, we establish a clear pattern for future
development and refactoring efforts.
