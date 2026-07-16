# Alert × FeedbackCard Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fold the FeedbackCard pattern's capabilities into the Alert component
(new `layout` + emphasis axes, `neutral` status, native overridable `role`,
public `Alert.Icon`, `dismissible` convenience), fix Alert's accumulated debt,
and remove FeedbackCard — backwards-compatibly.

**Architecture:** Alert stays a Chakra slot-recipe compound. Two orthogonal
recipe `variant` groups (`variant` = emphasis, `layout`) plus the `colorPalette`
system prop carry all visual variance. `Alert.Root` becomes a thin behavioral
wrapper (overridable `role`, auto/explicit/hidden icon, optional built-in
dismiss). Title/Description render the Nimbus `Heading`/`Text` primitives via
`asChild`.

**Tech Stack:** React 19, TypeScript, Chakra UI v3 slot recipes, React Aria
Components, Storybook (play-function tests via Vitest + Playwright),
`@internationalized/string` i18n.

**Design doc:**
`docs/superpowers/specs/2026-07-16-alert-feedbackcard-merge-design.md`

## Global Constraints

- **Backwards compatibility:** every existing Alert prop keeps working; existing
  markup renders identically. Only the **default announcement politeness** may
  change (assertive → polite). `variant="outlined"` and `variant="flat"` must
  keep working; `outlined` renders identically to `subtle`.
- **Chakra imports:** modular subpath imports only (e.g.
  `@chakra-ui/react/styled-system`), never the `@chakra-ui/react` barrel.
- **Cross-component imports:** import from implementation files
  (`heading/heading`, `text/text`), not barrels (`@/components`), to avoid
  circular chunks.
- **Recipe registry keys** must be valid JS identifiers accessed via dot
  notation, prefixed `nimbus` (e.g. `nimbusAlert`).
- **Testing:** component behavior is tested via `*.stories.tsx` play functions.
  Use dev commands (source, no build): `pnpm test:storybook:dev <path>`. Type
  check with `pnpm --filter @commercetools/nimbus typecheck:dev`.
- **After any recipe variant change**, regenerate theme typings:
  `pnpm --filter @commercetools/nimbus build-theme-typings` (otherwise
  `SlotRecipeProps<"nimbusAlert">["layout"]` etc. won't exist and typecheck
  fails).
- **Commit** after every task with a Conventional Commit message scoped `alert`.

**Key file paths (reference):**

- Recipe: `packages/nimbus/src/components/alert/alert.recipe.ts`
- Types: `packages/nimbus/src/components/alert/alert.types.ts`
- Slots: `packages/nimbus/src/components/alert/alert.slots.tsx`
- Compound: `packages/nimbus/src/components/alert/alert.tsx`
- Components dir: `packages/nimbus/src/components/alert/components/`
- Stories: `packages/nimbus/src/components/alert/alert.stories.tsx`
- Recipe registry: `packages/nimbus/src/theme/slot-recipes/index.ts`
- FeedbackCard (to delete): `packages/nimbus/src/patterns/feedback/`
- Guideline: `docs/file-type-guidelines/component-vs-pattern.md`

**Test command used throughout:**

```bash
pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx
```

---

### Task 1: Recipe axes + types (emphasis, layout, neutral, new props)

Establishes the recipe variants and the type surface every later task consumes.

**Files:**

- Modify: `packages/nimbus/src/components/alert/alert.recipe.ts`
- Modify: `packages/nimbus/src/components/alert/alert.types.ts`
- Test: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Produces: recipe `variant` values
  `"flat" | "subtle" | "outline" | "solid" | "outlined"` (outlined = deprecated
  alias of subtle); recipe `layout` values `"stack" | "inline" | "banner"`;
  `defaultVariants: { variant: "subtle", layout: "stack" }`.
- Produces types: `AlertProps` gains `hideIcon?: boolean`,
  `dismissible?: boolean`, `onDismiss?: () => void`; `AlertRecipeProps` gains
  `layout`; `AlertRootSlotProps.colorPalette` now
  `Exclude<SemanticPalettesOnly, "primary">` (neutral allowed);
  `AlertTitleProps` based on `HeadingProps`; `AlertDescriptionProps` based on
  `TextProps`.

- [ ] **Step 1: Write failing tests** — append these stories to
      `alert.stories.tsx`:

```tsx
export const EmphasisDefaultsToSubtle: Story = {
  args: {
    colorPalette: "info",
    "data-testid": "default-alert",
    children: <Alert.Title>Default emphasis</Alert.Title>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("default-alert");
    await step(
      "Omitting variant renders the subtle tinted surface",
      async () => {
        const bg = getComputedStyle(root).backgroundColor;
        await expect(bg).not.toBe("rgba(0, 0, 0, 0)");
        await expect(bg).not.toBe("transparent");
      }
    );
  },
};

export const OutlinedAliasesSubtle: Story = {
  name: "Compat: outlined aliases subtle",
  render: () => (
    <>
      <Alert.Root data-testid="v-subtle" colorPalette="info" variant="subtle">
        <Alert.Title>subtle</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="v-outlined"
        colorPalette="info"
        variant="outlined"
      >
        <Alert.Title>outlined</Alert.Title>
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("outlined renders identically to subtle", async () => {
      const s = getComputedStyle(canvas.getByTestId("v-subtle"));
      const o = getComputedStyle(canvas.getByTestId("v-outlined"));
      await expect(o.backgroundColor).toBe(s.backgroundColor);
      await expect(o.borderTopWidth).toBe(s.borderTopWidth);
      await expect(o.borderTopLeftRadius).toBe(s.borderTopLeftRadius);
    });
  },
};

export const NeutralStatus: Story = {
  args: {
    colorPalette: "neutral",
    "data-testid": "neutral-alert",
    children: <Alert.Title>Neutral status</Alert.Title>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("neutral colorPalette renders", async () => {
      await expect(canvas.getByTestId("neutral-alert")).toBeInTheDocument();
    });
  },
};

export const InlineLayout: Story = {
  args: {
    colorPalette: "positive",
    layout: "inline",
    "data-testid": "inline-alert",
    children: (
      <>
        <Alert.Title>Inline title</Alert.Title>
        <Alert.Description>Inline description</Alert.Description>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("inline-alert");
    await step("inline layout uses a grid", async () => {
      await expect(getComputedStyle(root).display).toBe("grid");
    });
  },
};
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: FAIL / compile error — `layout` and `colorPalette="neutral"` are not
yet valid props; `variant="subtle"` unknown.

- [ ] **Step 3: Rewrite the recipe** — replace the entire contents of
      `alert.recipe.ts` with:

```ts
import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

