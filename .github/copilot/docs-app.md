# Documentation App

## Overview

The docs app is a React Single Page Application that serves as the official
documentation site for the Nimbus design system.

## Instructions

- all single-page-app related code goes into the ./src folder
- all build or tooling related code goes into the ./scripts folder
- shared types go into to the ./types folder
- importing code from the src into the scripts folder is allowed
- importing code from the scripts folder into the src-folder is not allowed
- use path-aliases from the tsconfig-files whenever possible. Except for
  importing files that only exist because of the importing file (e.g.
  sub-components)

## Tools, packages and libraries in use

- **Zod** Zod is a TypeScript-first schema declaration and validation library.
  https://zod.dev/
- **Jotai** Primitive and flexible state management for REact applications
  https://jotai.org/

## Folder-structure

- **./schemas/** contains zod.js schemas
- **./types/** contains type-script types shared by scripts & app
- **./scripts/** contains tooling related code, needed for building and
  maintaing the app
- **./src/** contains the single page react-application code which renders the
  documentation for this mono-repo
