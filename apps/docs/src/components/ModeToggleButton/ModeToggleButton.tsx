import { MoonIcon, SunIcon } from "@bleh-ui/icons";
import { TabsList, TabsRoot, TabsTrigger, useColorMode } from "@bleh-ui/react";

export const ModeToggleButton = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <TabsRoot
      colorPalette="neutral"
      value={colorMode}
      variant="subtle"
      size="sm"
    >
      <TabsList>
        <TabsTrigger value="light" onClick={() => setColorMode("light")}>
          <SunIcon size="1.25em" />
          Light
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => setColorMode("dark")}>
          <MoonIcon size="1.25em" />
          Dark
        </TabsTrigger>
      </TabsList>
    </TabsRoot>
  );
};