// Tinted-card surface shared by `subtle` (canonical) and the deprecated
// `outlined` alias, so the two render identically.
const subtleSurface = {
  root: {
    border: "solid-25",
    borderColor: "colorPalette.5",
    backgroundColor: "colorPalette.2",
    padding: "200",
    borderRadius: "200",
  },
};

export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismissButton"],
  className: "nimbus-alert",

  base: {
    root: {
      width: "100%",
    },
    icon: {
      "& svg": {
        width: "500",
        height: "500",
        color: "colorPalette.11",
      },
    },
    title: {
      color: "colorPalette.11",
    },
    description: {
      color: "colorPalette.11",
    },
  },

  variants: {
    // Emphasis axis (kept as `variant` for backwards compatibility).
    variant: {
      flat: {},
      subtle: subtleSurface,
      // Deprecated alias for `subtle`; renders identically. Kept so existing
      // `variant="outlined"` usage does not break.
      outlined: subtleSurface,
      outline: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.7",
          backgroundColor: "transparent",
          padding: "200",
          borderRadius: "200",
        },
      },
      solid: {
        root: {
          backgroundColor: "colorPalette.9",
          padding: "200",
          borderRadius: "200",
        },
        title: { color: "colorPalette.contrast" },
        description: { color: "colorPalette.contrast" },
        icon: { "& svg": { color: "colorPalette.contrast" } },
      },
    },

    // Layout axis. Declared AFTER `variant` so layout-specific overrides
    // (e.g. banner's borderRadius: 0) win over emphasis defaults.
    layout: {
      stack: {
        root: {
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "200",
          alignItems: "start",
        },
        icon: { gridColumn: "1", gridRow: "1", marginTop: "50" },
        title: { gridColumn: "2", order: "1" },
        description: { gridColumn: "2", order: "2" },
        actions: { gridColumn: "2", order: "3" },
        dismissButton: { gridColumn: "3", gridRow: "1" },
      },
      inline: {
        root: {
          display: "grid",
          gridTemplateColumns: {
            base: "auto 1fr auto",
            sm: "auto minmax(0, 1fr) auto auto",
          },
          columnGap: "400",
          rowGap: "200",
          alignItems: "center",
        },
        icon: { gridColumn: "1", alignSelf: "center" },
        title: { gridColumn: "2" },
        description: { gridColumn: "2" },
        actions: {
          gridColumn: { base: "1 / -1", sm: "3" },
          gridRow: { sm: "1 / -1" },
          alignSelf: "center",
          justifySelf: { base: "start", sm: "end" },
        },
        dismissButton: {
          gridColumn: { base: "3", sm: "4" },
          gridRow: "1",
          alignSelf: "center",
        },
      },
      banner: {
        root: {
          display: "grid",
          gridTemplateColumns: "auto minmax(0, 1fr) auto auto",
          columnGap: "400",
          rowGap: "200",
          alignItems: "center",
          width: "100%",
          borderRadius: "0",
          borderInline: "none",
        },
        icon: { gridColumn: "1", alignSelf: "center" },
        title: { gridColumn: "2" },
        description: { gridColumn: "2" },
        actions: { gridColumn: "3", gridRow: "1 / -1", alignSelf: "center" },
        dismissButton: { gridColumn: "4", gridRow: "1", alignSelf: "center" },
      },
    },
  },

  defaultVariants: {
    variant: "subtle",
    layout: "stack",
  },
});
```

- [ ] **Step 4: Rewrite the types** — replace the entire contents of
      `alert.types.ts` with:

```ts
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { TextProps } from "../text/text";
import type { HeadingProps } from "../heading/heading";
import type { ButtonProps } from "../button/button.types";
import type { SemanticPalettesOnly } from "../../type-utils/shared-types";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type AlertRecipeProps = {
  /**
   * Visual emphasis of the alert surface.
   *
   * @remarks `"outlined"` is a deprecated alias for `"subtle"` and renders
   * identically. Prefer `"subtle"`.
   */
  variant?: SlotRecipeProps<"nimbusAlert">["variant"];
  /**
   * Layout of the alert: `"stack"` (default, icon + stacked content),
   * `"inline"` (content leading, actions trailing, wraps on narrow widths),
   * or `"banner"` (full-width, edge-to-edge).
   */
  layout?: SlotRecipeProps<"nimbusAlert">["layout"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type AlertRootSlotProps = HTMLChakraProps<"div", AlertRecipeProps> & {
  /** Color palette / status of the alert. */
  colorPalette?: Exclude<SemanticPalettesOnly, "primary">;
};

export type AlertIconSlotProps = HTMLChakraProps<"div">;

export type AlertActionsSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Alert.Root component.
 */
export type AlertProps = OmitInternalProps<AlertRootSlotProps> & {
  [key: `data-${string}`]: unknown;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Hide the status icon entirely. Suppresses both the automatic status icon
   * and any explicit `Alert.Icon`.
   */
  hideIcon?: boolean;
  /**
   * Render a built-in, localized dismiss button. Ignored when a manual
   * `Alert.DismissButton` child is present.
   */
  dismissible?: boolean;
  /** Called when the built-in dismiss button is pressed. */
  onDismiss?: () => void;
};

/**
 * Type signature for the main Alert component.
 */
export type AlertRootComponent = React.FC<AlertProps>;

/**
 * Props for the Alert.Icon component.
 */
export type AlertIconProps = AlertIconSlotProps;

/**
 * Props for the Alert.Title component. Renders the Nimbus `Heading` primitive;
 * defaults to a non-heading element (`as="p"`), overridable via `as`.
 */
export type AlertTitleProps = Omit<HeadingProps, "ref"> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * Props for the Alert.Description component. Renders the Nimbus `Text` primitive.
 */
export type AlertDescriptionProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLElement>;
};

/**
 * Props for the Alert.Actions component.
 */
export type AlertActionsProps = OmitInternalProps<AlertActionsSlotProps>;

/**
 * Props for the Alert.DismissButton component.
 */
export type AlertDismissButtonProps = OmitInternalProps<ButtonProps>;
```

- [ ] **Step 5: Regenerate theme typings**

Run: `pnpm --filter @commercetools/nimbus build-theme-typings` Expected:
completes without error; generated typings now include `layout` for
`nimbusAlert`.

- [ ] **Step 6: Typecheck**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: PASS (no
errors in `alert.*`).

- [ ] **Step 7: Run tests to verify they pass**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS (new stories green; existing stories still green — `outlined`
still works).

- [ ] **Step 8: Commit**

```bash
git add packages/nimbus/src/components/alert/alert.recipe.ts \
        packages/nimbus/src/components/alert/alert.types.ts \
        packages/nimbus/src/components/alert/alert.stories.tsx \
        packages/nimbus/src/components/alert/*.d.ts 2>/dev/null; \
git add -A packages/nimbus/src/theme
git commit -m "feat(alert): add emphasis + layout recipe axes and neutral status"
```

---

### Task 2: Native overridable `role` (default `status`)

**Files:**

- Modify: `packages/nimbus/src/components/alert/components/alert.root.tsx`
- Test: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Consumes: `AlertProps` (Task 1).
- Produces: `AlertRoot` renders default `role="status"`, overridable via a
  native `role` prop (consumer value wins).

- [ ] **Step 1: Write failing test** — append to `alert.stories.tsx`:

```tsx
export const RoleBehavior: Story = {
  name: "A11y: role default + override",
  render: () => (
    <>
      <Alert.Root data-testid="role-default" colorPalette="critical">
        <Alert.Title>default</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="role-alert" colorPalette="critical" role="alert">
        <Alert.Title>assertive</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="role-group"
        colorPalette="positive"
        role="group"
        aria-label="Feedback"
      >
        <Alert.Title>silent</Alert.Title>
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("defaults to role=status (polite)", async () => {
      await expect(canvas.getByTestId("role-default")).toHaveAttribute(
        "role",
        "status"
      );
    });
    await step("role can be overridden to alert", async () => {
      await expect(canvas.getByTestId("role-alert")).toHaveAttribute(
        "role",
        "alert"
      );
    });
    await step("role=group silent mode is honored", async () => {
      await expect(canvas.getByTestId("role-group")).toHaveAttribute(
        "role",
        "group"
      );
    });
  },
};
```

Also update the existing `Base` story assertion (currently `role","alert"`):

```tsx
await expect(alertRoot).toHaveAttribute("role", "status");
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: FAIL — root still hardcodes `role="alert"` (both `RoleBehavior`
"default" step and updated `Base` step fail).

- [ ] **Step 3: Update the root** — in `components/alert.root.tsx`, change the
      render so `role` defaults _before_ the spread. Replace the `return (...)`
      block's opening tag:

```tsx
    <AlertRootSlot ref={ref} role="status" {...restProps}>
```

(Note: `role="status"` now precedes `{...restProps}`, so a consumer-supplied
`role` overrides it. This is the only change in this task.)

- [ ] **Step 4: Run tests to verify they pass**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/nimbus/src/components/alert/components/alert.root.tsx \
        packages/nimbus/src/components/alert/alert.stories.tsx
git commit -m "feat(alert): default role=status, overridable via native role"
```

---

### Task 3: Public `Alert.Icon` slot + `hideIcon` + auto-icon precedence

**Files:**

- Create: `packages/nimbus/src/components/alert/components/alert.icon.tsx`
- Modify: `packages/nimbus/src/components/alert/components/index.ts`
- Modify: `packages/nimbus/src/components/alert/components/alert.root.tsx`
- Modify: `packages/nimbus/src/components/alert/alert.tsx`
- Test: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Consumes: `AlertIconProps` (Task 1), `AlertIcon` slot from `alert.slots`.
- Produces: public `Alert.Icon` component; `AlertRoot` renders the auto icon
  only when no explicit `Alert.Icon` child is present and `hideIcon` is falsy;
  `hideIcon` strips explicit `Alert.Icon` children too.

- [ ] **Step 1: Write failing tests** — append to `alert.stories.tsx` (and add
      `Info` to the nimbus-icons import at the top:
      `import { Info } from "@commercetools/nimbus-icons";`):

```tsx
export const CustomIcon: Story = {
  render: () => (
    <Alert.Root data-testid="custom-icon" colorPalette="info">
      <Alert.Icon>
        <Info data-testid="my-custom-icon" />
      </Alert.Icon>
      <Alert.Title>Custom icon</Alert.Title>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders the consumer-provided icon", async () => {
      await expect(canvas.getByTestId("my-custom-icon")).toBeInTheDocument();
    });
  },
};

export const HideIcon: Story = {
  render: () => (
    <Alert.Root data-testid="hide-icon" colorPalette="info" hideIcon>
      <Alert.Title>No icon</Alert.Title>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders no icon svg", async () => {
      const root = canvas.getByTestId("hide-icon");
      await expect(root.querySelector("svg")).toBeNull();
    });
  },
};

export const HideIconSuppressesCustom: Story = {
  render: () => (
    <Alert.Root data-testid="hide-custom" colorPalette="info" hideIcon>
      <Alert.Icon>
        <Info data-testid="should-not-render" />
      </Alert.Icon>
      <Alert.Title>No icon even when explicit</Alert.Title>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("explicit Alert.Icon is suppressed", async () => {
      await expect(
        canvas.queryByTestId("should-not-render")
      ).not.toBeInTheDocument();
    });
  },
};
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: FAIL / compile error — `Alert.Icon` and `hideIcon` do not exist yet.

- [ ] **Step 3: Create the public icon component** — create
      `components/alert.icon.tsx`:

```tsx
import { AlertIcon as AlertIconSlot } from "../alert.slots";
import type { AlertIconProps } from "../alert.types";

/**
 * Alert.Icon - Optional custom icon slot.
 *
 * When omitted, Alert renders an automatic status icon based on `colorPalette`.
 * When provided, it replaces the automatic icon. Suppressed entirely by the
 * `hideIcon` prop on `Alert.Root`.
 *
 * @supportsStyleProps
 */
export const AlertIcon = ({ children, ...props }: AlertIconProps) => {
  return <AlertIconSlot {...props}>{children}</AlertIconSlot>;
};

AlertIcon.displayName = "Alert.Icon";
```

- [ ] **Step 4: Export it** — in `components/index.ts` add:

```tsx
export { AlertIcon } from "./alert.icon";
```

- [ ] **Step 5: Wire precedence in the root** — replace the entire contents of
      `components/alert.root.tsx` with:

```tsx
import { Children, isValidElement } from "react";
import {
  AlertRoot as AlertRootSlot,
  AlertIcon as AlertIconSlot,
} from "../alert.slots";
import { AlertIcon } from "./alert.icon";
import type { AlertProps, AlertRootComponent } from "../alert.types";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@commercetools/nimbus-icons";

const getIconFromColorPalette = (colorPalette: AlertProps["colorPalette"]) => {
  switch (colorPalette) {
    case "critical":
      return <ErrorOutline />;
    case "info":
      return <Info />;
    case "warning":
      return <WarningAmber />;
    case "positive":
      return <CheckCircleOutline />;
    default:
      return null;
  }
};

/**
 * Alert.Root - Provides feedback to the user about the status of an action or system event
 *
 * @supportsStyleProps
 */
export const AlertRoot: AlertRootComponent = (props) => {
  const { ref, children, hideIcon, ...restProps } = props;

  const childArray = Children.toArray(children);
  const hasCustomIcon = childArray.some(
    (child) => isValidElement(child) && child.type === AlertIcon
  );

  // hideIcon strips any explicit <Alert.Icon> children as well as the auto icon.
  const renderedChildren = hideIcon
    ? childArray.filter(
        (child) => !(isValidElement(child) && child.type === AlertIcon)
      )
    : children;

  const showAutoIcon = !hideIcon && !hasCustomIcon;

  return (
    <AlertRootSlot ref={ref} role="status" {...restProps}>
      {showAutoIcon && (
        <AlertIconSlot alignItems="flex-start">
          {getIconFromColorPalette(restProps.colorPalette)}
        </AlertIconSlot>
      )}
      {renderedChildren}
    </AlertRootSlot>
  );
};

AlertRoot.displayName = "Alert.Root";
```

- [ ] **Step 6: Add `Alert.Icon` to the compound** — in `alert.tsx`:

Add to the import from `./components`:

```tsx
import {
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertDismissButton,
  AlertRoot,
  AlertIcon,
} from "./components";
```

Add this member to the `Alert` object (e.g. right after `Root: AlertRoot,`):

````tsx
  /**
   * # Alert.Icon
   *
   * Optional custom icon. Omit for the automatic status icon; provide to
   * override it. Use the `hideIcon` prop on `Alert.Root` to remove it entirely.
   *
   * @example
   * ```tsx
   * <Alert.Root colorPalette="info">
   *   <Alert.Icon><Sparkle /></Alert.Icon>
   *   <Alert.Title>Custom</Alert.Title>
   * </Alert.Root>
   * ```
   */
  Icon: AlertIcon,
````

Add to the react-docgen export block:

```tsx
  AlertIcon as _AlertIcon,
```

- [ ] **Step 7: Typecheck + run tests**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: PASS. Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add packages/nimbus/src/components/alert/components/alert.icon.tsx \
        packages/nimbus/src/components/alert/components/index.ts \
        packages/nimbus/src/components/alert/components/alert.root.tsx \
        packages/nimbus/src/components/alert/alert.tsx \
        packages/nimbus/src/components/alert/alert.stories.tsx
git commit -m "feat(alert): public Alert.Icon slot with hideIcon and auto-icon precedence"
```

---

### Task 4: `dismissible` + `onDismiss` convenience (manual slot wins)

**Files:**

- Modify: `packages/nimbus/src/components/alert/components/alert.root.tsx`
- Test: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Consumes: `AlertProps.dismissible`, `AlertProps.onDismiss` (Task 1);
  `AlertDismissButton` (existing).
- Produces: when `dismissible` and no manual `Alert.DismissButton` child,
  `AlertRoot` renders a built-in dismiss button wired to `onDismiss`.

- [ ] **Step 1: Write failing tests** — append to `alert.stories.tsx`:

```tsx
const mockDismissibleProp = fn();
export const DismissibleProp: Story = {
  name: "Dismiss: dismissible prop",
  args: {
    colorPalette: "info",
    dismissible: true,
    onDismiss: mockDismissibleProp,
    "data-testid": "dismissible-alert",
    children: <Alert.Title>Dismiss me</Alert.Title>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("auto-renders a single dismiss button", async () => {
      const buttons = canvas.getAllByRole("button", { name: "Dismiss" });
      await expect(buttons).toHaveLength(1);
    });
    await step("calls onDismiss when pressed", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
      await expect(mockDismissibleProp).toHaveBeenCalledTimes(1);
    });
  },
};

export const ManualDismissWins: Story = {
  name: "Dismiss: manual slot wins over dismissible",
  args: {
    colorPalette: "info",
    dismissible: true,
    onDismiss: fn(),
    "data-testid": "manual-dismiss",
    children: (
      <>
        <Alert.Title>Manual dismiss</Alert.Title>
        <Alert.DismissButton onPress={fn()} data-testid="manual-btn" />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders exactly one dismiss button", async () => {
      const buttons = canvas.getAllByRole("button", { name: "Dismiss" });
      await expect(buttons).toHaveLength(1);
    });
  },
};
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: FAIL — `dismissible`/`onDismiss` are not consumed; `DismissibleProp`
renders no button.

- [ ] **Step 3: Update the root** — in `components/alert.root.tsx`:

Add `AlertDismissButton` to the components import:

```tsx
import { AlertIcon } from "./alert.icon";
import { AlertDismissButton } from "./alert.dismiss-button";
```

Change the destructure to pull the new props:

```tsx
const { ref, children, hideIcon, dismissible, onDismiss, ...restProps } = props;
```

Add manual-dismiss detection next to `hasCustomIcon`:

```tsx
const hasManualDismiss = childArray.some(
  (child) => isValidElement(child) && child.type === AlertDismissButton
);
```

Render the built-in dismiss button after `{renderedChildren}`:

```tsx
{
  renderedChildren;
}
{
  dismissible && !hasManualDismiss && (
    <AlertDismissButton onPress={onDismiss} />
  );
}
```

- [ ] **Step 4: Typecheck + run tests**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: PASS. Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/nimbus/src/components/alert/components/alert.root.tsx \
        packages/nimbus/src/components/alert/alert.stories.tsx
git commit -m "feat(alert): add dismissible + onDismiss convenience"
```

---

### Task 5: `Alert.Title` → Heading, `Alert.Description` → Text

**Files:**

- Modify: `packages/nimbus/src/components/alert/components/alert.title.tsx`
- Modify:
  `packages/nimbus/src/components/alert/components/alert.description.tsx`
- Test: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Consumes: `AlertTitleProps` (HeadingProps-based), `AlertDescriptionProps`
  (TextProps-based) from Task 1.
- Produces: `Alert.Title` renders Nimbus `Heading` (default `as="p"`,
  overridable); `Alert.Description` renders Nimbus `Text`.

- [ ] **Step 1: Write failing tests** — append to `alert.stories.tsx`:

```tsx
export const TitleRendersHeading: Story = {
  name: "Semantics: Title is a Heading",
  render: () => (
    <>
      <Alert.Root data-testid="title-default" colorPalette="info">
        <Alert.Title>Default title</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="title-h2" colorPalette="info">
        <Alert.Title as="h2">Heading title</Alert.Title>
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Title defaults to a non-heading element", async () => {
      await expect(canvas.getByText("Default title").tagName).toBe("P");
    });
    await step("Title can be promoted to a heading via as", async () => {
      await expect(canvas.getByText("Heading title").tagName).toBe("H2");
    });
  },
};
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: FAIL — Title currently renders a `div`; `as` is not accepted.

- [ ] **Step 3: Rewrite the title component** — replace the entire contents of
      `components/alert.title.tsx` with:

```tsx
import { AlertTitle as AlertTitleSlot } from "../alert.slots";
import type { AlertTitleProps } from "../alert.types";
import { Heading } from "../../heading/heading";

/**
 * Alert.Title - Displays the title text for the alert.
 *
 * Renders the Nimbus `Heading`. Defaults to a non-heading element (`as="p"`)
 * so it does not inject into the document outline; pass `as="h2"` (etc.) to
 * make it a real heading when the page hierarchy warrants it.
 *
 * @supportsStyleProps
 */
export const AlertTitle = (props: AlertTitleProps) => {
  const { ref: forwardedRef, children, as = "p", ...restProps } = props;

  return (
    <AlertTitleSlot asChild {...restProps}>
      <Heading ref={forwardedRef} as={as} fontWeight="600">
        {children}
      </Heading>
    </AlertTitleSlot>
  );
};

AlertTitle.displayName = "Alert.Title";
```

- [ ] **Step 4: Rewrite the description component** — replace the entire
      contents of `components/alert.description.tsx` with:

```tsx
import { AlertDescription as AlertDescriptionSlot } from "../alert.slots";
import type { AlertDescriptionProps } from "../alert.types";
import { Text } from "../../text/text";

/**
 * Alert.Description - Displays the description text for the alert.
 *
 * Renders the Nimbus `Text` primitive.
 *
 * @supportsStyleProps
 */
export const AlertDescription = (props: AlertDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <AlertDescriptionSlot asChild {...restProps}>
      <Text ref={forwardedRef}>{children}</Text>
    </AlertDescriptionSlot>
  );
};

