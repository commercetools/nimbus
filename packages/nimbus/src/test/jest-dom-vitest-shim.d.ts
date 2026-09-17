// Restores jest-dom matcher types under Vitest 5.
//
// `@testing-library/jest-dom/vitest` augments `Assertion<T>` (one type
// parameter), but Vitest 5 changed the ambient interface to `Assertion<R, T>`
// (two parameters) — see the "Assertion Type Parameters" migration note.
// TypeScript only merges interface declarations with identical arity, so
// jest-dom's augmentation silently stops applying (no error, matchers still
// registered at runtime, but every `toHaveTextContent`/`toBeInTheDocument`/...
// disappears from the types). Tracked upstream, unresolved as of 2026-09-15:
// https://github.com/testing-library/jest-dom/issues/738
//
// `Matchers<R, T>` is Vitest's dedicated, arity-stable extension point for
// third-party matcher libraries (one of `Assertion`'s base interfaces), so we
// hang jest-dom's matchers off that instead — the same shape jest-dom's own
// (working) `jest.Matchers` augmentation uses. Remove this file once #738 is
// fixed upstream and jest-dom's `/vitest` entry point works again.
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- required shape for declaration merging
  interface Matchers<
    R extends void | Promise<void> = void,
    // `T` must stay declared (unused) to match `Matchers`' original arity —
    // TypeScript only merges interfaces with identical type parameter counts.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T = unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > extends TestingLibraryMatchers<any, R> {}
}
