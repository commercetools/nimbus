import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group } from "./group";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Group> = {
  title: "components/Group",
  component: Group,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Group>;

export const Base: Story = {};
