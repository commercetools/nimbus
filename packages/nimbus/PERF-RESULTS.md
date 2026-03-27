# Render Performance Optimization Results — mar19

## Mount Performance (p95, 100 iterations)

| Component      | Baseline p95 | Optimized p95 | Best Observed | p95 Change | Baseline avg | Optimized avg | avg Change |
| -------------- | ------------ | ------------- | ------------- | ---------- | ------------ | ------------- | ---------- |
| **Button**     | 0.66ms       | 0.63ms        | 0.52ms        | **-5%**    | 0.56ms       | 0.47ms        | **-16%**   |
| **TextInput**  | 0.89ms       | 0.72ms        | 0.66ms        | **-19%**   | 0.65ms       | 0.53ms        | **-18%**   |
| **Checkbox**   | 1.93ms       | 1.53ms        | 1.34ms        | **-21%**   | 1.46ms       | 1.19ms        | **-18%**   |
| **Badge**      | 0.33ms       | 0.24ms        | 0.21ms        | **-27%**   | 0.22ms       | 0.19ms        | **-14%**   |
| **IconButton** | 0.57ms       | 0.44ms        | 0.40ms        | **-23%**   | 0.44ms       | 0.35ms        | **-20%**   |
| **Text**       | 0.20ms       | 0.18ms        | 0.15ms        | **-10%**   | 0.14ms       | 0.13ms        | **-7%**    |
| **Link**       | 0.34ms       | 0.35ms        | 0.29ms        | ~0%        | 0.29ms       | 0.26ms        | **-10%**   |
| **Switch**     | 1.66ms       | 1.39ms        | 1.27ms        | **-16%**   | 1.31ms       | 1.17ms        | **-11%**   |

## New Component Benchmarks (no baseline comparison)

| Component          | p95    | avg    |
| ------------------ | ------ | ------ |
| **Select**         | 3.39ms | 1.81ms |
| **Tooltip**        | 0.68ms | 0.53ms |
| **Separator**      | 0.34ms | 0.24ms |
| **Heading**        | 0.23ms | 0.17ms |
| **LoadingSpinner** | 0.41ms | 0.32ms |

## Re-render Performance

| Scenario                     | p95        |
| ---------------------------- | ---------- |
| Same props (React.memo skip) | **0.00ms** |
| Button prop change           | 0.17ms     |
| Checkbox prop change         | 0.30ms     |

## Optimizations Applied

1. **`extractStyleProps` caching** — `isValidProperty` results cached in
   `Object.create(null)`, build-objects-directly instead of spread+delete, fast
   path for empty props, lazy styleProps allocation
2. **Ref simplification** — removed redundant
   `useRef + useObjectRef + mergeRefs` triple in Button, Link, SelectRoot,
   IconButton, Badge, ProgressBar, Kbd
3. **`React.memo`** — applied to 25+ components: Button, TextInput, Checkbox,
   Badge, IconButton, Text, Link, Switch, SelectRoot, SelectOption,
   SelectClearButton, Flex, Box, Stack, Heading, Separator, Spacer, Grid,
   SimpleGrid, Image, Icon, ProgressBar, ToggleButton, LoadingSpinner,
   VisuallyHidden, InlineSvg, AlertRoot
4. **TextInput context skip** — skip `useMemo` + `mergeProps` for context
   normalization when no `InputContext` is present
5. **Checkbox cleanup** — removed duplicate `useSlotRecipe` call (withProvider
   already handles it)
6. **Select DOM reduction** — replaced `chakra.div` with plain `<div>` for the
   positioning wrapper

## Test Verification

- **819/819** storybook tests pass (full suite verified)
- **9/9** visual regression screenshots match
- **0** test regressions from any optimization

## Methodology

- **Harness**: React Profiler API capturing `actualDuration` per mount/unmount
  cycle
- **Environment**: JSDOM via Vitest, 100 iterations per component
- **Baseline**: 50-iteration measurements at commit 9359332 (before any
  optimizations)
- **Optimized**: 3-run median at commit f3dbd73 (100 iterations)
- **Visual regression**: `toMatchScreenshot` via `@vitest/browser` with
  pixelmatch (3% threshold)
