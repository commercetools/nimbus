import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { DropZoneProps as RaDropZoneProps } from "react-aria-components";
// `DropEvent` is intentionally imported from `@react-types/shared` rather than
// `react-aria-components`: React Aria Components only re-exports
// `DropOperation` and `DragTypes` from `@react-types/shared` at its top level,
// not `DropEvent`. `@react-types/shared` is already a direct dependency of
// this package.
import type { DropEvent } from "@react-types/shared";

// ============================================================
// SLOT PROPS
// ============================================================

export type DropZoneRootSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Props from React Aria's `DropZone` that Nimbus's `DropZone` forwards
 * faithfully. File-selection is intentionally out of scope — compose the
 * existing Nimbus `FileTrigger` inside `DropZone`'s children for
 * click-to-upload instead.
 */
type DropZoneAriaProps = Pick<
  RaDropZoneProps,
  | "onDrop"
  | "getDropOperation"
  | "onDropEnter"
  | "onDropMove"
  | "onDropActivate"
  | "onDropExit"
  | "isDisabled"
>;

/** Props that conflict between the Chakra slot props and React Aria's props. */
type ConflictingProps = "onDrop" | "translate" | "color";

// ============================================================
// MAIN PROPS
// ============================================================

export type DropZoneProps = OmitInternalProps<
  Omit<DropZoneRootSlotProps, ConflictingProps>
> &
  DropZoneAriaProps & {
    /**
     * The drop zone's content. When omitted, DropZone renders a default
     * upload icon and a localized instruction label. When provided, children
     * fully replace the default — for example, a composed `FileTrigger` for
     * click-to-upload, or a dropped-file list for a "filled" state. There is
     * no partial override: it's all-or-nothing.
     */
    children?: React.ReactNode;

    /**
     * Ref forwarding to the root element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

export type { DropEvent };
export type { DropOperation, DragTypes } from "react-aria-components";
