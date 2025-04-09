import { DarkMode, LightMode } from "@nimbus/icons";
import { useColorMode, IconButton } from "@nimbus/react";

export const ModeToggleButton = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <IconButton
      size="xs"
      variant="ghost"
      aria-label="Toggle Mode"
      onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
    >
      {colorMode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};
