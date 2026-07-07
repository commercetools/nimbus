import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ChatBubble compound component.
 *
 * Layout uses CSS Grid rather than a single flex row. The design places the
 * avatar beside the bubble on the first row, with the (optional) feedback row
 * indented directly beneath the bubble — i.e. the avatar occupies only the
 * first row while the bubble and feedback stack in the same column. A flat
 * flex row of `[avatar, bubble, feedback]` cannot express that "feedback aligns
 * under the bubble" relationship, so we place each slot into an explicit grid
 * cell. The `sender` variant swaps the columns (avatar leading vs. trailing),
 * which is what "layout direction" resolves to for this component.
 *
 * Token parity: the Figma variables (`spacing/600`, `border-radius/300`, …) map
 * 1:1 onto the Nimbus design tokens (`spacing.600`, `radii.300`, …), so the
 * values below mirror the design exactly.
 */
export const chatBubbleSlotRecipe = defineSlotRecipe({
  slots: ["root", "avatar", "bubble", "actions", "feedback"],

  className: "nimbus-chat-bubble",

  base: {
    root: {
      display: "grid",
      // Two auto tracks: one hugs the avatar, the other holds the bubble +
      // feedback stack (bounded by the bubble's per-sender max-width).
      gridTemplateColumns: "auto auto",
      // Shrink to the content instead of stretching across the feed column.
      width: "fit-content",
      maxWidth: "100%",
      alignItems: "start",
      columnGap: "200",
      rowGap: "200",
    },
    avatar: {
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
      border: "solid-25",
      borderColor: "neutral.6",
      borderRadius: "300",
      // Horizontal padding is shared across senders; vertical padding differs
      // per sender (see variants below).
      px: "600",
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
    feedback: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "400",
      gridRow: 2,
      width: "100%",
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
          py: "400",
          backgroundColor: "iris.3",
        },
        avatar: {
          gridColumn: 2,
          // `primary.9` (the accessible solid-surface color) rather than the
          // design's lighter `primary.8`: white avatar content — icon OR
          // initials — must clear APCA contrast, which `primary.8` fails for
          // small text.
          "& .nimbus-avatar": {
            backgroundColor: "primary.9",
            color: "primary.contrast",
          },
        },
        feedback: {
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
          py: "500",
          // Neutral surface: white in light mode, neutral.1 in dark.
          backgroundColor: "bg",
        },
        avatar: {
          gridColumn: 1,
          "& .nimbus-avatar": {
            backgroundColor: "primary.11",
            color: "primary.contrast",
          },
        },
        feedback: {
          gridColumn: 2,
        },
      },
    },
  },

  defaultVariants: {
    sender: "agent",
  },
});
