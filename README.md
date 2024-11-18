# ui-kit-v2

This is a mono-repo. It contains multiple packages & apps.

## Packages & Apps

### Packages

- **@bleh-ui/react** our ui-library, react components to build interfaces
- **@bleh-ui/icons** our icon libary, svg files as react-components

### Apps

- **docs** is a documentation site/app. Scripts parse mdx-files inside the _packages_ folder, the mdx-file content is brought into shape and a documentaiton
  documentatiton app is being build from it.

## Installation

### Requirements

- Node v20+
- [bun](https://bun.sh/) needs to be installed

### Development

1. Install dependencies:

```bash
bun install
```

2. Start development:

```bash
bun dev
```
3. Open the dev-server/app in the browser:

http://localhost:5173/
