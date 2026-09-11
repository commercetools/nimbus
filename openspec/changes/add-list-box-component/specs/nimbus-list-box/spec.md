# nimbus-list-box

## Overview

`ListBox` is a standalone, accessible selection-list component built on React
Aria's `ListBox`. It renders a list of options that a user can select one or
many of, with keyboard navigation, sections, rich item content, drag-and-drop,
and empty / loading / disabled states. It is the reusable building block behind
overlay selection surfaces (Select, ComboBox) and also works on its own.

## Purpose

Give consumers one selection-list component that is usable both standalone
(settings/filter lists, pickers, command palettes) and embedded inside an
overlay, matching Nimbus's established list conventions so it can later back
Select and ComboBox.

## Requirements

## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL expose a compound API under a single `ListBox` namespace.

#### Scenario: Component parts
- **WHEN** a consumer imports `ListBox`
- **THEN** `ListBox.Root` SHALL render the list container
- **AND** `ListBox.Item` SHALL render a selectable option
- **AND** `ListBox.Section` SHALL render a labelled group of options
- **AND** each part SHALL set a `displayName` of `ListBox.Root`, `ListBox.Item`, `ListBox.Section`

### Requirement: Selection Modes

The component SHALL support no selection, single selection, and multiple
selection, controlled by React Aria's `selectionMode` and selection value props.

#### Scenario: Single selection
- **WHEN** `selectionMode="single"`
- **THEN** selecting an option SHALL replace any previous selection
- **AND** the selected option SHALL be indicated by a full-row background highlight
- **AND** the selected option's highlight SHALL remain at least as prominent while the option is hovered or keyboard-focused (never weaker than the resting selected state)
- **AND** no checkbox or checkmark SHALL be rendered

#### Scenario: Multiple selection
- **WHEN** `selectionMode="multiple"`
- **THEN** selecting options SHALL toggle each option independently
- **AND** each option SHALL render a leading checkbox indicator reflecting its selected state
- **AND** the resting full-row highlight SHALL be suppressed in favour of the checkbox, while a hovered or keyboard-focused option SHALL still show the ordinary interaction highlight

#### Scenario: No selection
- **WHEN** `selectionMode` is unset or `"none"`
- **THEN** options SHALL NOT be selectable
- **AND** activating an option SHALL still fire its `onAction` handler when provided

#### Scenario: Controlled and uncontrolled selection
- **WHEN** `selectedKeys` (controlled) or `defaultSelectedKeys` (uncontrolled) is provided
- **THEN** the component SHALL reflect that selection
- **AND** SHALL call `onSelectionChange` with the new selection when it changes

### Requirement: Section Grouping

The component SHALL group options into sections with an optional header.

#### Scenario: Section with header
- **WHEN** options are wrapped in `ListBox.Section` with a header
- **THEN** SHALL render the header text above the group
- **AND** SHALL associate the group with its header for assistive technology
- **AND** SHALL NOT make the header selectable or focusable as an option

#### Scenario: Section without header
- **WHEN** a `ListBox.Section` is rendered without a `label`
- **THEN** SHALL NOT render a header element for the group
- **AND** SHALL require an `aria-label` on the section so the group retains an accessible name for assistive technology

### Requirement: Rich Item Content

An option SHALL support content beyond a plain text label.

#### Scenario: Label and description
- **WHEN** an item provides a primary label and a secondary description (React Aria `Text` label/description slots)
- **THEN** SHALL render the label as the primary line
- **AND** SHALL render the description as secondary text
- **AND** SHALL use the description as part of the accessible description of the option

#### Scenario: Leading and trailing content
- **WHEN** an item provides leading media (icon or avatar) and/or trailing content
- **THEN** SHALL render leading content before the label
- **AND** SHALL render trailing content after the label
- **AND** SHALL keep the label as the type-ahead text value unless `textValue` is provided

### Requirement: Size Variant

The component SHALL offer a size variant matching the shared Nimbus size scale.

#### Scenario: Size scale
- **WHEN** a `size` value from the shared scale is set on `ListBox.Root`
- **THEN** SHALL apply the matching option height, text style, spacing, and leading-media size from design tokens
- **AND** SHALL apply the size consistently to every option and section header
- **AND** SHALL default to the scale's default size when `size` is omitted

### Requirement: Container Variant

