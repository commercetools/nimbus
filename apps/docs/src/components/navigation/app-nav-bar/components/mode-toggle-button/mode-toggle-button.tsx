import { DarkMode, LightMode } from "@commercetools/nimbus-icons";
import { useColorMode, IconButton } from "@commercetools/nimbus";

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
