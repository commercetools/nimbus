# Contributing to UI Kit Docs POC

Thank you for your interest in contributing to our UI Kit documentation and
component library!

## Development Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Build the project**:

   ```bash
   pnpm build
   ```

3. **Start development**:
   ```bash
   pnpm start
   ```

## Versioning and Releases

This project uses [changesets](https://github.com/changesets/changesets) for
versioning and releases.

### Creating a changeset

When making changes that should trigger a release:

```bash
pnpm changeset
```

This will prompt you to:

1. Select which packages should be bumped
2. Choose the type of version bump (major, minor, patch)
3. Write a summary of your changes

**Note**: A changeset is **NOT required** for every PR. Documentation changes,
tests, or internal tooling changes typically don't need a changeset.

### Release Process

1. **Automatic PRs**: When changesets exist, a "Version Packages" PR is
   automatically created
2. **Merge to Release**: Merging this PR automatically publishes packages to NPM
3. **Canary Releases**: All commits to main get canary releases for testing

### Package Structure

Our packages are set up with fixed versioning, meaning they all release
together:

- `@commercetools/nimbus` - Main component library
- `@commercetools/nimbus-tokens` - Design tokens
- `@commercetools/nimbus-icons` - Icon library
- `color-tokens` - Internal color token utilities (private)

## Development Guidelines

### Testing

Run tests with:

```bash
pnpm test
```

### Linting

Run linting with:

```bash
pnpm lint
```

### Building

Build all packages:

```bash
pnpm build
```

## Questions?

If you have questions about the contribution process, feel free to open an issue
or reach out to the maintainers.
