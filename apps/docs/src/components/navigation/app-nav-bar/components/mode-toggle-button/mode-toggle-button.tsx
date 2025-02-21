import { DarkMode, LightMode } from "@bleh-ui/icons";
import { useColorMode, Button } from "@bleh-ui/react";

export const ModeToggleButton = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Button
      size="sm"
      variant="ghost"
      aria-label="Toggle Mode"
      onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
    >
      {colorMode === "dark" ? <LightMode /> : <DarkMode />}
    </Button>
  );
};
