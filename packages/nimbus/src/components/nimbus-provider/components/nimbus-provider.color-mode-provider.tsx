import { ThemeProvider } from "next-themes";
import type { ColorModeProviderProps } from "../nimbus-provider.types";

export const NimbusColorModeProvider = (props: ColorModeProviderProps) => {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
};
