# nimbus-v2

A modern React component library with full internationalization support.

## Installation

```bash
npm install @commercetools/nimbus react-intl
# or
pnpm add @commercetools/nimbus react-intl
```

## Quick Start

```tsx
import { IntlProvider } from "react-intl";
import {
  NimbusProvider,
  NumberInput,
  nimbusMessagesEN,
} from "@commercetools/nimbus";

function App() {
  return (
    <IntlProvider locale="en" messages={nimbusMessagesEN}>
      <NimbusProvider>
        <NumberInput />
      </NimbusProvider>
    </IntlProvider>
  );
}
```

## 🌍 Internationalization

Nimbus components are fully internationalized. **You must include Nimbus
translation messages** for components to display proper text and aria-labels.

**📖
[Read the complete internationalization guide →](./INTERNATIONALIZATION.md)**

## Development

To install dependencies:

```bash
pnpm install
```

To build:

```bash
pnpm run build
```
