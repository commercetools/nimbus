import { defineLayerStyles } from "@chakra-ui/react";

type LayerStylesType = ReturnType<typeof defineLayerStyles>;

export const layerStyles: LayerStylesType = defineLayerStyles({
  disabled: {
    value: {
      opacity: "0.5",
      cursor: "not-allowed",
    },
  },
});
