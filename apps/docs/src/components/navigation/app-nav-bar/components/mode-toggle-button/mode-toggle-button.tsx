import { DarkMode, LightMode } from "@bleh-ui/icons";
import { useColorMode, IconButton } from "@bleh-ui/react";

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
