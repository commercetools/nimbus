# ui-kit-v2

This is a mono-repo. It contains multiple packages & apps.

## Packages & Apps

### Packages

- **@nimbus/react** ui-library, react components to build user interfaces
- **@nimbus/icons** icon library, svg files as react-components
### Apps

- **docs** a documentation site/app, scripts parse mdx-files inside the
  _packages_ folder, the mdx-file content is brought into shape and a
  documentation app is being build from it.

## Development Setup

### Installation

Straight forward. Make sure you fulfill the requirements below and install
dependencies with the provided command.

> All commands are run in the repository root.

#### Requirements

The following software needs to be installed on your system before you can
proceed:

- Node v20+
- PNPM // todo: version?

#### Install dependencies

```bash
$ pnpm install
```

### Development

1. If you are setting up for the first time, do an initial
   [build](#build).
2. Start the development environment with the following command

   ```bash
   $ pnpm run dev
   ```

3. Open the documentation app in the browser: http://localhost:5173/

### Build

To build packages & the documentation app:

```bash
$ pnpm run build
```

To only build packages:

```bash
$ pnpm run build-packages
```

### Creating a new component

To create a new component, we run a script, using hygen, to initialize some
component templates to guide development.

```bash
pnpm run component:new
```
