import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// updated for storybook v9: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#experimental-test-addon-stabilized-and-renamed
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
