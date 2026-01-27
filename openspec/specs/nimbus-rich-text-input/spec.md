# Specification: RichTextInput Component

## Overview

The RichTextInput component provides a WYSIWYG (What You See Is What You Get) rich text editor with comprehensive formatting capabilities. Built on Slate.js, it enables users to create formatted content with text styling, headings, lists, links, and block elements through an intuitive toolbar interface with keyboard shortcuts.

**Component:** `RichTextInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component with external dependency
**External Dependency:** `slate`, `slate-react`, `slate-history`
**i18n Messages:** 24 (toolbar buttons, text styles, formatting options)
**Purpose:** Rich text content creation and editing with WYSIWYG formatting

## Purpose

Provide an accessible rich text editor that allows users to create and edit formatted content with text styling (bold, italic, underline, strikethrough), block types (headings, paragraphs, quotes, code blocks), lists (ordered, unordered, nested), and links. The component handles HTML serialization automatically and supports keyboard shortcuts for efficient content creation while maintaining WCAG 2.1 AA compliance.

## Requirements

### Requirement: Slate.js Integration
The component SHALL use Slate.js as the underlying rich text editing framework.

#### Scenario: Editor initialization
- **WHEN** component mounts
- **THEN** SHALL create Slate editor with createEditor()
- **AND** SHALL apply withReact plugin for React integration
- **AND** SHALL apply withHistory plugin for undo/redo support
- **AND** SHALL apply withLinks plugin for automatic link detection
- **AND** editor instance SHALL be memoized and persist across renders

#### Scenario: Slate value structure
- **WHEN** editor manages content
- **THEN** SHALL use Descendant[] as internal value type
- **AND** SHALL use CustomElement type for block elements
- **AND** SHALL use CustomText type for text nodes with formatting marks
- **AND** SHALL maintain valid Slate tree structure at all times

#### Scenario: HTML serialization
- **WHEN** component receives HTML value
- **THEN** SHALL parse HTML using fromHTML() utility
- **AND** SHALL convert to Slate Descendant[] structure
- **AND** SHALL handle invalid HTML gracefully with empty value fallback
- **WHEN** content changes
- **THEN** SHALL serialize Slate value using toHTML() utility
- **AND** SHALL call onChange with HTML string (not Slate structure)
- **AND** SHALL preserve all formatting during round-trip conversion

#### Scenario: Value validation
- **WHEN** Slate value is set or updated
- **THEN** SHALL validate using validSlateStateAdapter()
- **AND** SHALL ensure all nodes have children arrays
- **AND** SHALL ensure all elements are valid CustomElement types
- **AND** SHALL create empty paragraph if value is empty or invalid
- **AND** SHALL normalize malformed nodes to valid structure

### Requirement: HTML Value API
The component SHALL use HTML strings as the public API value format.

#### Scenario: Value prop (controlled)
- **WHEN** value prop is provided with HTML string
- **THEN** SHALL parse HTML to Slate structure
- **AND** SHALL render parsed content in editor
- **AND** SHALL update editor when value prop changes
- **AND** SHALL track serialized value to prevent unnecessary updates

#### Scenario: DefaultValue prop (uncontrolled)
- **WHEN** defaultValue prop is provided without value prop
- **THEN** SHALL parse HTML to Slate structure on mount
- **AND** SHALL initialize editor with parsed content
- **AND** SHALL NOT update when defaultValue prop changes after mount
- **AND** SHALL manage state internally

#### Scenario: OnChange callback
- **WHEN** editor content changes
- **THEN** SHALL serialize Slate value to HTML string
- **AND** SHALL call onChange with HTML string (never Slate structure)
- **AND** SHALL only call onChange if serialized HTML actually changed
- **AND** SHALL NOT call onChange for selection-only changes

#### Scenario: Empty value handling
- **WHEN** value or defaultValue is empty string or undefined
- **THEN** SHALL initialize with createEmptyValue() (single paragraph with empty text)
- **AND** SHALL display placeholder text
- **AND** SHALL serialize to empty string or single empty paragraph tag

### Requirement: Supported HTML Elements
The component SHALL support specific HTML elements for content structure.

#### Scenario: Block elements support
- **WHEN** HTML is parsed or content is created
- **THEN** SHALL support `<p>` (paragraph) as default block type
- **AND** SHALL support `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>` (headings)
- **AND** SHALL support `<blockquote>` (block quote)
- **AND** SHALL support `<pre><code>` (code block)
- **AND** SHALL support `<ul>` (unordered list)
- **AND** SHALL support `<ol>` (ordered list)
- **AND** SHALL support `<li>` (list item)
- **AND** SHALL support `<a href="...">` (link with URL)

#### Scenario: Inline formatting support
- **WHEN** text formatting is applied
- **THEN** SHALL support `<strong>` and `<b>` (bold)
- **AND** SHALL support `<em>` and `<i>` (italic)
- **AND** SHALL support `<u>` (underline)
- **AND** SHALL support `<del>` and `<s>` (strikethrough)
- **AND** SHALL support `<code>` (inline code)
- **AND** SHALL support `<sup>` (superscript)
- **AND** SHALL support `<sub>` (subscript)

#### Scenario: HTML rendering
- **WHEN** Slate content is rendered in editor
- **THEN** SHALL use Element component for block elements
- **AND** SHALL use Leaf component for text formatting
- **AND** SHALL render semantic HTML elements (p, h1-h5, ul, ol, li, blockquote, a, etc.)
- **AND** SHALL apply appropriate attributes (href for links, textAlign for alignment)
- **AND** SHALL nest formatting marks correctly (strong, em, u, del, sup, sub, code)

### Requirement: Formatting Toolbar
The component SHALL provide a toolbar with formatting controls.

#### Scenario: Toolbar rendering
- **WHEN** component renders and isReadOnly is false
- **THEN** SHALL display RichTextToolbar above editor
- **AND** toolbar SHALL contain text style menu, format buttons, list buttons, undo/redo buttons
- **AND** toolbar SHALL be wrapped in RichTextInputToolbarSlot
- **AND** toolbar SHALL have role="toolbar" and aria-label="Text formatting"
- **WHEN** isReadOnly is true
- **THEN** SHALL NOT render toolbar

#### Scenario: Text style menu
- **WHEN** toolbar renders
- **THEN** SHALL display text style dropdown menu button
- **AND** menu SHALL show current block type label (Paragraph, Heading 1, etc.)
- **AND** menu SHALL include options: Paragraph, Heading 1-5, Quote
- **AND** menu trigger SHALL have aria-label="Text style menu"
- **AND** menu SHALL have Tooltip with "Text style" on hover
- **AND** selecting style SHALL apply block format to current selection/paragraph

#### Scenario: Text formatting toggle buttons
- **WHEN** toolbar renders
- **THEN** SHALL display Bold, Italic, Underline toggle buttons
- **AND** buttons SHALL use ToggleButtonGroup with multiple selection
- **AND** buttons SHALL show pressed state when format is active
- **AND** Bold button SHALL have icon FormatBold and aria-label="Bold"
- **AND** Italic button SHALL have icon FormatItalic and aria-label="Italic"
- **AND** Underline button SHALL have icon FormatUnderlined and aria-label="Underline"
- **AND** each button SHALL have Tooltip on hover

#### Scenario: More formatting menu
- **WHEN** toolbar renders
- **THEN** SHALL display "More formatting options" menu button
- **AND** menu SHALL include: Strikethrough, Code, Superscript, Subscript
- **AND** menu button SHALL have aria-label="More formatting options"
- **AND** menu items SHALL show checkmark when format is active
- **AND** selecting item SHALL toggle that format on/off
- **AND** Superscript and Subscript SHALL be mutually exclusive

#### Scenario: List toggle buttons
- **WHEN** toolbar renders
- **THEN** SHALL display Bulleted List and Numbered List toggle buttons
- **AND** buttons SHALL use ToggleButtonGroup with single selection
- **AND** Bulleted List button SHALL have icon FormatListBulleted
- **AND** Numbered List button SHALL have icon FormatListNumbered
- **AND** selecting list type SHALL wrap current block in list
- **AND** toggling off SHALL unwrap list and return to paragraph
- **AND** buttons SHALL have aria-label for accessibility

#### Scenario: Undo/redo buttons
- **WHEN** toolbar renders
- **THEN** SHALL display Undo and Redo buttons at right edge
- **AND** Undo button SHALL have icon Undo and aria-label="Undo"
- **AND** Redo button SHALL have icon Redo and aria-label="Redo"
- **AND** Undo SHALL be disabled when no undos available (!hasUndos)
- **AND** Redo SHALL be disabled when no redos available (!hasRedos)
- **AND** clicking Undo SHALL call editor.undo()
- **AND** clicking Redo SHALL call editor.redo()

#### Scenario: Toolbar state synchronization
- **WHEN** editor selection or content changes
- **THEN** SHALL update toolbar button states to reflect active formats
- **AND** SHALL update text style menu to show current block type
- **AND** SHALL check formatting marks at current selection
- **AND** SHALL show toggle buttons as pressed when format is active
- **AND** SHALL update undo/redo button disabled states

#### Scenario: Toolbar interaction with selection preservation
- **WHEN** user clicks toolbar button
- **THEN** SHALL prevent default mousedown to preserve editor selection
- **AND** SHALL apply formatting while maintaining cursor position
- **AND** SHALL use withPreservedSelection hook for selection preservation
- **AND** editor focus SHALL remain in editable area after button click

### Requirement: Text Formatting Marks
The component SHALL support text-level formatting marks.

#### Scenario: Bold formatting
- **WHEN** user applies bold formatting
- **THEN** SHALL add bold: true to CustomText nodes
- **AND** SHALL render with `<strong>` HTML element
- **AND** SHALL serialize to `<strong>` in HTML output
- **AND** SHALL display with fontWeight: 700 in editor
- **AND** SHALL toggle on/off when applied to already-bold text

#### Scenario: Italic formatting
- **WHEN** user applies italic formatting
- **THEN** SHALL add italic: true to CustomText nodes
- **AND** SHALL render with `<em>` HTML element
- **AND** SHALL serialize to `<em>` in HTML output
- **AND** SHALL display with fontStyle: italic in editor
- **AND** SHALL toggle on/off when applied to already-italic text

#### Scenario: Underline formatting
- **WHEN** user applies underline formatting
- **THEN** SHALL add underline: true to CustomText nodes
- **AND** SHALL render with `<u>` HTML element
- **AND** SHALL serialize to `<u>` in HTML output
- **AND** SHALL display with textDecoration: underline in editor
- **AND** SHALL toggle on/off when applied to already-underlined text

#### Scenario: Strikethrough formatting
- **WHEN** user applies strikethrough formatting
- **THEN** SHALL add strikethrough: true to CustomText nodes
- **AND** SHALL render with `<del>` HTML element
- **AND** SHALL serialize to `<del>` in HTML output
- **AND** SHALL display with textDecoration: line-through in editor
- **AND** SHALL toggle on/off when applied to already-strikethrough text

#### Scenario: Inline code formatting
- **WHEN** user applies code formatting
- **THEN** SHALL add code: true to CustomText nodes
- **AND** SHALL render with `<code>` HTML element
- **AND** SHALL serialize to `<code>` in HTML output
- **AND** SHALL display with fontFamily: mono and padding in editor
- **AND** SHALL toggle on/off when applied to already-code text

#### Scenario: Superscript formatting
- **WHEN** user applies superscript formatting
- **THEN** SHALL add superscript: true to CustomText nodes
- **AND** SHALL remove subscript: true if present (mutually exclusive)
- **AND** SHALL render with `<sup>` HTML element
- **AND** SHALL serialize to `<sup>` in HTML output
- **AND** SHALL display with fontSize: 75%, verticalAlign: super in editor

#### Scenario: Subscript formatting
- **WHEN** user applies subscript formatting
- **THEN** SHALL add subscript: true to CustomText nodes
- **AND** SHALL remove superscript: true if present (mutually exclusive)
- **AND** SHALL render with `<sub>` HTML element
- **AND** SHALL serialize to `<sub>` in HTML output
- **AND** SHALL display with fontSize: 75%, verticalAlign: sub in editor

#### Scenario: Combined formatting marks
- **WHEN** multiple formats are applied to same text
- **THEN** SHALL allow combining non-exclusive marks (bold + italic + underline)
- **AND** SHALL nest HTML elements correctly in output
- **AND** SHALL maintain all active marks on CustomText node
- **AND** SHALL render with all applicable styles applied
- **AND** Superscript and Subscript SHALL remain mutually exclusive

#### Scenario: Mark activation detection
- **WHEN** checking if mark is active
- **THEN** SHALL use isMarkActive() with editor and format name
- **AND** SHALL check Editor.marks() for collapsed selection (cursor position)
- **AND** SHALL check all selected text nodes for expanded selection
- **AND** SHALL return true only if ALL selected text has the mark
- **AND** SHALL prioritize unformatted text (mixed selection shows inactive)

### Requirement: Block Type Formatting
The component SHALL support block-level element types.

#### Scenario: Paragraph block
- **WHEN** default or paragraph style is applied
- **THEN** SHALL set CustomElement type to "paragraph"
- **AND** SHALL render with `<p>` HTML element
- **AND** SHALL serialize to `<p>` in HTML output
- **AND** SHALL display with textStyle: "md", fontWeight: 500

#### Scenario: Heading blocks
- **WHEN** heading style is applied
- **THEN** SHALL support heading-one (H1), heading-two (H2), heading-three (H3), heading-four (H4), heading-five (H5)
- **AND** SHALL set CustomElement type to heading type
- **AND** SHALL render with `<h1>`, `<h2>`, `<h3>`, `<h4>`, or `<h5>` HTML element
- **AND** SHALL serialize to corresponding heading tag in HTML output
- **AND** H1 SHALL display with textStyle: "2xl", fontWeight: 500
- **AND** H2 SHALL display with textStyle: "xl", fontWeight: 500
- **AND** H3 SHALL display with textStyle: "lg", fontWeight: 500
- **AND** H4 SHALL display with textStyle: "md", fontWeight: 500
- **AND** H5 SHALL display with textStyle: "xs", fontWeight: 500

#### Scenario: Block quote
- **WHEN** quote style is applied
- **THEN** SHALL set CustomElement type to "block-quote"
- **AND** SHALL render with `<blockquote>` HTML element
- **AND** SHALL serialize to `<blockquote>` in HTML output
- **AND** SHALL display with textStyle: "md", fontWeight: 400, borderLeft, paddingLeft

#### Scenario: Code block
- **WHEN** code block is created
- **THEN** SHALL set CustomElement type to "code"
- **AND** SHALL render with `<pre><code>` HTML elements
- **AND** SHALL serialize to `<pre><code>` in HTML output
- **AND** SHALL display with padding, borderRadius, overflow: auto, fontFamily: mono

#### Scenario: Block type toggle
- **WHEN** user changes block type via text style menu
- **THEN** SHALL use toggleBlock() function
- **AND** SHALL unwrap lists before applying new block type
- **AND** SHALL set new block type using Transforms.setNodes()
- **AND** SHALL apply to current block or all blocks in selection
- **AND** toggling same type SHALL revert to paragraph

#### Scenario: Block activation detection
- **WHEN** checking if block type is active
- **THEN** SHALL use isBlockActive() with editor and format
- **AND** SHALL check Editor.nodes() for matching type in selection
- **AND** SHALL check first block if no selection (programmatic content)
- **AND** SHALL return true if any block in selection matches type

### Requirement: List Formatting
The component SHALL support ordered and unordered lists with nesting.

#### Scenario: Unordered list creation
- **WHEN** user applies bulleted list
- **THEN** SHALL set current block type to "list-item"
- **AND** SHALL wrap list items with "bulleted-list" container
- **AND** SHALL render with `<ul><li>` HTML structure
- **AND** SHALL serialize to `<ul><li>` in HTML output
- **AND** SHALL display with paddingLeft: 600, listStyleType: disc

#### Scenario: Ordered list creation
- **WHEN** user applies numbered list
- **THEN** SHALL set current block type to "list-item"
- **AND** SHALL wrap list items with "numbered-list" container
- **AND** SHALL render with `<ol><li>` HTML structure
- **AND** SHALL serialize to `<ol><li>` in HTML output
- **AND** SHALL display with paddingLeft: 600, listStyleType: decimal

#### Scenario: List type toggle
- **WHEN** user toggles between bulleted and numbered list
- **THEN** SHALL unwrap current list using Transforms.unwrapNodes()
- **AND** SHALL set list-item type on blocks
- **AND** SHALL wrap with new list type container
- **AND** SHALL maintain list item content during conversion

#### Scenario: List removal
- **WHEN** user toggles off active list type
- **THEN** SHALL unwrap list container
- **AND** SHALL convert list-item blocks to paragraph blocks
- **AND** SHALL maintain text content and formatting
- **AND** SHALL use Transforms.setNodes() to update block types

#### Scenario: List item rendering
- **WHEN** list items render
- **THEN** SHALL render each list-item as `<li>` element
- **AND** SHALL maintain text formatting within list items
- **AND** SHALL support all inline formatting marks in list items
- **AND** SHALL properly nest list HTML structure

#### Scenario: Nested lists (future enhancement)
- **WHEN** nested list support is implemented
- **THEN** SHALL support list items containing child lists
- **AND** SHALL render with proper nested `<ul>`/`<ol>` structure
- **AND** SHALL serialize nested structure to HTML correctly
- **AND** SHALL maintain proper indentation levels

### Requirement: Link Support
The component SHALL support hyperlinks with automatic URL detection.

#### Scenario: Link element structure
- **WHEN** link is created
- **THEN** SHALL set CustomElement type to "link"
- **AND** SHALL store URL in element.url property
- **AND** SHALL store additional attributes in element.htmlAttributes
- **AND** SHALL mark as inline element via editor.isInline()

#### Scenario: Automatic link detection on paste
- **WHEN** user pastes URL text
- **THEN** SHALL detect URLs using isUrl() validation
- **AND** SHALL wrap URL in link element automatically
- **AND** SHALL use URL as link text if no selection
- **AND** SHALL wrap selected text if selection exists

#### Scenario: Automatic link detection on typing
- **WHEN** user types URL text
- **THEN** SHALL detect URLs using isUrl() validation
- **AND** SHALL automatically create link element
- **AND** SHALL wrap URL text in link

#### Scenario: Link rendering
- **WHEN** link renders in editor
- **THEN** SHALL render with `<a>` HTML element
- **AND** SHALL set href attribute to element.url
- **AND** SHALL set rel="noopener noreferrer" for security
- **AND** SHALL display with color: primary.11, textDecoration: underline
- **AND** SHALL remove underline on hover

#### Scenario: Link serialization
- **WHEN** link is serialized to HTML
- **THEN** SHALL output `<a href="...">` tag
- **AND** SHALL sanitize URL to prevent XSS (block javascript:, data:, vbscript:)
- **AND** SHALL escape href attribute value
- **AND** SHALL include additional htmlAttributes
- **AND** SHALL filter out event handlers (attributes starting with "on")

#### Scenario: Link editing (manual implementation)
- **WHEN** future link editing is implemented
- **THEN** SHALL provide UI to edit existing link URL
- **AND** SHALL provide UI to remove link
- **AND** SHALL unwrap link element while preserving text
- **AND** SHALL allow URL updates via Transforms.setNodes()

### Requirement: Keyboard Shortcuts
The component SHALL support keyboard shortcuts for common formatting actions.

#### Scenario: Bold shortcut
- **WHEN** user presses Cmd+B (Mac) or Ctrl+B (Windows/Linux)
- **THEN** SHALL toggle bold formatting on current selection or at cursor
- **AND** SHALL prevent default browser behavior
- **AND** SHALL call toggleMark(editor, "bold")

#### Scenario: Italic shortcut
- **WHEN** user presses Cmd+I (Mac) or Ctrl+I (Windows/Linux)
- **THEN** SHALL toggle italic formatting on current selection or at cursor
- **AND** SHALL prevent default browser behavior
- **AND** SHALL call toggleMark(editor, "italic")

#### Scenario: Underline shortcut
- **WHEN** user presses Cmd+U (Mac) or Ctrl+U (Windows/Linux)
- **THEN** SHALL toggle underline formatting on current selection or at cursor
- **AND** SHALL prevent default browser behavior
- **AND** SHALL call toggleMark(editor, "underline")

#### Scenario: Inline code shortcut
- **WHEN** user presses Cmd+` (Mac) or Ctrl+` (Windows/Linux)
- **THEN** SHALL toggle code formatting on current selection or at cursor
- **AND** SHALL prevent default browser behavior
- **AND** SHALL call toggleMark(editor, "code")

#### Scenario: Undo shortcut
- **WHEN** user presses Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
- **THEN** SHALL call editor.undo() to undo last change
- **AND** SHALL prevent default browser behavior
- **AND** SHALL restore previous editor state

#### Scenario: Redo shortcut
- **WHEN** user presses Cmd+Shift+Z (Mac) or Ctrl+Shift+Z (Windows/Linux)
- **THEN** SHALL call editor.redo() to redo undone change
- **AND** SHALL prevent default browser behavior
- **AND** SHALL restore next editor state

#### Scenario: Soft line break
- **WHEN** user presses Shift+Enter
- **THEN** SHALL insert soft line break (not new paragraph)
- **AND** SHALL insert Softbreaker.placeholderCharacter (\u200B\n)
- **AND** SHALL serialize to `<br>` tag in HTML output
- **AND** SHALL prevent creating new paragraph block

#### Scenario: Hard line break
- **WHEN** user presses Enter (without Shift)
- **THEN** SHALL create new paragraph block
- **AND** SHALL NOT submit parent form
- **AND** SHALL maintain cursor position in new paragraph

#### Scenario: Shortcut handling
- **WHEN** keyboard shortcuts are processed
- **THEN** SHALL use useKeyboardShortcuts hook
- **AND** SHALL check hotkeys using isHotkey() library
- **AND** SHALL handle shortcuts in onKeyDown event handler
- **AND** SHALL apply shortcuts via toggleMark() function

### Requirement: Undo/Redo Support
The component SHALL provide undo/redo functionality via Slate history plugin.

#### Scenario: History plugin integration
- **WHEN** editor is created
- **THEN** SHALL apply withHistory() plugin to editor
- **AND** editor SHALL extend HistoryEditor type
- **AND** editor SHALL expose undo() and redo() methods

#### Scenario: Undo operation
- **WHEN** user clicks Undo button or presses Cmd/Ctrl+Z
- **THEN** SHALL call editor.undo()
- **AND** SHALL restore previous editor state
- **AND** SHALL update undo/redo button states
- **AND** SHALL preserve selection after undo

#### Scenario: Redo operation
- **WHEN** user clicks Redo button or presses Cmd/Ctrl+Shift+Z
- **THEN** SHALL call editor.redo()
- **AND** SHALL restore next editor state
- **AND** SHALL update undo/redo button states
- **AND** SHALL preserve selection after redo

#### Scenario: Undo/Redo state tracking
- **WHEN** toolbar state is updated
- **THEN** SHALL check if editor.history.undos has entries
- **AND** SHALL check if editor.history.redos has entries
- **AND** Undo button SHALL be disabled when no undos available
- **AND** Redo button SHALL be disabled when no redos available

#### Scenario: History tracking
- **WHEN** user makes edits
- **THEN** history plugin SHALL automatically track changes
- **AND** SHALL create undo snapshots for content changes
- **AND** SHALL NOT create snapshots for selection-only changes
- **AND** SHALL maintain history stack until cleared

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL set readOnly attribute on Slate Editable
- **AND** SHALL apply data-disabled="true" to root container
- **AND** toolbar SHALL apply opacity: 0.5 styling
- **AND** editable area SHALL apply cursor: not-allowed, opacity: 0.5
- **AND** SHALL prevent all editing interactions
- **AND** toolbar buttons SHALL be disabled
- **AND** SHALL NOT render toolbar if isReadOnly is also true

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL set readOnly attribute on Slate Editable
- **AND** SHALL apply data-readonly="true" to root container
- **AND** SHALL NOT render toolbar (no formatting controls)
- **AND** SHALL allow focus and text selection
- **AND** SHALL prevent content editing
- **AND** SHALL display content without modification capability

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set
- **THEN** SHALL apply data-invalid="true" to root container
- **AND** border color SHALL be critical.7
- **AND** border width SHALL be 50 (2px)
- **AND** SHALL remain editable and focusable
- **AND** SHALL integrate with FormField error display

#### Scenario: Focus state
- **WHEN** editor receives focus
- **THEN** container SHALL apply focusRing layer style
- **AND** focus ring SHALL be visible around container
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL call onFocus callback if provided
- **WHEN** editor loses focus
- **THEN** SHALL remove focus ring
- **AND** SHALL call onBlur callback if provided

#### Scenario: AutoFocus
- **WHEN** autoFocus={true} is set
- **THEN** SHALL focus editor on mount
- **AND** SHALL set autoFocus attribute on Editable
- **AND** cursor SHALL be positioned at start of content

### Requirement: Placeholder Support
The component SHALL display placeholder text when editor is empty.

#### Scenario: Placeholder display
- **WHEN** placeholder prop is provided and editor is empty
- **THEN** SHALL display placeholder text in editor
- **AND** Slate Editable SHALL receive placeholder prop
- **AND** placeholder SHALL have opacity: 0.5 via [data-slate-placeholder]
- **AND** placeholder SHALL use currentColor from editor

#### Scenario: Placeholder hide
- **WHEN** editor contains content
- **THEN** SHALL hide placeholder text
- **AND** placeholder SHALL NOT be visible
- **AND** SHALL show content instead

#### Scenario: Default placeholder
- **WHEN** no placeholder prop is provided
- **THEN** SHALL use EDITOR_DEFAULTS.placeholder ("Start typing...")
- **AND** SHALL display default placeholder when empty

### Requirement: Value Management
The component SHALL support both controlled and uncontrolled state management per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** SHALL parse value to Slate structure on initial render
- **AND** SHALL update Slate value when value prop changes externally
- **AND** SHALL track serialized value to detect actual HTML changes
- **AND** SHALL call onChange with HTML string on every content change
- **AND** SHALL NOT call onChange if HTML hasn't actually changed (selection-only changes)

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL parse defaultValue to Slate structure on mount
- **AND** SHALL initialize internal state with parsed content
- **AND** SHALL manage state internally via React useState
- **AND** optional onChange SHALL receive HTML string updates
- **AND** SHALL NOT update when defaultValue prop changes after mount

#### Scenario: Empty value initialization
- **WHEN** value or defaultValue is empty, undefined, or null
- **THEN** SHALL call createEmptyValue() to create single paragraph with empty text
- **AND** SHALL display placeholder text
- **AND** SHALL serialize to empty string or minimal HTML

#### Scenario: State synchronization
- **WHEN** value prop changes in controlled mode
- **THEN** SHALL compare new value with serialized value
- **AND** SHALL only update if HTML actually changed
- **AND** SHALL parse new HTML to Slate structure
- **AND** SHALL update internal Slate value
- **AND** SHALL maintain cursor position when possible

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot definitions
- **WHEN** component renders
- **THEN** SHALL define slots: root, toolbar, editable
- **AND** root slot SHALL be container with flex column layout
- **AND** toolbar slot SHALL be toolbar area with shadow
- **AND** editable slot SHALL be content area with padding and overflow

#### Scenario: Root slot styling
- **WHEN** root slot renders
- **THEN** SHALL apply display: flex, flexDirection: column
- **AND** SHALL apply position: relative, width: full
- **AND** SHALL apply borderRadius: 200, borderWidth: 25
- **AND** SHALL apply colorPalette: slate
- **AND** SHALL apply borderColor: colorPalette.7
- **AND** SHALL apply backgroundColor: colorPalette.contrast
- **AND** _focusWithin SHALL apply focusRing layer style

#### Scenario: Toolbar slot styling
- **WHEN** toolbar slot renders
- **THEN** SHALL apply boxShadow: 1
- **AND** [data-disabled='true'] & SHALL apply opacity: 0.5

#### Scenario: Editable slot styling
- **WHEN** editable slot renders
- **THEN** SHALL apply padding: 400, minHeight: inherit, maxHeight: inherit
- **AND** SHALL apply overflow: auto, outline: none
- **AND** SHALL apply color: colorPalette.12
- **AND** [data-disabled='true'] & SHALL apply cursor: not-allowed, opacity: 0.5
- **AND** [data-slate-placeholder] SHALL apply opacity: 0.5

#### Scenario: Content element styling
- **WHEN** editable slot renders content
- **THEN** p SHALL use textStyle: md, fontWeight: 500
- **AND** h1-h5 SHALL use respective textStyles (2xl, xl, lg, md, xs)
- **AND** blockquote SHALL use borderLeftWidth: 100, paddingLeft: 400
- **AND** ul/ol SHALL use paddingLeft: 600, listStyleType
- **AND** code SHALL use padding: 100, fontFamily: mono
- **AND** pre SHALL use padding: 300, borderRadius: 200, overflow: auto
- **AND** a SHALL use color: primary.11, textDecoration: underline
- **AND** strong SHALL use fontWeight: 700
- **AND** em SHALL use fontStyle: italic
- **AND** u SHALL use textDecoration: underline
- **AND** del SHALL use textDecoration: line-through
- **AND** sup/sub SHALL use fontSize: 75%, verticalAlign

#### Scenario: Invalid state styling
- **WHEN** data-invalid="true" is set on root
- **THEN** SHALL apply borderWidth: 50 (2px)
- **AND** SHALL apply borderColor: critical.7

#### Scenario: Recipe registration
- **WHEN** package builds
- **THEN** richTextInputSlotRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL be manual (no auto-discovery)
- **AND** recipe className SHALL be "nimbus-rich-text-input"

### Requirement: Internationalization Support
The component SHALL support comprehensive i18n via plain TypeScript objects.

#### Scenario: Message definitions
- **WHEN** component uses i18n messages
- **THEN** SHALL define 24 messages in rich-text-input.i18n.ts
- **AND** SHALL use plain TypeScript objects's plain object API
- **AND** message IDs SHALL follow pattern: Nimbus.RichTextInput.{messageKey}

#### Scenario: Toolbar messages
- **WHEN** toolbar renders
- **THEN** SHALL use msg.format() for all labels
- **AND** SHALL include: textFormatting, textStyleMenu, textStyle
- **AND** SHALL include: bold, italic, underline
- **AND** SHALL include: listFormatting, bulletedList, numberedList
- **AND** SHALL include: undo, redo

#### Scenario: Formatting menu messages
- **WHEN** formatting menu renders
- **THEN** SHALL use msg.format() for menu items
- **AND** SHALL include: moreFormattingOptions, moreStyles
- **AND** SHALL include: strikethrough, code, superscript, subscript

#### Scenario: Text style labels
- **WHEN** text style menu renders
- **THEN** SHALL use msg.format() for style labels
- **AND** SHALL include: paragraph, headingOne, headingTwo, headingThree, headingFour, headingFive, quote
- **AND** SHALL display localized labels in dropdown

#### Scenario: ARIA labels
- **WHEN** interactive elements render
- **THEN** SHALL use formatted messages for aria-label attributes
- **AND** toolbar SHALL have aria-label from messages.textFormatting
- **AND** buttons SHALL have aria-label from respective messages
- **AND** menus SHALL have aria-label from respective messages

#### Scenario: Tooltip content
- **WHEN** tooltips render
- **THEN** SHALL use formatted messages for tooltip content
- **AND** SHALL display localized tooltip text on hover
- **AND** SHALL support all toolbar buttons and menus

### Requirement: Custom Hooks
The component SHALL implement specialized hooks for editor functionality.

#### Scenario: useKeyboardShortcuts hook
- **WHEN** hook is used in RichTextEditor
- **THEN** SHALL accept editor parameter
- **AND** SHALL return handleKeyDown function
- **AND** SHALL process keyboard events for formatting shortcuts
- **AND** SHALL handle undo/redo shortcuts
- **AND** SHALL handle soft line break (Shift+Enter)
- **AND** SHALL prevent default browser behavior when needed

#### Scenario: useFormattingState hook
- **WHEN** hook is used to track formatting state
- **THEN** SHALL accept editor parameter
- **AND** SHALL return active formatting marks
- **AND** SHALL track bold, italic, underline, strikethrough, code, superscript, subscript
- **AND** SHALL update when selection changes

#### Scenario: useToolbarState hook
- **WHEN** hook is used in RichTextToolbar
- **THEN** SHALL accept withPreservedSelection function and textStyles array
- **AND** SHALL return currentTextStyle, selectedTextStyleLabel
- **AND** SHALL return handleTextStyleChange, handleListToggle functions
- **AND** SHALL return selectedFormatKeys, selectedListKeys arrays
- **AND** SHALL return hasUndos, hasRedos booleans
- **AND** SHALL track all toolbar state in one place

#### Scenario: usePreservedSelection hook
- **WHEN** hook is used to preserve selection during toolbar clicks
- **THEN** SHALL accept editor parameter
- **AND** SHALL return wrapper function that preserves selection
- **AND** SHALL save current selection before action
- **AND** SHALL restore selection after action completes
- **AND** SHALL refocus editor after action

### Requirement: HTML Parsing and Serialization
The component SHALL handle HTML conversion with XSS protection.

#### Scenario: HTML to Slate parsing
- **WHEN** fromHTML() is called with HTML string
- **THEN** SHALL use DOMParser to parse HTML
- **AND** SHALL recursively deserialize DOM nodes to Slate structure
- **AND** SHALL convert block tags using BLOCK_TAGS mapping
- **AND** SHALL convert mark tags using MARK_TAGS mapping
- **AND** SHALL preserve link href and attributes
- **AND** SHALL handle nested structures (lists, formatting)
- **AND** SHALL return Descendant[] array

#### Scenario: Slate to HTML serialization
- **WHEN** toHTML() is called with Slate value
- **THEN** SHALL recursively serialize Slate nodes to HTML
- **AND** SHALL convert CustomElement types to HTML tags
- **AND** SHALL wrap CustomText marks in HTML tags (strong, em, u, del, sup, sub, code)
- **AND** SHALL escape HTML in text content using escapeHtml()
- **AND** SHALL convert soft breaks to `<br>` tags
- **AND** SHALL return HTML string

#### Scenario: XSS protection
- **WHEN** URLs are serialized
- **THEN** SHALL sanitize URLs using sanitizeUrl()
- **AND** SHALL block javascript:, data:, vbscript: protocols
- **AND** SHALL escape href attribute values
- **AND** SHALL filter out event handlers (attributes starting with "on")
- **AND** SHALL return "#" for dangerous URLs

#### Scenario: Soft line break handling
- **WHEN** soft breaks are processed
- **THEN** SHALL use Softbreaker.placeholderCharacter (\u200B\n)
- **AND** SHALL replace placeholder with `<br>` on serialization
- **AND** SHALL replace `<br>` with placeholder on deserialization

### Requirement: Slate Helper Utilities
The component SHALL provide utility functions for Slate operations.

#### Scenario: isMarkActive function
- **WHEN** checking if mark is active
- **THEN** SHALL accept editor and format parameters
- **AND** SHALL check Editor.marks() for collapsed selection
- **AND** SHALL check all selected text nodes for expanded selection
- **AND** SHALL return true only if ALL selected text has mark
- **AND** SHALL prioritize unformatted text (mixed shows inactive)

#### Scenario: isBlockActive function
- **WHEN** checking if block type is active
- **THEN** SHALL accept editor and format parameters
- **AND** SHALL use Editor.nodes() to find matching blocks
- **AND** SHALL check selection if available
- **AND** SHALL check first block if no selection
- **AND** SHALL return true if block type matches

#### Scenario: toggleMark function
- **WHEN** toggling text formatting
- **THEN** SHALL check if mark is currently active
- **AND** SHALL call Editor.removeMark() if active
- **AND** SHALL call Editor.addMark() if not active
- **AND** SHALL apply mark to selection or cursor position

#### Scenario: toggleBlock function
- **WHEN** toggling block type
- **THEN** SHALL check if block type is currently active
- **AND** SHALL unwrap any list containers first
- **AND** SHALL set block type using Transforms.setNodes()
- **AND** SHALL wrap with list container if list type
- **AND** SHALL revert to paragraph if toggling off

#### Scenario: focusEditor function
- **WHEN** programmatically focusing editor
- **THEN** SHALL call ReactEditor.focus(editor)
- **AND** editor SHALL receive focus
- **AND** cursor SHALL be positioned in editor

#### Scenario: resetEditor function
- **WHEN** programmatically resetting editor content
- **THEN** SHALL parse new HTML value
- **AND** SHALL delete all current content
- **AND** SHALL insert new parsed content
- **AND** SHALL focus and select start of content

#### Scenario: withLinks plugin
- **WHEN** plugin is applied to editor
- **THEN** SHALL override editor.isInline to mark links as inline
- **AND** SHALL override editor.insertText to detect and wrap URLs
- **AND** SHALL override editor.insertData to handle pasted URLs
- **AND** SHALL automatically create link elements for URLs

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Semantic HTML and ARIA
- **WHEN** component renders
- **THEN** Slate Editable SHALL have role="textbox"
- **AND** Editable SHALL have aria-multiline="true"
- **AND** Editable SHALL have aria-label="Rich text editor"
- **AND** root container SHALL have role="group"
- **AND** toolbar SHALL have role="toolbar" and aria-label

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** Tab SHALL focus editor (or toolbar if rendered first)
- **AND** editor SHALL be fully keyboard accessible
- **AND** toolbar buttons SHALL be Tab-navigable
- **AND** Enter/Space SHALL activate toolbar buttons
- **AND** Arrow keys SHALL navigate text in editor
- **AND** keyboard shortcuts SHALL be available (Cmd/Ctrl+B/I/U/Z)

#### Scenario: Focus management
- **WHEN** editor receives focus
- **THEN** focus ring SHALL be visible around container
- **AND** focus ring SHALL meet 3:1 contrast ratio
- **AND** _focusWithin layer style SHALL apply
- **WHEN** toolbar button is clicked
- **THEN** editor focus SHALL be preserved using usePreservedSelection
- **AND** selection SHALL be maintained after button action

#### Scenario: Screen reader support
- **WHEN** screen reader user interacts with component
- **THEN** SHALL announce "Rich text editor, multiline textbox"
- **AND** toolbar buttons SHALL announce label and state (pressed/not pressed)
- **AND** formatting changes SHALL be perceivable through ARIA state
- **AND** undo/redo buttons SHALL announce disabled state
- **AND** text style menu SHALL announce current selection

#### Scenario: Color contrast
- **WHEN** component renders
- **THEN** text SHALL meet 4.5:1 contrast ratio
- **AND** placeholder SHALL meet 4.5:1 contrast ratio (with 0.5 opacity)
- **AND** toolbar buttons SHALL meet 3:1 contrast ratio
- **AND** focus indicator SHALL meet 3:1 contrast ratio
- **AND** invalid state border SHALL meet 3:1 contrast ratio

#### Scenario: Touch targets
- **WHEN** component renders on touch device
- **THEN** toolbar buttons SHALL meet minimum 44x44px touch target (size: xs provides adequate touch area)
- **AND** toolbar SHALL be usable on touch devices
- **AND** editor SHALL be tappable to focus

#### Scenario: Label association (with FormField)
- **WHEN** used with FormField.Label
- **THEN** root container SHALL be associated via aria-labelledby
- **AND** screen readers SHALL announce label
- **WHEN** used with FormField.Description
- **THEN** SHALL be associated via aria-describedby
- **WHEN** used with FormField.Error
- **THEN** error SHALL be associated via aria-describedby

### Requirement: FormField Integration
The component SHALL integrate with FormField component per nimbus-core standards.

#### Scenario: FormField wrapper
- **WHEN** RichTextInput is wrapped in FormField.Input
- **THEN** SHALL receive isDisabled from FormField.Root
- **AND** SHALL receive isInvalid from FormField.Root
- **AND** SHALL receive isReadOnly from FormField.Root
- **AND** SHALL associate with FormField.Label via root container role="group"
- **AND** SHALL associate with FormField.Error via aria-describedby
- **AND** SHALL associate with FormField.Description via aria-describedby

#### Scenario: Invalid field
- **WHEN** FormField.Root has isInvalid={true}
- **THEN** RichTextInput SHALL receive isInvalid prop
- **AND** SHALL display error styling (critical.7 border, borderWidth: 50)
- **AND** FormField.Error SHALL display below editor
- **AND** error message SHALL be accessible to screen readers

#### Scenario: Disabled field
- **WHEN** FormField.Root has isDisabled={true}
- **THEN** RichTextInput SHALL receive isDisabled prop
- **AND** SHALL prevent all editing
- **AND** SHALL apply disabled styling (opacity: 0.5)
- **AND** toolbar SHALL be disabled

#### Scenario: Read-only field
- **WHEN** FormField.Root has isReadOnly={true}
- **THEN** RichTextInput SHALL receive isReadOnly prop
- **AND** SHALL hide toolbar
- **AND** SHALL prevent editing but allow viewing

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form value (uncontrolled)
- **WHEN** component is in a form with name prop
- **THEN** SHALL include HTML value in form data using name as field name
- **AND** value SHALL be current serialized HTML string
- **AND** form submission SHALL include rich text HTML

#### Scenario: Form submission behavior
- **WHEN** Enter key is pressed in editor
- **THEN** SHALL create new paragraph (hard line break)
- **AND** SHALL NOT submit parent form
- **AND** form submission SHALL require explicit submit button

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** uncontrolled mode SHALL return to defaultValue or empty
- **AND** controlled mode SHALL rely on parent to reset value prop
- **AND** editor SHALL clear content to initial state

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** RichTextInput is used
- **THEN** SHALL export RichTextInputProps interface
- **AND** SHALL extend RichTextInputRootSlotProps for styling
- **AND** SHALL include JSDoc for all props

#### Scenario: Main props
- **WHEN** props are typed
- **THEN** value SHALL be typed as string (HTML)
- **AND** defaultValue SHALL be typed as string (HTML)
- **AND** onChange SHALL be typed as (value: string) => void
- **AND** onFocus SHALL be typed as FocusEventHandler<HTMLDivElement>
- **AND** onBlur SHALL be typed as FocusEventHandler<HTMLDivElement>
- **AND** placeholder SHALL be typed as string
- **AND** isDisabled, isReadOnly, isInvalid, autoFocus SHALL be boolean
- **AND** ref SHALL be typed as Ref<HTMLDivElement>

#### Scenario: Slot props
- **WHEN** slot types are defined
- **THEN** SHALL export RichTextInputRootSlotProps
- **AND** SHALL export RichTextInputToolbarSlotProps
- **AND** SHALL export RichTextInputEditableSlotProps
- **AND** all SHALL extend HTMLChakraProps

#### Scenario: Recipe props
- **WHEN** recipe variants are used
- **THEN** SHALL export RichTextInputRecipeProps as SlotRecipeProps<"richTextInput">
- **AND** currently no semantic variants defined (future enhancement)

#### Scenario: Custom Slate types
- **WHEN** Slate types are extended
- **THEN** SHALL define CustomElement with type, children, align, url, htmlAttributes
- **AND** SHALL define CustomText with text marks (bold, italic, underline, code, etc.)
- **AND** SHALL define ElementFormat as union of block types
- **AND** SHALL declare module augmentation for slate CustomTypes

### Requirement: Testing Requirements
The component SHALL have comprehensive tests per nimbus-core standards.

#### Scenario: Storybook stories
- **WHEN** component is tested
- **THEN** SHALL have rich-text-input.stories.tsx file
- **AND** SHALL include stories: Base, Controlled, Uncontrolled, ReadOnly, Disabled, Invalid
- **AND** SHALL include stories: WithPlaceholder, WithFormField, AllFormattingOptions
- **AND** SHALL include stories: ComplexFormatting, ListFormatting, Links

#### Scenario: Play functions
- **WHEN** interactive behavior is tested
- **THEN** stories SHALL include play functions using @storybook/test
- **AND** SHALL test typing and text entry
- **AND** SHALL test formatting button clicks (bold, italic, underline)
- **AND** SHALL test text style menu selection (headings, paragraph, quote)
- **AND** SHALL test list button clicks (bulleted, numbered)
- **AND** SHALL test undo/redo buttons
- **AND** SHALL test keyboard shortcuts (Cmd+B, Cmd+I, Cmd+Z)
- **AND** SHALL test controlled mode value updates
- **AND** SHALL test disabled, readonly, invalid states

#### Scenario: HTML serialization testing
- **WHEN** HTML conversion is tested
- **THEN** SHALL test HTML input parses to Slate correctly
- **AND** SHALL test Slate serializes to HTML correctly
- **AND** SHALL test round-trip conversion (HTML → Slate → HTML)
- **AND** SHALL test all supported HTML elements
- **AND** SHALL test nested formatting (bold + italic)
- **AND** SHALL test list structures

#### Scenario: Accessibility testing
- **WHEN** accessibility is tested
- **THEN** SHALL verify role="textbox" and aria-multiline="true"
- **AND** SHALL verify toolbar has role="toolbar" and aria-label
- **AND** SHALL verify keyboard navigation works
- **AND** SHALL verify focus management
- **AND** SHALL verify disabled and readonly states
- **AND** SHALL verify button ARIA labels

### Requirement: Documentation
The component SHALL provide comprehensive documentation per nimbus-core standards.

#### Scenario: MDX documentation
- **WHEN** component is documented
- **THEN** SHALL have rich-text-input.mdx file
- **AND** SHALL include overview and guidelines
- **AND** SHALL document HTML value format
- **AND** SHALL document supported HTML elements
- **AND** SHALL document formatting toolbar features
- **AND** SHALL document keyboard shortcuts
- **AND** SHALL include usage examples with jsx-live blocks
- **AND** SHALL include controlled and uncontrolled examples

#### Scenario: Engineering documentation
- **WHEN** component is documented
- **THEN** SHALL have rich-text-input.dev.mdx file
- **AND** SHALL document Slate.js integration approach
- **AND** SHALL document HTML serialization strategy
- **AND** SHALL document value conversion (HTML ↔ Slate)
- **AND** SHALL document custom hooks (useKeyboardShortcuts, useToolbarState, etc.)
- **AND** SHALL document plugin architecture (withLinks, withHistory)

#### Scenario: API documentation
- **WHEN** component is documented
- **THEN** MDX SHALL include <PropsTable id="RichTextInput" />
- **AND** props table SHALL auto-generate from TypeScript definitions
- **AND** ALL props SHALL have JSDoc descriptions

### Requirement: External Dependencies
The component SHALL declare Slate.js as peer dependency per nimbus-core standards.

#### Scenario: Slate.js peer dependency
- **WHEN** package is installed
- **THEN** SHALL require slate 0.75.x as peer dependency
- **AND** SHALL require slate-react as peer dependency
- **AND** SHALL require slate-history as peer dependency
- **AND** consumers MUST install Slate packages separately

#### Scenario: Bundle externalization
- **WHEN** package is built
- **THEN** SHALL externalize slate, slate-react, slate-history
- **AND** SHALL NOT bundle Slate in component library
- **AND** Slate SHALL be treated as peer dependency in build config

### Requirement: Performance Optimization
The component SHALL be optimized for editing performance.

#### Scenario: Editor instance memoization
- **WHEN** component renders
- **THEN** editor instance SHALL be created once via useMemo
- **AND** editor SHALL persist across re-renders
- **AND** plugins SHALL be applied in useMemo
- **AND** SHALL NOT recreate editor on every render

#### Scenario: Callback memoization
- **WHEN** callbacks are defined
- **THEN** renderElement SHALL be memoized via useCallback
- **AND** renderLeaf SHALL be memoized via useCallback
- **AND** handleKeyDown SHALL be memoized via useCallback
- **AND** handleFocus and handleBlur SHALL be memoized via useCallback

#### Scenario: Value change optimization
- **WHEN** onChange is called
- **THEN** SHALL compare serialized HTML before calling onChange callback
- **AND** SHALL only call onChange if HTML actually changed
- **AND** SHALL NOT call onChange for selection-only changes
- **AND** SHALL track serializedValue in state to detect changes

#### Scenario: Rendering optimization
- **WHEN** editor renders content
- **THEN** Element and Leaf components SHALL render efficiently
- **AND** SHALL NOT cause unnecessary re-renders
- **AND** Slate's internal rendering optimization SHALL be preserved

### Requirement: Bundle and Export
The component SHALL be properly exported and built per nimbus-core standards.

#### Scenario: Package exports
- **WHEN** component is imported
- **THEN** SHALL export from index.ts barrel file
- **AND** SHALL export RichTextInput component
- **AND** SHALL export RichTextInputProps type
- **AND** SHALL export RichTextInputRecipeProps type
- **AND** SHALL support tree-shaking

#### Scenario: Build output
- **WHEN** package is built
- **THEN** SHALL include component in ESM bundle
- **AND** SHALL include component in CommonJS bundle
- **AND** SHALL include TypeScript declarations
- **AND** SHALL externalize React, Chakra, Slate as peer dependencies

#### Scenario: Import paths
- **WHEN** consumers import component
- **THEN** SHALL support: import { RichTextInput } from '@commercetools/nimbus'
- **AND** SHALL support: import { RichTextInputProps } from '@commercetools/nimbus'
- **AND** SHALL NOT require deep imports
