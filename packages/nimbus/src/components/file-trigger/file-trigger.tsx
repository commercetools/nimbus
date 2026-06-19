import { FileTrigger as RaFileTrigger } from "react-aria-components";
import type { FileTriggerProps } from "./file-trigger.types";

/**
 * # FileTrigger
 *
 * A thin, behavior-only wrapper around React Aria's `FileTrigger`. It wraps a
 * pressable child (e.g. a Nimbus `Button`) and a visually-hidden file input,
 * opening the native file picker when the child is activated. It renders no
 * visual styling of its own — the child provides the visual treatment.
 *
 * @see {@link https://react-aria.adobe.com/FileTrigger}
 */
export const FileTrigger = (props: FileTriggerProps) => {
  const { ref, ...restProps } = props;
  return <RaFileTrigger ref={ref} {...restProps} />;
};

FileTrigger.displayName = "FileTrigger";
