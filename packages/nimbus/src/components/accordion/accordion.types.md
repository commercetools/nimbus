# Accordion API

## Components

- [Accordion.Root](#accordionroot)
- [Accordion.Item](#accordionitem)
- [Accordion.Header](#accordionheader)
- [Accordion.Content](#accordioncontent)
- [Accordion.HeaderRightContent](#accordionheaderrightcontent)

---

## Accordion.Root

Supports style-props: ✅

Controls the overall accordion container and behavior.

### Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `ReactNode` <br> The accordion items to display | - |
| ref | `Ref<HTMLDivElement>` <br> Ref to the root element | - |
| allowsMultipleExpanded | `boolean` <br> Whether multiple items can be expanded simultaneously | `false` |
| defaultExpandedKeys | `Iterable<Key>` <br> Default expanded items in uncontrolled mode | - |
| expandedKeys | `Iterable<Key>` <br> Controlled expanded items state | - |

### Event Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| onExpandedChange | `(keys: Set<Key>) => void` <br> Callback fired when expansion state changes | - |

### Accessibility Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| isDisabled | `boolean` <br> Disables all accordion items | `false` |

---

## Accordion.Item

Supports style-props: ✅

Individual accordion item component that contains Header and Content.

### Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `ReactNode` <br> The accordion item content (Header and Content components) | - |
| value | `string` <br> Unique value for this item (used for controlled state) | - |
| ref | `Ref<HTMLDivElement>` <br> Ref to the item element | - |
| defaultExpanded | `boolean` <br> Default expansion state in uncontrolled mode | `false` |
| isExpanded | `boolean` <br> Controlled expansion state | - |

### Event Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| onExpandedChange | `(isExpanded: boolean) => void` <br> Callback fired when item expansion state changes | - |

### Accessibility Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| isDisabled | `boolean` <br> Disables this accordion item | `false` |

---

## Accordion.Header

Supports style-props: ✅

Displays the clickable header that expands/collapses content.

### Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `ReactNode` <br> The header content to display | - |
| ref | `Ref<HTMLButtonElement>` <br> Ref to the header element | - |
| autoFocus | `boolean` <br> Whether the header button should automatically receive focus | `false` |
| type | `'button' \| 'submit' \| 'reset'` <br> The button type attribute | `'button'` |
| excludeFromTabOrder | `boolean` <br> Excludes the header button from keyboard tab order | `false` |

### Event Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| onPress | `(e: PressEvent) => void` <br> Handler called when the header is pressed | - |
| onPressStart | `(e: PressEvent) => void` <br> Handler called when press interaction starts | - |
| onPressEnd | `(e: PressEvent) => void` <br> Handler called when press interaction ends | - |
| onPressChange | `(isPressed: boolean) => void` <br> Handler called when press state changes | - |
| onPressUp | `(e: PressEvent) => void` <br> Handler called when press is released | - |
| onFocus | `(e: FocusEvent) => void` <br> Handler called when header receives focus | - |
| onBlur | `(e: FocusEvent) => void` <br> Handler called when header loses focus | - |
| onKeyDown | `(e: KeyboardEvent) => void` <br> Handler called for key down events | - |
| onKeyUp | `(e: KeyboardEvent) => void` <br> Handler called for key up events | - |

### Accessibility Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| isDisabled | `boolean` <br> Disables the header button | `false` |
| aria-label | `string` <br> Accessible label for the header button | - |
| aria-labelledby | `string` <br> ID of element that labels the header button | - |
| aria-describedby | `string` <br> ID of element that describes the header button | - |
| aria-details | `string` <br> ID of element providing additional details | - |

---

## Accordion.Content

Supports style-props: ✅

Contains the collapsible content area that expands/collapses.

### Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `ReactNode` <br> The content to display when expanded | - |
| ref | `Ref<HTMLDivElement>` <br> Ref to the content element | - |

---

## Accordion.HeaderRightContent

Supports style-props: ✅

Slot component for displaying additional content on the right side of the accordion header.

### Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children | `ReactNode` <br> Content to display on the right side of the header | - |