AlertDescription.displayName = "Alert.Description";
```

- [ ] **Step 5: Typecheck + run tests**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: PASS. Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS (existing text-based stories still find their text; new heading
test green).

- [ ] **Step 6: Commit**

```bash
git add packages/nimbus/src/components/alert/components/alert.title.tsx \
        packages/nimbus/src/components/alert/components/alert.description.tsx \
        packages/nimbus/src/components/alert/alert.stories.tsx
git commit -m "feat(alert): render Title as Heading and Description as Text"
```

---

### Task 6: Fix `Alert.DismissButton` prop forwarding

**Files:**

- Modify:
  `packages/nimbus/src/components/alert/components/alert.dismiss-button.tsx`
- Test: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Produces: consumer-supplied props (incl. `variant`, `size`, `aria-label`)
  reach the interior `IconButton`; the ghost/`2xs` defaults become overridable.

- [ ] **Step 1: Write failing test** — append to `alert.stories.tsx`:

Note: `aria-label` is already written before `{...props}` today, so it is
already overridable — do NOT test that (it would pass before the fix). The
actually-locked props are `variant` and `size` (written _after_ the spread), so
the test targets a `variant` override, observable via the button's background.

```tsx
export const DismissButtonVariantOverride: Story = {
  name: "Dismiss: consumer variant reaches the button",
  render: () => (
    <>
      <Alert.Root data-testid="db-default" colorPalette="info">
        <Alert.Title>Default dismiss</Alert.Title>
        <Alert.DismissButton data-testid="btn-default" onPress={fn()} />
      </Alert.Root>
      <Alert.Root data-testid="db-solid" colorPalette="info">
        <Alert.Title>Solid dismiss</Alert.Title>
        <Alert.DismissButton
          data-testid="btn-solid"
          variant="solid"
          onPress={fn()}
        />
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("variant override changes the button background", async () => {
      // Default dismiss is "ghost" (transparent); "solid" must differ.
      const def = getComputedStyle(canvas.getByTestId("btn-default"));
      const solid = getComputedStyle(canvas.getByTestId("btn-solid"));
      await expect(solid.backgroundColor).not.toBe(def.backgroundColor);
    });
  },
};
```

- [ ] **Step 2: Run test to verify it fails**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: FAIL — today `variant="ghost"` is hardcoded _after_ `{...props}`, so
the consumer `variant="solid"` is dropped and both buttons render identically
(same background), so `not.toBe` fails.

- [ ] **Step 3: Fix the dismiss button** — replace the `return (...)` in
      `components/alert.dismiss-button.tsx` so defaults precede the spread:

```tsx
return (
  <AlertDismissButtonSlot>
    <IconButton
      aria-label={msg.format("dismiss")}
      variant="ghost"
      size="2xs"
      {...props}
    >
      <Clear role="img" />
    </IconButton>
  </AlertDismissButtonSlot>
);
```

(Defaults `aria-label`, `variant`, `size` now precede `{...props}`, so any
consumer-supplied value wins.)

- [ ] **Step 4: Run test to verify it passes**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/nimbus/src/components/alert/components/alert.dismiss-button.tsx \
        packages/nimbus/src/components/alert/alert.stories.tsx
git commit -m "fix(alert): forward consumer props to the dismiss IconButton"
```

