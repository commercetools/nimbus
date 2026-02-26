import { defineLayerStyles } from "@chakra-ui/react/styled-system";

type LayerStylesType = ReturnType<typeof defineLayerStyles>;

export const layerStyles: LayerStylesType = defineLayerStyles({
  disabled: {
    value: {
      opacity: "0.5",
      cursor: "not-allowed",
    },
  },
  focusRing: {
    value: {
      outlineWidth: "var(--focus-ring-width)",
      outlineColor: "var(--focus-ring-color)",
      outlineStyle: "var(--focus-ring-style)",
      outlineOffset: "var(--focus-ring-offset)",
    },
  },
});
