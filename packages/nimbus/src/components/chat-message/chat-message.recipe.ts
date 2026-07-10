import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ChatMessage compound component.
 *
 * Layout uses CSS Grid rather than a single flex row. The design places the
 * avatar beside the bubble on the first row, with the (optional) meta row
 * indented directly beneath the bubble — i.e. the avatar occupies only the
 * first row while the bubble and meta stack in the same column. A flat flex
 * row of `[avatar, bubble, meta]` cannot express that "meta aligns under
 * the bubble" relationship, so we place each slot into an explicit grid cell.
 * The `sender` variant swaps the columns (avatar leading vs. trailing), which
 * is what "layout direction" resolves to for this component.
 *
 * `sender` and `tone` are orthogonal: `sender` (`user`/`agent`) owns the
 * participant, layout direction and surface; `tone` (`neutral`/`error`) is a
 * status overlay applied on top of whatever `sender` selected — an *agent*
 * message can still *fail*, so error is a tone, not a sender. `tone` is
 * declared after `sender` so its bubble bg/border win the merge.
 *
 * `sender` denotes only *which participant* sent the message. Non-message
 * interjections (system notices, dividers) are the separate `ChatNotice` leaf,
 * and tool/function output is content inside an `agent` message — neither is a
 * `sender` value.
 *
 * Token parity: the Figma variables (`spacing/600`, `border-radius/300`, …) map
 * 1:1 onto the Nimbus design tokens (`spacing.600`, `radii.300`, …), so the
 * values below mirror the design exactly.
 */
export const chatMessageSlotRecipe = defineSlotRecipe({
  slots: ["root", "avatar", "bubble", "actions", "meta", "typing"],

  className: "nimbus-chat-message",

  base: {
    root: {
      display: "grid",
      // Two auto tracks: one hugs the avatar, the other holds the bubble +
      // meta stack (bounded by the bubble's per-sender max-width).
      gridTemplateColumns: "auto auto",
      // Shrink to the content instead of stretching across the feed column.
      width: "fit-content",
      maxWidth: "100%",
      alignItems: "start",
      columnGap: "200",
      rowGap: "200",
    },
    avatar: {
      colorPalette: "primary",
      display: "flex",
      flexShrink: 0,
      gridRow: 1,
      alignSelf: "start",
    },
    bubble: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "400",
      gridRow: 1,
      width: "fit-content",
      // Let the bubble shrink below its content's intrinsic width so long,
      // unbreakable tokens wrap inside the card instead of overflowing it (the
      // standard grid/flex min-content fix), and break anywhere as a last
      // resort for bare URLs / long identifiers common in AI output.
      minWidth: 0,
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      border: "solid-25",
      borderColor: "neutral.6",
      borderRadius: "300",
      px: "600",
      py: "500",
    },
    actions: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "400",
      width: "100%",
    },
    meta: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "400",
      gridRow: 2,
      width: "100%",
    },
    typing: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "200",
    },
  },

  variants: {
    sender: {
      user: {
        root: {
          justifyContent: "end",
        },
        // Bubble leads, avatar trails.
        bubble: {
          gridColumn: 1,
          justifySelf: "end",
          maxWidth: "480px",
          backgroundColor: "iris.3",
        },
        avatar: {
          gridColumn: 2,
        },
        meta: {
          gridColumn: 1,
        },
      },
      agent: {
        root: {
          justifyContent: "start",
        },
        // Avatar leads, bubble trails.
        bubble: {
          gridColumn: 2,
          justifySelf: "start",
          maxWidth: "632px",
          // Neutral surface: white in light mode, neutral.1 in dark.
          backgroundColor: "bg",
        },
        avatar: {
          gridColumn: 1,
        },
        meta: {
          gridColumn: 2,
        },
      },
    },

    // Status overlay, orthogonal to `sender`. Declared after `sender` so the
    // error bubble bg/border win the style merge for any sender.
    tone: {
      neutral: {},
      error: {
        bubble: {
          backgroundColor: "critical.2",
          borderColor: "critical.6",
        },
      },
    },
  },

  defaultVariants: {
    sender: "agent",
    tone: "neutral",
  },
});