---

### Task 7: Add showcase + migrated agent-confirmation stories

Migrates FeedbackCard's pedagogical examples into Alert (as `layout="inline"`)
before FeedbackCard is deleted, and adds emphasis/banner showcases.

**Files:**

- Modify: `packages/nimbus/src/components/alert/alert.stories.tsx`

**Interfaces:**

- Consumes: everything from Tasks 1–6.

- [ ] **Step 1: Update the `variants` list** at the top of `alert.stories.tsx`:

```tsx
const variants: AlertProps["variant"][] = [
  "flat",
  "subtle",
  "outline",
  "solid",
];
```

- [ ] **Step 2: Add the emphasis showcase and migrated inline stories** — append
      to `alert.stories.tsx`:

```tsx
export const EmphasisShowcase: Story = {
  name: "Showcase: Emphasis × Status",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {(["info", "positive", "warning", "critical", "neutral"] as const).map(
        (cp) => (
          <Stack key={cp} direction="row" gap="400" width="100%">
            {variants.map((variant) => (
              <Alert.Root
                key={`${cp}-${variant}`}
                colorPalette={cp}
                variant={variant}
              >
                <Alert.Title>
                  {cp} / {variant as string}
                </Alert.Title>
                <Alert.Description>Description.</Alert.Description>
              </Alert.Root>
            ))}
          </Stack>
        )
      )}
    </Stack>
  ),
};

export const BannerLayout: Story = {
  name: "Layout: Banner",
  args: {
    colorPalette: "warning",
    layout: "banner",
    variant: "solid",
    dismissible: true,
    onDismiss: fn(),
    "data-testid": "banner-alert",
    children: (
      <>
        <Alert.Title>Scheduled maintenance</Alert.Title>
        <Alert.Description>
          The system will be unavailable at 02:00 UTC.
        </Alert.Description>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("banner-alert");
    await step("banner spans full width with no radius", async () => {
      await expect(getComputedStyle(root).borderTopLeftRadius).toBe("0px");
    });
  },
};

// --- Migrated from the former FeedbackCard pattern (agent confirmation flows) ---

const onApproveUndo = fn();
export const InlineApproveConfirmation: Story = {
  name: "Inline: Approve confirmation",
  render: () => (
    <Alert.Root
      data-testid="approve"
      layout="inline"
      colorPalette="positive"
      role="group"
      aria-label="Suggestion approved"
      hideIcon
    >
      <Alert.Title>Suggestion approved</Alert.Title>
      <Alert.Description>
        Applied the recommended discount to 3 products.
      </Alert.Description>
      <Alert.Actions>
        <Button variant="outline" onPress={onApproveUndo}>
          Undo
        </Button>
      </Alert.Actions>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders the confirmation copy and undo action", async () => {
      await expect(canvas.getByText("Suggestion approved")).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: /undo/i })
      ).toBeInTheDocument();
    });
    await step("the group has no live-region role", async () => {
      await expect(canvas.getByTestId("approve")).toHaveAttribute(
        "role",
        "group"
      );
    });
    await step("undo action fires", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /undo/i }));
      await expect(onApproveUndo).toHaveBeenCalledTimes(1);
    });
  },
};

const onRejectUndo = fn();
export const InlineRejectConfirmation: Story = {
  name: "Inline: Reject confirmation",
  render: () => (
    <Alert.Root
      data-testid="reject"
      layout="inline"
      colorPalette="critical"
      role="group"
      aria-label="Suggestion rejected"
      hideIcon
    >
      <Alert.Title>Suggestion rejected</Alert.Title>
      <Alert.Description>No changes were applied.</Alert.Description>
      <Alert.Actions>
        <Button variant="outline" onPress={onRejectUndo}>
          Undo
        </Button>
      </Alert.Actions>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("reject action fires", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /undo/i }));
      await expect(onRejectUndo).toHaveBeenCalledTimes(1);
    });
  },
};
```

