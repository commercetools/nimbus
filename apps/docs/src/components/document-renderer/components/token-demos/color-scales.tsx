import { Box } from "@commercetools/nimbus";

import { useMemo } from "react";
import { ColorScale } from "./color-scale.tsx";

type ColorScalesProps = {
  ids: string | string[];
};

export const ColorScales = (props: ColorScalesProps) => {
  const ids = useMemo(() => {
    const ids =
      typeof props.ids === "string"
        ? props.ids.split(",").map((v) => v.trim())
        : props.ids;

    return ids;
  }, [props.ids]);

  return (
    <Box>
      {ids.map((id) => (
        <Box key={id} mb="800">
          <ColorScale id={id} />
        </Box>
      ))}
    </Box>
  );
};
