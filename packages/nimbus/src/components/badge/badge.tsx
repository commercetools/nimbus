import { memo } from "react";
import { BadgeRoot } from "./badge.slots";
import type { BadgeProps } from "./badge.types";
/**
 * # Badge
 *
 * Briefly highlights or categorizes associated UI elements with concise visual cues for status or metadata.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/badge}
 * @supportsStyleProps
 */

export const Badge = memo((props: BadgeProps) => {
  const { ref: forwardedRef, children, ...rest } = props;

  return (
    <BadgeRoot {...rest} ref={forwardedRef}>
      {children}
    </BadgeRoot>
  );
});

Badge.displayName = "Badge";