- [ ] **Step 3: Run tests**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS (all stories green).

- [ ] **Step 4: Commit**

```bash
git add packages/nimbus/src/components/alert/alert.stories.tsx
git commit -m "test(alert): add emphasis/banner showcases and migrated inline confirmations"
```

---

### Task 8: Remove FeedbackCard + revert the guideline exception

**Files:**

- Delete: `packages/nimbus/src/patterns/feedback/` (entire directory)
- Modify: `packages/nimbus/src/patterns/index.ts`
- Modify: `packages/nimbus/src/theme/slot-recipes/index.ts`
- Modify: `docs/file-type-guidelines/component-vs-pattern.md`

**Interfaces:**

- Produces: no `FeedbackCard` export; no `nimbusFeedbackCard` recipe;
  `patterns/feedback` removed.

- [ ] **Step 1: Confirm no stray references remain to migrate**

Run:

```bash
grep -rniI "feedbackcard\|feedback-card\|feedback/feedback" packages/nimbus/src apps/docs --include=*.ts --include=*.tsx --include=*.mdx | grep -v "patterns/feedback/feedback-card/"
```

Expected: only the registry import (`slot-recipes/index.ts`) and the pattern
index (`patterns/index.ts`) appear. If any docs-data or app reference appears,
note it and delete/adjust it in this task.

