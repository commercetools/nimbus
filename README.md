# ui-kit-v2

This is a mono-repo. It contains multiple packages & apps.

## Packages & Apps

### Packages

- **@bleh-ui/react** ui-library, react components to build user interfaces
- **@bleh-ui/icons** icon libary, svg files as react-components

### Apps

- **docs** a documentation site/app, scripts parse mdx-files inside the _packages_ folder, the mdx-file content is brought into shape and a documentation app is being build from it.

## Development Setup

### Installation

Straigh forward. Make sure you fulfill the requirements below and install dependencies with the provided command.

> All commands are run in the repository root.

#### Requirements

The following software needs to be installed on your system before you can proceed:

- Node v20+
- [bun](https://bun.sh/)

#### Install dependencies

```bash
$ bun install
```

### Development

1. Start the development environment with the following command

   ```bash
   $ bun run dev
   ```

2. Open the documentation app in the browser:
   http://localhost:5173/

### Build

To build packages & the documentation app:

```bash
$ bun run build
```

To only build packages:

```bash
$ bun run build-packages
```
