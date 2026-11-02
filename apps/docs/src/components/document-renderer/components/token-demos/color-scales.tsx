import { Box, Flex, ToggleButtonGroup } from "@commercetools/nimbus";
import { useMemo } from "react";
import {
  useColorScaleMode,
  type ColorScaleMode,
} from "@/atoms/color-scale-mode";
import { ColorScale } from "./color-scale.tsx";

type ColorScalesProps = {
  ids: string | string[];
  /** Only the steps, for palettes that are listed for reference. */
  compact?: boolean;
};

export const ColorScales = (props: ColorScalesProps) => {
  const [mode, setMode] = useColorScaleMode();

  const ids = useMemo(() => {
    const ids =
      typeof props.ids === "string"
        ? props.ids.split(",").map((v) => v.trim())
        : props.ids;

    return ids;
  }, [props.ids]);

  return (
    <Box>
      <Flex justify="flex-end" mb="300">
        <ToggleButtonGroup.Root
          size="xs"
          colorPalette="primary"
          disallowEmptySelection
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const key = [...keys][0];
            if (key != null) setMode(key as ColorScaleMode);
          }}
          aria-label="Color mode of the scales"
        >
          <ToggleButtonGroup.Button id="light">Light</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="dark">Dark</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </Flex>
      {ids.map((id) => (
        <Box key={id} mb={props.compact ? "400" : "800"}>
          <ColorScale id={id} compact={props.compact} />
        </Box>
      ))}
    </Box>
  );
};