- [ ] **Step 2: Delete the pattern directory**

```bash
git rm -r packages/nimbus/src/patterns/feedback
```

- [ ] **Step 3: Remove the pattern index re-export** — in
      `packages/nimbus/src/patterns/index.ts`, delete the line:

```tsx
export * from "./feedback";
```

- [ ] **Step 4: Remove the recipe registration** — in
      `packages/nimbus/src/theme/slot-recipes/index.ts`:

Delete the import line:

```tsx
import { feedbackCardRecipe } from "@/patterns/feedback/feedback-card/feedback-card.recipe";
```

Delete the registry entry:

```tsx
  nimbusFeedbackCard: feedbackCardRecipe,
```

- [ ] **Step 5: Revert the guideline exception**

Inspect what commit `33be28fbd` added, then remove exactly those
FeedbackCard-specific "layout-only slot recipe, no variants" additions from
`docs/file-type-guidelines/component-vs-pattern.md`:

```bash
git show 33be28fbd -- docs/file-type-guidelines/component-vs-pattern.md
```

Remove the paragraphs/sections that commit introduced (the FeedbackCard
carve-out) so the guideline no longer documents that exception. Leave unrelated
content intact.

- [ ] **Step 6: Regenerate typings, typecheck, lint**

```bash
pnpm --filter @commercetools/nimbus build-theme-typings
pnpm --filter @commercetools/nimbus typecheck:dev
pnpm lint
```

