import { Children, useRef } from "react";
import { DropZone as RaDropZone, Text } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps, mergeRefs } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { Icon } from "@/components";
import { UploadFile } from "@commercetools/nimbus-icons";
import { DropZoneRootSlot } from "./drop-zone.slots";
import { dropZoneMessagesStrings } from "./drop-zone.messages";
import type { DropZoneProps } from "./drop-zone.types";

/**
 * # DropZone
 *
 * An area into which files (or other draggable data) can be dragged and
 * dropped. DropZone does not itself provide a file picker — compose the
 * Nimbus `FileTrigger` component in its children for click-to-upload.
 *
 * Features:
 *
 * - Wraps React Aria's `DropZone` for full drag-and-drop behavior and
 *   keyboard accessibility
 * - Renders a default upload icon and localized instruction label when no
 *   children are provided; children, when provided, fully replace that
 *   default (for example a composed `FileTrigger` + `Button`, or a
 *   dropped-file list)
 * - Forwards `aria-label` / `aria-labelledby` straight to React Aria's
 *   `DropZone`, which applies them to its focusable element and takes
 *   precedence over the default label
 * - Supports Nimbus style props
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/dropzone}
 * @supportsStyleProps
 */
export const DropZone = (props: DropZoneProps) => {
  const { ref: forwardedRef, children, ...rest } = props;

  const recipe = useRecipe({ key: "nimbusDropZone" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    ...rest,
  });
  const [styleProps, elementProps] = extractStyleProps(remainingProps);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const msg = useLocalizedStringFormatter(dropZoneMessagesStrings);
  const hasChildren = Children.count(children) > 0;
  // React Aria's `DropZone` always computes an `aria-label` for its focusable
  // element — either the consumer's explicit `aria-label`, or (if absent) its
  // own internal, English-only "DropZone" fallback string — and, whenever a
  // `Text slot="label"` descendant exists, combines that fallback with the
  // slotted text via `aria-labelledby`, concatenating both into the
  // accessible name. There is no prop to suppress React Aria's internal
  // fallback. So for the default content we supply our own localized label
  // directly as `aria-label` (which wins over React Aria's fallback) and
  // render the matching visible line with `slot={null}` — an explicit,
  // React-Aria-documented opt-out that stops it from being auto-wired into
  // `DropZone`'s label slot — so nothing is left to concatenate against.
  const hasExplicitLabel = Boolean(
    props["aria-label"] || props["aria-labelledby"]
  );
  const defaultLabel = msg.format("defaultLabel");

  return (
    <DropZoneRootSlot {...recipeProps} {...styleProps} asChild>
      <RaDropZone
        ref={ref}
        aria-label={hasExplicitLabel ? undefined : defaultLabel}
        {...elementProps}
      >
        {hasChildren || hasExplicitLabel ? (
          children
        ) : (
          <>
            <Icon boxSize="var(--drop-zone-icon-size)" flexShrink={0}>
              <UploadFile />
            </Icon>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- RAC's `TextProps` type omits `SlotProps`, even though `Text` reads `slot` at runtime via `useContextProps`; `slot={null}` is RAC's documented opt-out from an ambient parent slot (here, `DropZone`'s own `label` slot). */}
            <Text {...({ slot: null } as any)}>{defaultLabel}</Text>
          </>
        )}
      </RaDropZone>
    </DropZoneRootSlot>
  );
};

DropZone.displayName = "DropZone";
