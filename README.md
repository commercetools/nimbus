# nimbus-v2

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

1. If you are setting up for the first time, do an initial [build](#build).
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

### "Publishing" locally and working in other repositories

To work with Nimbus locally, we can use the `pnpm link` command to create a
symlink from Nimbus to the target repo's `node_modules` folder.

Follow these steps:

1. Ensure that Nimbus and all its packages are built.
2. In the design system repo at the root level, run `pnpm link --global` to
   create a global symlink for Nimbus.
3. In the target repo (for example, in the Merchant Center), run
   `pnpm link --global nimbus` to link to the the Nimbus package.
   - You can observe if the link worked by checking the `node_modules` folder in
     the target repo. You should see a symlink to Nimbus.
4. Now, in the target repo you can import from `node_modules/nimbus` as if it
   was a regular package. For example:

   ```
   import {
      Box,
      Avatar,
      NimbusProvider,
      Button,
      LoadingSpinner,
   } from '../../../node_modules/nimbus/packages/nimbus'; <-- this is a relative path to the symlink - you'll have to adjust the depth as needed.
   ```

Okay, here's an expanded version focusing on clarity for newer developers while
keeping it concise and correcting the import path example:

### Testing Local Nimbus Changes in Other Repositories

Want to test your local Nimbus code changes in another repo (like Merchant
Center) _before_ publishing? `pnpm link --global` lets you do this by creating a
direct connection (a symlink) between your local Nimbus and the other repo.

Follow these steps:

1.  **Build Nimbus:** Make sure Nimbus and its internal packages have been built
    recently with your latest changes. (Via `pnpm build` command in the Nimbus
    repo).

2.  **Register Nimbus Locally:** In your Nimbus design system repository (at the
    root folder), run:

    ```bash
    pnpm link --global
    ```

    - **What this does:** This tells your computer where your local Nimbus code
      lives and registers it globally under its package name (`nimbus`). Think
      of it like a temporary, local "publishing" step just for your machine.

3.  **Connect Your Project to Local Nimbus:** In the target repository where you
    want to _use_ your local Nimbus (such as Merchant Center), run:

    ```bash
    pnpm link --global nimbus
    ```

    - **Important:** You'll need to run this command within the application you
      want to use it in rather than at the root level - for example, in the
      `application-project-settings` directory in the Merchant Center repo.
    - **What this does:** This connects _this specific project_ to the local
      Nimbus you just registered. It creates a special link (symlink) inside
      this project's `node_modules` folder that points directly to your local
      Nimbus code.
    - _Verification:_ You can peek inside the target repo's `node_modules`
      folder; you should see `nimbus` listed (often visually indicated as a
      link).

4.  **Import and Use:** Now, in your target repo's code, you can import and use
    Nimbus components.

    ```typescript
    // Correct way to import after linking:
    import {
      Box,
      Avatar,
      NimbusProvider,
      Button,
      LoadingSpinner,
    } from '../../../node_modules/nimbus/packages/nimbus'; // <-- This is a relative path to the symlink - you'll have to adjust the depth as needed.

    // Use the components...
    function MyComponent() {
      return (
        <NimbusProvider>
          <Box>
            <Button>Hello Nimbus!</Button>
          </Box>
        </NimbusProvider>
      );
    }
    ```

5.  **Testing changes**: Make changes to your local Nimbus code, then run
    `pnpm build` in Nimbus to rebuild. You should now see changes reflected in
    the target repo.