Expected: all PASS (no dangling `nimbusFeedbackCard` type or import).

- [ ] **Step 7: Run the full Alert story suite (sanity)**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(alert): remove FeedbackCard pattern, fold use case into Alert"
```

---

### Task 9: Documentation sweep

**Files:**

- Modify: `packages/nimbus/src/components/alert/alert.mdx`
- Modify: `packages/nimbus/src/components/alert/alert.dev.mdx`
- Modify: `packages/nimbus/src/components/alert/alert.a11y.mdx`
- Modify: `packages/nimbus/src/components/alert/alert.docs.spec.tsx`
- Modify: `packages/nimbus/src/components/alert/alert.guidelines.mdx`
- Modify: `packages/nimbus/src/components/alert/alert.figma.tsx`
- Modify: `packages/nimbus/src/components/alert/alert.tsx` (JSDoc `tone` →
  `colorPalette`)

**Interfaces:** none (docs only). Use the design doc §5 as the content source.

- [ ] **Step 1: Fix the overview copy** — in `alert.mdx`, replace the incorrect
      "icon buttons" description (the copy-paste leftover, ~line 26) with an
      Alert-specific overview sentence, e.g.:

```md
Alerts provide feedback to the user about the status of an action or system
event.
```

Also review the `order:` frontmatter value (placeholder-looking `999`) and set
it to the intended sort weight for the feedback section (match sibling
components' scale).

- [ ] **Step 2: Fix the compound JSDoc examples** — in `alert.tsx`, the JSDoc
      examples use a non-existent `tone` prop. Replace every `tone="..."` in
      JSDoc `@example` blocks with `colorPalette="..."` (there are examples on
      `Alert`, `Alert.Root`, `Alert.Title`, `Alert.Description`,
      `Alert.Actions`, `Alert.DismissButton`).

- [ ] **Step 3: Rewrite the a11y doc to match reality** — in `alert.a11y.mdx`:
  - State the real default: `Alert.Root` renders `role="status"` (polite live
    region) and is overridable via the native `role` prop.
  - Document `role="alert"` for critical/interrupting alerts and
    `role="group"` + `aria-label` for silent (inline confirmation) usage.
  - **Remove** the unfulfilled promises: Esc-to-dismiss keyboard support, and
    any claim that the component sets `aria-live`/`aria-atomic` itself (they
    come implicitly from `role`).
  - Add the **live-region priming** note: to reliably announce a dynamically
    shown alert, keep a persistent container mounted and toggle the alert's
    content (or use an imperative announcer), because a live region must exist
    before its content changes.

- [ ] **Step 4: Document the new API in the dev doc** — in `alert.dev.mdx`, add
      sections (with runnable snippets) for:
  - **Emphasis** (`variant`: `flat`/`subtle`/`outline`/`solid`; note `outlined`
    is a deprecated alias for `subtle`; default is `subtle`).
  - **Layout** (`stack`/`inline`/`banner`) with the inline confirmation example:
    ```tsx
    <Alert.Root
      layout="inline"
      colorPalette="positive"
      role="group"
      aria-label="Suggestion approved"
      hideIcon
    >
      <Alert.Title>Suggestion approved</Alert.Title>
      <Alert.Description>
        Applied the recommended discount to 3 products.
      </Alert.Description>
      <Alert.Actions>
        <Button variant="outline" onPress={onUndo}>
          Undo
        </Button>
      </Alert.Actions>
    </Alert.Root>
    ```
  - **Icon control**: `Alert.Icon` custom slot and the `hideIcon` prop.
  - **Dismissal**: the `dismissible` + `onDismiss` convenience and the
    composable `Alert.DismissButton`.
  - **Announcement guidance**: default polite, `role="alert"` for critical.
  - Remove any statement that `outlined` is the default (it's `subtle` now) and
    any Esc-to-dismiss claim.

- [ ] **Step 5: Update the consumer examples spec** — in `alert.docs.spec.tsx`,
      give the sample alerts an explicit `colorPalette` (status) so examples are
      not icon-less/untoned, and add at least one `layout="inline"` confirmation
      example mirroring the dev doc.

- [ ] **Step 6: Update guidelines** — in `alert.guidelines.mdx`, add guidance:
      when to use `stack` vs `inline` vs `banner`; when to use
      `subtle`/`outline`/`solid`; and polite (`status`) vs assertive (`alert`)
      announcement.

- [ ] **Step 7: Realign Figma Code Connect** — in `alert.figma.tsx`, update the
      props mapping to the new `variant` values and the `layout` axis; reconcile
      the `Ghost→flat` naming and the unmodeled "Clear button" boolean (map it
      to `dismissible` if the Figma component exposes it).

- [ ] **Step 8: Verify docs build inputs**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: PASS (the
`.docs.spec.tsx` compiles). Run:
`pnpm test:storybook:dev packages/nimbus/src/components/alert/alert.stories.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add packages/nimbus/src/components/alert
git commit -m "docs(alert): document emphasis/layout/icon/dismiss + correct a11y guidance"
```

---

### Task 10: Changeset

**Files:**

- Create: `.changeset/alert-feedbackcard-merge.md`

- [ ] **Step 1: Write the changeset** — create
      `.changeset/alert-feedbackcard-merge.md`:

```md
---
"@commercetools/nimbus": minor
---

