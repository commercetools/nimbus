import { type ReactNode, type Ref } from "react";
import { type FileTriggerProps as RaFileTriggerProps } from "react-aria-components";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the {@link FileTrigger} component.
 *
 * `FileTrigger` is a thin, behavior-only wrapper around React Aria's
 * `FileTrigger`. It connects a pressable child (e.g. a Nimbus `Button`) to a
 * visually-hidden file input and opens the native file picker when the child is
 * activated. It renders no visual styling of its own — the child provides the
 * visual treatment, and disabling is done by disabling the child.
 *
 * The React Aria API is forwarded faithfully; props are not normalized.
 */
export type FileTriggerProps = Omit<
  RaFileTriggerProps,
  "children" | "onSelect"
> & {
  /**
   * The pressable element that opens the file picker when activated, typically a
   * Nimbus `Button` or `IconButton`. Any React Aria pressable component works.
   */
  children?: ReactNode;
  /**
   * Handler called when the user finishes selecting files. Receives the native
   * `FileList` (or `null` if the selection was cleared). The React Aria
   * signature is preserved — use `Array.from(files)` to iterate.
   */
  onSelect?: (files: FileList | null) => void;
  /**
   * The mime types or file extensions the picker should allow, e.g.
   * `["image/png", ".pdf"]`. Maps to the hidden input's `accept` attribute.
   */
  acceptedFileTypes?: ReadonlyArray<string>;
  /**
   * Whether more than one file can be selected at a time. Maps to the hidden
   * input's `multiple` attribute.
   *
   * @default false
   */
  allowsMultiple?: boolean;
  /**
   * Enables selecting a directory instead of individual files. Maps to the
   * hidden input's directory-selection attributes (e.g. `webkitdirectory`).
   *
   * @default false
   */
  acceptDirectory?: boolean;
  /**
   * Hints which camera a mobile device should use to capture media. Maps to the
   * hidden input's `capture` attribute and is ignored by desktop browsers.
   */
  defaultCamera?: "user" | "environment";
  /**
   * Ref forwarded to the underlying hidden `<input type="file">` element.
   */
  ref?: Ref<HTMLInputElement>;
};
