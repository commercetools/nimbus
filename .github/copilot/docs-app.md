# Documentation App

## Overview

The docs app is a React Single Page Application that serves as the official
documentation site for the Nimbus design system.

- all single-page-app related code goes into the ./src folder
- all build or tooling related code goes into the ./scripts folder
- shared types go into to the ./types folder
- importing code from the src into the scripts folder is allowed
- importing code from the scripts folder into the src-folder is not allowed
- use path-aliases from the tsconfig-files whenever possible. Except for
  importing files that only exist because of the importing file (e.g.
  sub-components)