**Alert: layout + emphasis variants, neutral status, configurable announcement,
and a public icon slot**

Alert now covers the inline agent-confirmation use case previously served by the
(unreleased) FeedbackCard pattern, which has been removed.

New capabilities:

- `layout="stack" | "inline" | "banner"` — the default `stack`, a horizontal
  `inline` row (content leading, actions trailing, wraps on narrow widths), and
  a full-width `banner`.
- `variant="flat" | "subtle" | "outline" | "solid"` emphasis. `subtle` is now
  the default. `variant="outlined"` is a deprecated alias for `subtle` and
  renders identically.
- `colorPalette="neutral"` is now supported in addition to
  `info`/`positive`/`warning`/`critical`.
- `Alert.Icon` is now a public slot for a custom icon; `hideIcon` removes the
  icon entirely.
- `dismissible` + `onDismiss` render a built-in localized dismiss button (the
  composable `Alert.DismissButton` still works).
- `Alert.Title` now renders a `Heading` (defaulting to a non-heading element;
  use `as` to promote it); `Alert.Description` renders `Text`.

**Behavior changes (please review):**

- The default announcement politeness changed from assertive to polite:
  `Alert.Root` now defaults to `role="status"` instead of `role="alert"`. **Add
  `role="alert"` to any critical alert that must interrupt the user
  immediately.** The `role` prop is now overridable.
- Rendering an Alert without a `variant` now applies the `subtle` surface
  (previously it rendered unstyled). `variant="outlined"` and `variant="flat"`
  are unchanged.
```

- [ ] **Step 2: Verify changeset status**

Run: `pnpm changeset:status` Expected: lists `@commercetools/nimbus` as a
`minor` bump.

- [ ] **Step 3: Commit**

```bash
git add .changeset/alert-feedbackcard-merge.md
git commit -m "chore(alert): add changeset for FeedbackCard merge"
```

---

## Final Verification (after all tasks)

- [ ] Build the package and run the built-bundle story tests (CI parity):
  ```bash
  pnpm --filter @commercetools/nimbus build
  pnpm test:storybook packages/nimbus/src/components/alert/alert.stories.tsx
  ```
  Expected: PASS.
- [ ] Strict typecheck across the built surface:
  ```bash
  pnpm --filter @commercetools/nimbus typecheck
  ```
  Expected: PASS.
- [ ] Lint clean: `pnpm lint`.
- [ ] Visually verify `inline` (wrap on narrow) and `banner` (edge-to-edge,
      correct text contrast on `solid`) in Storybook — these layouts have
      responsive/cross-variant behavior that structural tests only partially
      cover. Use `pnpm start:storybook`.

```

```
