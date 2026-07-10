import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ChatBubble compound component.
 *
 * Layout uses CSS Grid rather than a single flex row. The design places the
 * avatar beside the bubble on the first row, with the (optional) footer row
 * indented directly beneath the bubble — i.e. the avatar occupies only the
 * first row while the bubble and footer stack in the same column. A flat flex
 * row of `[avatar, bubble, footer]` cannot express that "footer aligns under
 * the bubble" relationship, so we place each slot into an explicit grid cell.
 * The `sender` variant swaps the columns (avatar leading vs. trailing), which
 * is what "layout direction" resolves to for this component.
 *
 * `sender` and `tone` are orthogonal: `sender` (`user`/`agent`/`system`/`tool`)
 * owns the origin, layout direction and surface; `tone` (`neutral`/`error`) is
 * a status overlay applied on top of whatever `sender` selected — an *agent*
 * message can still *fail*, so error is a tone, not an origin. `tone` is
 * declared after `sender` so its bubble bg/border win the merge.
 *
 * Token parity: the Figma variables (`spacing/600`, `border-radius/300`, …) map
 * 1:1 onto the Nimbus design tokens (`spacing.600`, `radii.300`, …), so the
 * values below mirror the design exactly.
 */
export const chatBubbleSlotRecipe = defineSlotRecipe({
  slots: ["root", "avatar", "bubble", "actions", "footer", "typing"],

  className: "nimbus-chat-bubble",

  base: {
    root: {
      display: "grid",
      // Two auto tracks: one hugs the avatar, the other holds the bubble +
      // footer stack (bounded by the bubble's per-sender max-width).
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
    footer: {
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
          py: "400",
          backgroundColor: "iris.3",
        },
        avatar: {
          gridColumn: 2,
          // The Avatar renders with `variant="solid"`, which resolves the
          // palette below to an accessible bg (`colorPalette.9`) + text
          // (`colorPalette.contrast`) — the same tokens a same-palette solid
          // Button uses — so we only need to select the palette here.
          colorPalette: "positive",
        },
        footer: {
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
          // Solid variant, primary palette — see the `user` sender above.
          "& .nimbus-avatar": {
            colorPalette: "primary",
          },
        },
        footer: {
          gridColumn: 2,
        },
      },
      // System notices (e.g. "You left the conversation", policy notices) read
      // as centered, subdued, avatar-less lines rather than a sided bubble.
      system: {
        root: {
          justifyContent: "center",
        },
        bubble: {
          // Span both tracks and center, so it reads correctly whether or not
          // an avatar is supplied.
          gridColumn: "1 / -1",
          justifySelf: "center",
          maxWidth: "480px",
          py: "400",
          backgroundColor: "neutral.2",
          color: "neutral.11",
        },
        avatar: {
          gridColumn: 1,
          // Solid variant on the neutral palette — subdued vs. the primary
          // agent/user avatars.
          "& .nimbus-avatar": {
            colorPalette: "neutral",
          },
        },
        footer: {
          gridColumn: "1 / -1",
          justifyContent: "center",
        },
      },
      // Tool / function-call output: agent-side layout, but a subdued neutral
      // surface distinguishes machine output from the assistant's own voice.
      tool: {
        root: {
          justifyContent: "start",
        },
        bubble: {
          gridColumn: 2,
          justifySelf: "start",
          maxWidth: "632px",
          py: "500",
          backgroundColor: "neutral.2",
        },
        avatar: {
          gridColumn: 1,
          // Solid variant, neutral palette — see the `system` sender above.
          "& .nimbus-avatar": {
            colorPalette: "neutral",
          },
        },
        footer: {
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
