import { AlertTitle as AlertTitleSlot } from "../alert.slots";
import type { AlertTitleProps } from "../alert.types";
import { Heading } from "../../heading/heading";

/**
 * Alert.Title - Displays the title text for the alert.
 *
 * Renders the Nimbus `Heading`, but as a `div` by default rather than
 * `Heading`'s own `h2`.
 *
 * An alert is inline page content: it can sit inside a card, a form or a tab
 * panel, so the component cannot know which heading level would keep the
 * document outline sequential, and a wrong level is worse than no heading. A
 * bare heading also creates a false section boundary — everything after the
 * alert appears to belong to it when navigating by heading.
 *
 * Pass `as="h2"` (etc.) to make it a real heading, picking the level that fits
 * the surrounding page. Worth doing when the alert is persistent and has a
 * description; leave it alone for transient alerts, whose headings would
 * appear and disappear from the outline.
 *
 * `div` rather than `p` because a title is not a paragraph, and a `p` could
 * not legally hold block content if a consumer composed some.
 *
 * @supportsStyleProps
 */
export const AlertTitle = (props: AlertTitleProps) => {
  const { ref: forwardedRef, children, as = "div", ...restProps } = props;

  return (
    <AlertTitleSlot asChild {...restProps}>
      {/* The title takes the alert's own type cascade instead of a Heading
          size. `size="md"` pinned it to 16px/24px, which matched the alert's
          default by coincidence but ignored it entirely once a consumer set a
          `fontSize` on `Alert.Root` — the description scaled, the title did
          not, and the icon (one text line tall, derived from the same
          cascade) no longer lined up with the title it sat beside.

          Inheriting makes "one text line" mean one thing everywhere in the
          alert. The title stays distinct through its weight, which is how it
          was drawn before it became a Heading. */}
      <Heading
        ref={forwardedRef}
        as={as}
        fontSize="inherit"
        lineHeight="inherit"
        fontWeight="600"
      >
        {children}
      </Heading>
    </AlertTitleSlot>
  );
};

AlertTitle.displayName = "Alert.Title";
