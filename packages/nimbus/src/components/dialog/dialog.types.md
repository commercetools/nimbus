# Dialog API

## Components

- [Dialog.Root](#dialogroot)
- [Dialog.Trigger](#dialogtrigger)
- [Dialog.Content](#dialogcontent)
- [Dialog.Header](#dialogheader)
- [Dialog.Body](#dialogbody)
- [Dialog.Footer](#dialogfooter)
- [Dialog.Title](#dialogtitle)
- [Dialog.CloseTrigger](#dialogclosetrigger)

---

## Dialog.Root

Supports style-props: ✅

The root component that provides context and state management for the dialog. Uses React Aria's DialogTrigger for accessibility and state management. This component handles configuration through recipe variants that are passed down to child components via context.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The children components (Trigger, Content, etc.) | - |
| isOpen | `boolean` <br> Whether the dialog is open (controlled mode) | - |
| defaultOpen | `boolean` <br> Whether the dialog is open by default (uncontrolled mode) | `false` |
| isDismissable | `boolean` <br> Whether the dialog can be dismissed by clicking the backdrop or pressing Escape. If true, clicking outside the dialog or pressing Escape will close it. | `true` |
| isKeyboardDismissDisabled | `boolean` <br> Whether keyboard dismissal (Escape key) is disabled. If true, pressing Escape will NOT close the dialog. | `false` |
| shouldCloseOnInteractOutside | `(event: Event) => boolean` <br> Function to determine whether the dialog should close when interacting outside. Receives the event and returns true to allow closing, false to prevent. | - |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` <br> Size variant for the dialog | - |
| placement | `'center' \| 'top' \| 'bottom'` <br> Placement variant for the dialog position | - |

### Event Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| onOpenChange | `(isOpen: boolean) => void` <br> Callback fired when the dialog open state changes | - |

### Accessibility Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| aria-label | `string` <br> A Title for the dialog, optional, as long as the Dialog.Title component is used or there is a Heading component used inside the Dialog with a `slot`-property set to `title`. | - |

---

## Dialog.Trigger

Supports style-props: ✅

The trigger element that opens the dialog when activated.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The trigger content | - |
| asChild | `boolean` <br> Whether to render as a child element (use children directly as the trigger) | `false` |
| ref | `React.RefObject<HTMLButtonElement>` <br> The ref to the trigger html-button | - |

### Accessibility Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| isDisabled | `boolean` <br> Whether the trigger is disabled | `false` |

---

## Dialog.Content

Supports style-props: ✅

The main dialog content container that wraps the React Aria Dialog and Modal. Configuration (size, placement, etc.) is inherited from Dialog.Root via context.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The dialog content | - |
| ref | `React.RefObject<HTMLDivElement>` <br> The ref to the dialog content | - |

---

## Dialog.Header

Supports style-props: ✅

The header section of the dialog content.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The header content | - |
| ref | `React.Ref<HTMLElement>` <br> The ref to the dialog header | - |

---

## Dialog.Body

Supports style-props: ✅

The main body content section of the dialog.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The body content | - |
| ref | `React.Ref<HTMLDivElement>` <br> The ref to the dialog body | - |

---

## Dialog.Footer

Supports style-props: ✅

The footer section of the dialog, typically containing action buttons.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The footer content (usually buttons) | - |
| ref | `React.Ref<HTMLElement>` <br> The ref to the dialog footer | - |

---

## Dialog.Title

Supports style-props: ✅

The accessible title element for the dialog.

### Configuration Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| children* | `React.ReactNode` <br> The title text | - |
| ref | `React.Ref<HTMLHeadingElement>` <br> The ref to the dialog title | - |

---

## Dialog.CloseTrigger

Supports style-props: ✅

A button that closes the dialog when activated. Displays an IconButton with an X icon by default.

### Accessibility Props

| Prop | Type / Description | Default |
| :--- | :--- | :--- |
| aria-label | `string` <br> Accessible label for the close button | `"Close dialog"` |