The component SHALL offer a container variant so it can be used standalone or embedded.

#### Scenario: Card container (default)
- **WHEN** `variant="card"` or `variant` is omitted
- **THEN** SHALL render a surface with background, `borderRadius` `200`, elevation shadow `5`, inner padding `200`, a bounded `maxHeight` (~`40svh`), and vertical scrolling with a thin scrollbar

#### Scenario: Plain container
- **WHEN** `variant="plain"`
- **THEN** SHALL render the list with no surface background, no shadow, and no bounded max-height
- **AND** SHALL be suitable for embedding inside an already-carded overlay

### Requirement: Keyboard Navigation

The component SHALL be fully operable by keyboard via React Aria.

#### Scenario: Arrow navigation and type-ahead
- **WHEN** the listbox has focus
- **THEN** Up/Down arrows SHALL move focus between options
- **AND** Home/End SHALL move to the first/last option
- **AND** typing SHALL move focus to the next option matching the typed characters
- **AND** disabled options SHALL be skipped by navigation as configured

#### Scenario: Selecting by keyboard
- **WHEN** an option is focused and selection is enabled
- **THEN** Enter or Space SHALL select it according to the selection mode

### Requirement: Drag and Drop

The component SHALL support drag-and-drop reordering when drag-and-drop hooks are provided.

#### Scenario: Reordering with dragAndDropHooks
- **WHEN** `dragAndDropHooks` from React Aria's `useDragAndDrop` is passed to `ListBox.Root`
- **THEN** options SHALL be draggable
- **AND** SHALL show a drop indicator at the target position
- **AND** SHALL expose `[data-dragging]` and `[data-drop-target]` state for styling

### Requirement: Empty State

The component SHALL render a styled empty state when it has no options.

#### Scenario: Default empty state
- **WHEN** the collection is empty
- **THEN** SHALL render the `emptyState` slot in place of options
- **AND** SHALL display the localized `Nimbus.ListBox.emptyState` message, defaulting to "No options available"
- **AND** SHALL expose the `[data-empty]` state on the root

#### Scenario: Custom empty state
- **WHEN** a `renderEmptyState` render function is provided
- **THEN** SHALL render its output instead of the default message

### Requirement: Loading State

The component SHALL support an in-list loading affordance for asynchronous lists.

#### Scenario: Load-more spinner
- **WHEN** an async list is loading more items via React Aria's `ListBoxLoadMoreItem` with `isLoading`
- **THEN** SHALL render the `loader` slot with a loading spinner as a non-selectable, non-focusable row
- **AND** SHALL remove it once loading completes

### Requirement: Disabled Options

The component SHALL visually and functionally disable individual options.

#### Scenario: Disabled item
- **WHEN** an option is disabled (via `isDisabled` or `disabledKeys`)
- **THEN** SHALL apply `layerStyle: "disabled"` (reduced opacity, `not-allowed` cursor) keyed on `[data-disabled]`
- **AND** SHALL NOT allow it to be selected or activated by pointer or keyboard

### Requirement: ARIA ListBox Pattern

The component SHALL implement the WAI-ARIA listbox pattern via React Aria.

#### Scenario: Roles and state
- **WHEN** the component renders
- **THEN** the container SHALL expose `role="listbox"` and options `role="option"`
- **AND** selected options SHALL expose `aria-selected`
- **AND** multi-select SHALL expose `aria-multiselectable="true"`
- **AND** the interactive surface SHALL meet WCAG 2.1 AA contrast and focus-visibility requirements

#### Scenario: Labelling
- **WHEN** the listbox is given an accessible name via `aria-label` or `aria-labelledby`
- **THEN** SHALL apply it to the listbox container

### Requirement: Multi-Slot Recipe

The component SHALL be styled with a Chakra multi-slot recipe registered in the theme.

#### Scenario: Recipe registration
- **WHEN** the theme is built
- **THEN** the recipe SHALL be registered as `nimbusListBox` in `theme/slot-recipes/index.ts`
- **AND** the slots file SHALL bind to it via `createSlotRecipeContext({ key: "nimbusListBox" })`

#### Scenario: Token-based styling
- **WHEN** any slot is styled
- **THEN** SHALL use design tokens only (no hardcoded colors or spacing)
- **AND** SHALL namespace CSS variables by the component name
