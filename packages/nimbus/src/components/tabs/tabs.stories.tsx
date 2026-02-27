import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  Box,
  Button,
  Heading,
  NimbusProvider,
  Stack,
  Tabs,
  Text,
} from "@commercetools/nimbus";
import type { NimbusRouterConfig } from "@commercetools/nimbus";
import { SentimentSatisfied } from "@commercetools/nimbus-icons";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Tabs.Root> = {
  title: "Components/Tabs",
  component: Tabs.Root,
  argTypes: {
    variant: {
      control: "select",
      options: ["line", "pills"],
      description: "Visual style variant of the tabs",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Direction of the tabs layout",
    },
    placement: {
      control: "select",
      options: ["start", "end"],
      description:
        "Placement of the tab list relative to panels. For vertical orientation, 'start' places tabs on the left with border on the left, 'end' places tabs on the right with border on the right. For horizontal orientation, controls alignment of tabs within the tab list.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the tabs affecting padding and font size",
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Tabs.Root>;

const Content = (props: { tabLabel: string; body: string }) => (
  <Box px="300">
    <h3>{props.tabLabel}</h3>
    <p>{props.body}</p>
  </Box>
);

const navigationTabs = [
  {
    id: "home",
    tabLabel: "Home",
    panelContent: (
      <Content
        tabLabel="Home Page"
        body="Welcome to our homepage! This is where you'll find our latest updates."
      />
    ),
  },
  {
    id: "about",
    tabLabel: "About",
    panelContent: (
      <Content
        tabLabel="About Us"
        body="Learn more about our company and our mission."
      />
    ),
  },
  {
    id: "contact",
    tabLabel: "Contact",
    panelContent: (
      <Content
        tabLabel="Contact Information"
        body="Get in touch with us through various channels."
      />
    ),
  },
];

const simpleTabs = [
  {
    id: "1",
    tabLabel: "Founding of Rome",
    panelContent: "Arma virumque cano, Troiae qui primus ab oris.",
  },
  {
    id: "2",
    tabLabel: "Monarchy and Republic",
    panelContent: "Senatus Populusque Romanus.",
  },
  { id: "3", tabLabel: "Empire", panelContent: "Alea jacta est." },
];

export const Base: Story = {
  args: {
    orientation: "horizontal",
    size: "md",
    "data-testid": "base-tabs",
  },
  render: (args) => <Tabs.Root {...args} tabs={simpleTabs} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders tabs component with correct structure", async () => {
      await canvas.findByTestId("base-tabs");

      // Check that all tabs are rendered
      const tab1 = await canvas.findByRole("tab", { name: "Founding of Rome" });
      const tab2 = await canvas.findByRole("tab", {
        name: "Monarchy and Republic",
      });
      const tab3 = await canvas.findByRole("tab", { name: "Empire" });

      expect(tab1).toBeInTheDocument();
      expect(tab2).toBeInTheDocument();
      expect(tab3).toBeInTheDocument();
    });

    await step("First tab is selected by default", async () => {
      const firstTab = await canvas.findByRole("tab", {
        name: "Founding of Rome",
      });
      await expect(firstTab).toHaveAttribute("aria-selected", "true");

      // Check that first panel is visible
      const firstPanel = await canvas.findByRole("tabpanel");
      await expect(firstPanel).toHaveTextContent(
        "Arma virumque cano, Troiae qui primus ab oris."
      );
    });

    await step("Can switch tabs by clicking", async () => {
      const secondTab = canvas.getByRole("tab", {
        name: "Monarchy and Republic",
      });

      await userEvent.click(secondTab);

      await expect(secondTab).toHaveAttribute("aria-selected", "true");

      // Check that second panel panelContent is now visible
      const activePanel = canvas.getByRole("tabpanel");
      await expect(activePanel).toHaveTextContent(
        "Senatus Populusque Romanus."
      );
    });

    await step("Supports keyboard navigation", async () => {
      const firstTab = canvas.getByRole("tab", { name: "Founding of Rome" });

      // Focus first tab and navigate with arrow keys
      firstTab.focus();
      await expect(firstTab).toHaveFocus();

      // Navigate to next tab with arrow key
      await userEvent.keyboard("{ArrowRight}");
      const secondTab = canvas.getByRole("tab", {
        name: "Monarchy and Republic",
      });
      await expect(secondTab).toHaveFocus();

      // Navigate to third tab
      await userEvent.keyboard("{ArrowRight}");
      const thirdTab = canvas.getByRole("tab", { name: "Empire" });
      await expect(thirdTab).toHaveFocus();

      // Activate with Enter key
      await userEvent.keyboard("{Enter}");
      await expect(thirdTab).toHaveAttribute("aria-selected", "true");
    });

    await step("Has correct accessibility attributes", async () => {
      await canvas.findByRole("tablist");

      // Check ARIA attributes
      const tabs = canvas.getAllByRole("tab");
      tabs.forEach(async (tab: HTMLElement) => {
        await expect(tab).toHaveAttribute("aria-selected");
      });

      const panel = await canvas.findByRole("tabpanel");
      await expect(panel).toHaveAttribute("aria-labelledby");
    });
  },
};

/**
 * Tests the tabListAriaLabel prop which provides an accessible label
 * for the tab list when using the simplified `tabs` prop API.
 */
export const TabListAriaLabel: Story = {
  args: {
    "data-testid": "aria-label-tabs",
  },
  render: (args) => (
    <Tabs.Root
      {...args}
      tabs={simpleTabs}
      tabListAriaLabel="History sections"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "TabList has aria-label from tabListAriaLabel prop",
      async () => {
        const tabList = await canvas.findByRole("tablist");
        await expect(tabList).toHaveAttribute("aria-label", "History sections");
      }
    );

    await step("Tabs are still functional with aria-label", async () => {
      const secondTab = await canvas.findByRole("tab", {
        name: "Monarchy and Republic",
      });
      await userEvent.click(secondTab);
      await expect(secondTab).toHaveAttribute("aria-selected", "true");
    });
  },
};

export const CompoundComposition: Story = {
  args: {
    orientation: "horizontal",
    size: "md",
    "data-testid": "manual-tabs",
  },
  render: (args) => (
    <>
      <Tabs.Root {...args}>
        <Tabs.List>
          <Tabs.Tab id="1">
            <SentimentSatisfied /> Tab 1 <SentimentSatisfied />
          </Tabs.Tab>
          <Tabs.Tab id="2">
            <SentimentSatisfied /> Tab 2 <SentimentSatisfied />
          </Tabs.Tab>
          <Tabs.Tab id="3">
            <SentimentSatisfied /> Tab 3 <SentimentSatisfied />
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="1">Content 1</Tabs.Panel>
          <Tabs.Panel id="2">Content 2</Tabs.Panel>
          <Tabs.Panel id="3">Content 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Manual structure renders correctly", async () => {
      await canvas.findByTestId("manual-tabs");

      // Check that manually defined tabs are rendered
      await canvas.findByRole("tab", { name: "Tab 1" });
      await canvas.findByRole("tab", { name: "Tab 2" });
      await canvas.findByRole("tab", { name: "Tab 3" });
    });

    await step("Manual structure supports tab switching", async () => {
      const tab2 = canvas.getByRole("tab", { name: "Tab 2" });

      await userEvent.click(tab2);
      await expect(tab2).toHaveAttribute("aria-selected", "true");

      const activePanel = canvas.getByRole("tabpanel");
      await expect(activePanel).toHaveTextContent("Content 2");
    });

    await step("Compound components work independently", async () => {
      // Test that the compound component approach maintains proper separation
      const tabList = canvas.getByRole("tablist");
      const panels = canvas.getByRole("tabpanel").parentElement;

      await expect(tabList).toBeInTheDocument();
      await expect(panels).toBeInTheDocument();
    });
  },
};

export const VerticalOrientation: Story = {
  args: {
    orientation: "vertical",
    placement: "start",
    "data-testid": "vertical-tabs",
  },
  render: (args) => {
    return <Tabs.Root {...args} tabs={navigationTabs} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Vertical tabs render correctly", async () => {
      const tabsContainer = canvas.getByTestId("vertical-tabs");
      await expect(tabsContainer).toBeInTheDocument();

      // Check that tabs are rendered
      await expect(
        await canvas.findByRole("tab", { name: "Home" })
      ).toBeInTheDocument();
      await expect(
        await canvas.findByRole("tab", { name: "About" })
      ).toBeInTheDocument();
      await expect(
        await canvas.findByRole("tab", { name: "Contact" })
      ).toBeInTheDocument();
    });

    await step("Vertical tabs support proper keyboard navigation", async () => {
      const homeTab = await canvas.findByRole("tab", { name: "Home" });

      // Focus first tab
      homeTab.focus();
      await expect(homeTab).toHaveFocus();

      // Vertical tabs should use ArrowDown/ArrowUp for navigation
      await userEvent.keyboard("{ArrowDown}");
      const aboutTab = await canvas.findByRole("tab", { name: "About" });
      await expect(aboutTab).toHaveFocus();

      // Navigate up should go back
      await userEvent.keyboard("{ArrowUp}");
      await expect(homeTab).toHaveFocus();
    });

    await step("Vertical tabs have correct orientation attribute", async () => {
      const tabList = canvas.getByRole("tablist");
      await expect(tabList).toHaveAttribute("aria-orientation", "vertical");
    });

    await step(
      "Vertical layout renders JSX panelContent correctly",
      async () => {
        const homeTab = canvas.getByRole("tab", { name: "Home" });

        await userEvent.click(homeTab);
        await expect(homeTab).toHaveAttribute("aria-selected", "true");

        // Check that complex JSX panelContent renders properly
        const panel = canvas.getByRole("tabpanel");
        await expect(panel).toHaveTextContent("Home Page");
        await expect(panel).toHaveTextContent(
          "Welcome to our homepage! This is where you'll find our latest updates."
        );
      }
    );
  },
};

export const VerticalPlacement: Story = {
  render: () => {
    const placementTabs = [
      {
        id: "overview",
        tabLabel: "Overview",
        panelContent: "Overview content for the selected placement.",
      },
      {
        id: "details",
        tabLabel: "Details",
        panelContent: "Details content for the selected placement.",
      },
      {
        id: "settings",
        tabLabel: "Settings",
        panelContent: "Settings content for the selected placement.",
      },
    ];

    return (
      <Stack direction="column" gap="800">
        {/* Placement Start */}
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Vertical - Placement Start (Default)
          </Heading>
          <Text color="neutral.11" mb="400">
            Tabs on the left, panels on the right.
          </Text>
          <Box data-testid="vertical-placement-start">
            <Tabs.Root
              orientation="vertical"
              placement="start"
              tabs={placementTabs}
            />
          </Box>
        </Stack>

        {/* Placement End */}
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Vertical - Placement End
          </Heading>
          <Text color="neutral.11" mb="400">
            Tabs on the right, panels on the left.
          </Text>
          <Box data-testid="vertical-placement-end">
            <Tabs.Root
              orientation="vertical"
              placement="end"
              tabs={placementTabs}
            />
          </Box>
        </Stack>

        {/* Pills Variant with Placement */}
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Vertical Pills - Placement End
          </Heading>
          <Text color="neutral.11" mb="400">
            Pills variant also respects placement. Tabs on the right, panels on
            the left.
          </Text>
          <Box data-testid="vertical-pills-placement-end">
            <Tabs.Root
              orientation="vertical"
              placement="end"
              variant="pills"
              tabs={placementTabs}
            />
          </Box>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All placement variants render correctly", async () => {
      // Verify all three placement examples are present
      const startContainer = canvas.getByTestId("vertical-placement-start");
      const endContainer = canvas.getByTestId("vertical-placement-end");
      const pillsContainer = canvas.getByTestId("vertical-pills-placement-end");

      await expect(startContainer).toBeInTheDocument();
      await expect(endContainer).toBeInTheDocument();
      await expect(pillsContainer).toBeInTheDocument();
    });

    await step("Tab interaction works in all placements", async () => {
      // Test placement="start"
      const startContainer = canvas.getByTestId("vertical-placement-start");
      const startTab = within(startContainer).getByRole("tab", {
        name: "Details",
      });
      await userEvent.click(startTab);
      await expect(startTab).toHaveAttribute("aria-selected", "true");

      // Test placement="end"
      const endContainer = canvas.getByTestId("vertical-placement-end");
      const endTab = within(endContainer).getByRole("tab", {
        name: "Settings",
      });
      await userEvent.click(endTab);
      await expect(endTab).toHaveAttribute("aria-selected", "true");

      // Test pills variant with placement="end"
      const pillsContainer = canvas.getByTestId("vertical-pills-placement-end");
      const pillsTab = within(pillsContainer).getByRole("tab", {
        name: "Details",
      });
      await userEvent.click(pillsTab);
      await expect(pillsTab).toHaveAttribute("aria-selected", "true");
    });
  },
};

export const WithDisabledKeys: Story = {
  args: {
    "data-testid": "disabled-keys-tabs",
    disabledKeys: ["disabled1", "disabled2"],
  },
  render: (args) => {
    const withDisabledTabs = [
      {
        id: "enabled1",
        tabLabel: "Enabled Tab",
        panelContent: "This tab is enabled and can be clicked.",
      },
      {
        id: "disabled1",
        tabLabel: "Disabled Tab",
        panelContent: "This panelContent should not be accessible.",
      },
      {
        id: "enabled2",
        tabLabel: "Another Enabled Tab",
        panelContent: "This tab is also enabled.",
      },
      {
        id: "disabled2",
        tabLabel: "Another Disabled Tab",
        panelContent: "This panelContent is also not accessible.",
      },
    ];

    return (
      <Stack direction="column" gap="400">
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Tabs with DisabledKeys Array
          </Heading>
          <Tabs.Root {...args} tabs={withDisabledTabs} />
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tabs with disabledKeys render correctly", async () => {
      const tabsContainer = canvas.getByTestId("disabled-keys-tabs");
      await expect(tabsContainer).toBeInTheDocument();

      // Check all tabs are rendered
      const enabledTab1 = await canvas.findByRole("tab", {
        name: "Enabled Tab",
      });
      const disabledTab1 = await canvas.findByRole("tab", {
        name: "Disabled Tab",
      });
      const enabledTab2 = await canvas.findByRole("tab", {
        name: "Another Enabled Tab",
      });
      const disabledTab2 = await canvas.findByRole("tab", {
        name: "Another Disabled Tab",
      });

      await expect(enabledTab1).toBeInTheDocument();
      await expect(disabledTab1).toBeInTheDocument();
      await expect(enabledTab2).toBeInTheDocument();
      await expect(disabledTab2).toBeInTheDocument();
    });

    await step("DisabledKeys tabs have correct ARIA attributes", async () => {
      const disabledTab1 = canvas.getByRole("tab", { name: "Disabled Tab" });
      const disabledTab2 = canvas.getByRole("tab", {
        name: "Another Disabled Tab",
      });
      const enabledTab1 = canvas.getByRole("tab", { name: "Enabled Tab" });
      const enabledTab2 = canvas.getByRole("tab", {
        name: "Another Enabled Tab",
      });

      // Disabled tabs should have aria-disabled="true"
      await expect(disabledTab1).toHaveAttribute("aria-disabled", "true");
      await expect(disabledTab2).toHaveAttribute("aria-disabled", "true");

      // Enabled tabs should not have aria-disabled or have it as "false"
      await expect(enabledTab1).not.toHaveAttribute("aria-disabled", "true");
      await expect(enabledTab2).not.toHaveAttribute("aria-disabled", "true");
    });

    await step("DisabledKeys tabs have disabled visual styling", async () => {
      const disabledTab1 = canvas.getByRole("tab", { name: "Disabled Tab" });
      const enabledTab1 = canvas.getByRole("tab", { name: "Enabled Tab" });

      const disabledStyle = window.getComputedStyle(disabledTab1);
      const enabledStyle = window.getComputedStyle(enabledTab1);

      // Disabled tab should have reduced opacity
      await expect(parseFloat(disabledStyle.opacity)).toBeLessThan(
        parseFloat(enabledStyle.opacity)
      );
    });

    await step("DisabledKeys tabs cannot be clicked or activated", async () => {
      const enabledTab1 = canvas.getByRole("tab", { name: "Enabled Tab" });
      const disabledTab1 = canvas.getByRole("tab", { name: "Disabled Tab" });

      // First enabled tab should be selected by default
      await expect(enabledTab1).toHaveAttribute("aria-selected", "true");

      // Try to click disabled tab - should not change selection
      await userEvent.click(disabledTab1);

      // Selection should remain on first enabled tab
      await expect(enabledTab1).toHaveAttribute("aria-selected", "true");
      await expect(disabledTab1).toHaveAttribute("aria-selected", "false");
    });

    await step(
      "DisabledKeys tabs are skipped during keyboard navigation",
      async () => {
        const enabledTab1 = canvas.getByRole("tab", { name: "Enabled Tab" });
        const enabledTab2 = canvas.getByRole("tab", {
          name: "Another Enabled Tab",
        });

        // Focus first enabled tab
        enabledTab1.focus();
        await expect(enabledTab1).toHaveFocus();

        // Navigate right should skip disabled tabs and focus next enabled tab
        await userEvent.keyboard("{ArrowRight}");
        await expect(enabledTab2).toHaveFocus();

        // Navigate left should skip disabled tabs and go back to first enabled
        await userEvent.keyboard("{ArrowLeft}");
        await expect(enabledTab1).toHaveFocus();
      }
    );

    await step(
      "Enabled tabs still work normally with disabledKeys",
      async () => {
        const enabledTab2 = canvas.getByRole("tab", {
          name: "Another Enabled Tab",
        });

        // Click enabled tab
        await userEvent.click(enabledTab2);
        await expect(enabledTab2).toHaveAttribute("aria-selected", "true");

        // Check that panelContent is displayed
        const activePanel = canvas.getByRole("tabpanel");
        await expect(activePanel).toHaveTextContent(
          "This tab is also enabled."
        );
      }
    );

    await step(
      "DisabledKeys array prevents access to specific tab IDs",
      async () => {
        // Verify that the specific IDs in disabledKeys array are disabled
        const disabledTab1 = canvas.getByRole("tab", {
          name: "Disabled Tab",
        });
        const disabledTab2 = canvas.getByRole("tab", {
          name: "Another Disabled Tab",
        });

        // Both tabs with IDs in disabledKeys should be disabled
        await expect(disabledTab1).toHaveAttribute("aria-disabled", "true");
        await expect(disabledTab2).toHaveAttribute("aria-disabled", "true");

        // Try to activate with Enter key - should not work
        disabledTab1.focus();
        await userEvent.keyboard("{Enter}");
        await expect(disabledTab1).toHaveAttribute("aria-selected", "false");

        disabledTab2.focus();
        await userEvent.keyboard("{Space}");
        await expect(disabledTab2).toHaveAttribute("aria-selected", "false");
      }
    );
  },
};

export const Disabled: Story = {
  args: {
    "data-testid": "disabled-tabs",
  },
  render: (args) => {
    const withDisabledTabs = [
      {
        id: "enabled1",
        tabLabel: "Enabled Tab",
        panelContent: "This tab is enabled and can be clicked.",
      },
      {
        id: "disabled1",
        tabLabel: "Disabled Tab",
        panelContent: "This panelContent should not be accessible.",
        isDisabled: true,
      },
      {
        id: "enabled2",
        tabLabel: "Another Enabled Tab",
        panelContent: "This tab is also enabled.",
      },
      {
        id: "disabled2",
        tabLabel: "Another Disabled Tab",
        panelContent: "This panelContent is also not accessible.",
        isDisabled: true,
      },
    ];

    return (
      <Stack direction="column" gap="400">
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Tabs with Disabled State
          </Heading>
          <Tabs.Root {...args} tabs={withDisabledTabs} />
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Disabled tabs have correct ARIA attributes", async () => {
      const disabledTab = await canvas.findByRole("tab", {
        name: "Disabled Tab",
      });
      const anotherDisabledTab = await canvas.findByRole("tab", {
        name: "Another Disabled Tab",
      });

      await expect(disabledTab).toHaveAttribute("aria-disabled", "true");
      await expect(anotherDisabledTab).toHaveAttribute("aria-disabled", "true");
    });

    await step("Disabled tabs have visual styling (opacity)", async () => {
      const disabledTab = canvas.getByRole("tab", { name: "Disabled Tab" });

      // Check that disabled styling is applied (this tests the layerStyle: "disabled")
      const computedStyle = window.getComputedStyle(disabledTab);
      // The opacity should be reduced for disabled tabs
      await expect(parseFloat(computedStyle.opacity)).toBeLessThan(1);
    });

    await step("Disabled tabs cannot be clicked", async () => {
      const enabledTab = canvas.getByRole("tab", { name: "Enabled Tab" });
      const disabledTab = canvas.getByRole("tab", { name: "Disabled Tab" });

      // First tab should be selected by default
      await expect(enabledTab).toHaveAttribute("aria-selected", "true");

      // Try to click disabled tab
      await userEvent.click(disabledTab);

      // Selection should not change
      await expect(enabledTab).toHaveAttribute("aria-selected", "true");
      await expect(disabledTab).toHaveAttribute("aria-selected", "false");
    });

    await step("Disabled tabs are skipped in keyboard navigation", async () => {
      const enabledTab1 = canvas.getByRole("tab", { name: "Enabled Tab" });
      const enabledTab2 = canvas.getByRole("tab", {
        name: "Another Enabled Tab",
      });

      // Focus first enabled tab
      enabledTab1.focus();
      await expect(enabledTab1).toHaveFocus();

      // Navigate with arrow key should skip disabled tabs
      await userEvent.keyboard("{ArrowRight}");

      // Should focus the next enabled tab, skipping disabled ones
      await expect(enabledTab2).toHaveFocus();
    });

    await step("Can still interact with enabled tabs", async () => {
      const enabledTab2 = canvas.getByRole("tab", {
        name: "Another Enabled Tab",
      });

      await userEvent.click(enabledTab2);
      await expect(enabledTab2).toHaveAttribute("aria-selected", "true");

      const activePanel = canvas.getByRole("tabpanel");
      await expect(activePanel).toHaveTextContent("This tab is also enabled.");
    });
  },
};

export const Variants: Story = {
  render: () => {
    const variantTabs = [
      {
        id: "overview",
        tabLabel: "Overview",
        panelContent: "This is the overview content for the selected variant.",
      },
      {
        id: "details",
        tabLabel: "Details",
        panelContent: "This is the details content for the selected variant.",
      },
      {
        id: "settings",
        tabLabel: "Settings",
        panelContent: "This is the settings content for the selected variant.",
      },
    ];

    return (
      <Stack direction="column" gap="600">
        {/* Line Variant */}
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Line Variant (Default)
          </Heading>
          <Text color="neutral.11" mb="400">
            Tabs with an underline indicator showing the selected tab.
          </Text>
          <Stack direction="column" gap="400">
            <Box data-testid="line-variant-horizontal">
              <Heading as="h4" fontSize="350" mb="200">
                Horizontal
              </Heading>
              <Tabs.Root variant="line" tabs={variantTabs} />
            </Box>
            <Box data-testid="line-variant-vertical">
              <Heading as="h4" fontSize="350" mb="200">
                Vertical
              </Heading>
              <Tabs.Root
                variant="line"
                orientation="vertical"
                tabs={variantTabs}
              />
            </Box>
          </Stack>
        </Stack>

        {/* Pills Variant */}
        <Stack direction="column" gap="300">
          <Heading as="h3" fontSize="500">
            Pills Variant
          </Heading>
          <Text color="neutral.11" mb="400">
            Tabs with rounded pill-like appearance and background highlighting.
          </Text>
          <Stack direction="column" gap="400">
            <Box data-testid="pills-variant-horizontal">
              <Heading as="h4" fontSize="350" mb="200">
                Horizontal
              </Heading>
              <Tabs.Root variant="pills" tabs={variantTabs} />
            </Box>
            <Box data-testid="pills-variant-vertical">
              <Heading as="h4" fontSize="350" mb="200">
                Vertical
              </Heading>
              <Tabs.Root
                variant="pills"
                orientation="vertical"
                tabs={variantTabs}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const smallTabs = [
      {
        id: "small1",
        tabLabel: "Small Tab 1",
        panelContent:
          "Small tab panelContent with 4px 12px padding and 12px font",
      },
      {
        id: "small2",
        tabLabel: "Small Tab 2",
        panelContent: "Small tab panel 2",
      },
      {
        id: "small3",
        tabLabel: "Small Tab 3",
        panelContent: "Small tab panel 3",
      },
    ];

    const mediumTabs = [
      {
        id: "medium1",
        tabLabel: "Medium Tab 1",
        panelContent:
          "Medium tab panelContent with 8px 16px padding and 14px font",
      },
      {
        id: "medium2",
        tabLabel: "Medium Tab 2",
        panelContent: "Medium tab panel 2",
      },
      {
        id: "medium3",
        tabLabel: "Medium Tab 3",
        panelContent: "Medium tab panel 3",
      },
    ];

    const largeTabs = [
      {
        id: "large1",
        tabLabel: "Large Tab 1",
        panelContent:
          "Large tab panelContent with 12px 24px padding and 16px font",
      },
      {
        id: "large2",
        tabLabel: "Large Tab 2",
        panelContent: "Large tab panel 2",
      },
      {
        id: "large3",
        tabLabel: "Large Tab 3",
        panelContent: "Large tab panel 3",
      },
    ];

    return (
      <Stack direction="column" gap="400">
        <Stack direction="column" gap="300" data-testid="small-tabs">
          <Heading as="h3" fontSize="500">
            Small (sm)
          </Heading>
          <Tabs.Root size="sm" tabs={smallTabs} />
        </Stack>

        <Stack direction="column" gap="300" data-testid="medium-tabs">
          <Heading as="h3" fontSize="500">
            Medium (md) - Default
          </Heading>
          <Tabs.Root size="md" tabs={mediumTabs} />
        </Stack>

        <Stack direction="column" gap="300" data-testid="large-tabs">
          <Heading as="h3" fontSize="500">
            Large (lg)
          </Heading>
          <Tabs.Root size="lg" tabs={largeTabs} />
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All size variants render correctly", async () => {
      const smallTabs = canvas.getByTestId("small-tabs");
      const mediumTabs = canvas.getByTestId("medium-tabs");
      const largeTabs = canvas.getByTestId("large-tabs");

      await expect(smallTabs).toBeInTheDocument();
      await expect(mediumTabs).toBeInTheDocument();
      await expect(largeTabs).toBeInTheDocument();

      // Check that tabs are rendered in each size variant
      await expect(
        await canvas.findByRole("tab", { name: "Small Tab 1" })
      ).toBeInTheDocument();
      await expect(
        await canvas.findByRole("tab", { name: "Medium Tab 1" })
      ).toBeInTheDocument();
      await expect(
        await canvas.findByRole("tab", { name: "Large Tab 1" })
      ).toBeInTheDocument();
    });

    await step("Size variants have different styling", async () => {
      const smallTab = canvas.getByRole("tab", { name: "Small Tab 1" });
      const mediumTab = canvas.getByRole("tab", { name: "Medium Tab 1" });
      const largeTab = canvas.getByRole("tab", { name: "Large Tab 1" });

      const smallStyle = window.getComputedStyle(smallTab);
      const mediumStyle = window.getComputedStyle(mediumTab);
      const largeStyle = window.getComputedStyle(largeTab);

      // Check that font sizes are different (should be 12px, 14px, 16px)
      const smallFontSize = parseFloat(smallStyle.fontSize);
      const mediumFontSize = parseFloat(mediumStyle.fontSize);
      const largeFontSize = parseFloat(largeStyle.fontSize);

      await expect(smallFontSize).toBeLessThan(mediumFontSize);
      await expect(mediumFontSize).toBeLessThan(largeFontSize);
    });

    await step("All size variants are functional", async () => {
      // Test that each size variant can switch tabs
      const smallTab2 = canvas.getByRole("tab", { name: "Small Tab 2" });
      await userEvent.click(smallTab2);
      await expect(smallTab2).toHaveAttribute("aria-selected", "true");

      const mediumTab2 = canvas.getByRole("tab", { name: "Medium Tab 2" });
      await userEvent.click(mediumTab2);
      await expect(mediumTab2).toHaveAttribute("aria-selected", "true");

      const largeTab2 = canvas.getByRole("tab", { name: "Large Tab 2" });
      await userEvent.click(largeTab2);
      await expect(largeTab2).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * Regression test for controlled tabs with external state
 * Tests that selectedKey and onSelectionChange props are properly forwarded to React Aria
 * This ensures tabs can be controlled from external state (e.g., URL routing)
 */
export const ControlledWithExternalState: Story = {
  render: () => {
    const [selected, setSelected] = useState("overview");
    return (
      <Stack
        direction="column"
        gap="400"
        data-testid="controlled-tabs-container"
      >
        <Stack direction="row" gap="300">
          <Button
            onPress={() => setSelected("overview")}
            data-testid="switch-overview"
          >
            Switch to Overview
          </Button>
          <Button onPress={() => setSelected("api")} data-testid="switch-api">
            Switch to API
          </Button>
          <Button
            onPress={() => setSelected("examples")}
            data-testid="switch-examples"
          >
            Switch to Examples
          </Button>
        </Stack>
        <Tabs.Root
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(String(key))}
          data-testid="controlled-tabs"
        >
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="api">API</Tabs.Tab>
            <Tabs.Tab id="examples">Examples</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="api">API content</Tabs.Panel>
            <Tabs.Panel id="examples">Examples content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial state renders correctly", async () => {
      const overviewTab = await canvas.findByRole("tab", { name: "Overview" });
      await expect(overviewTab).toHaveAttribute("aria-selected", "true");

      const panel = await canvas.findByRole("tabpanel");
      await expect(panel).toHaveTextContent("Overview content");
    });

    await step(
      "External button controls tab selection (controlled behavior)",
      async () => {
        const apiButton = canvas.getByTestId("switch-api");
        await userEvent.click(apiButton);

        // Tab should update based on external state
        const apiTab = await canvas.findByRole("tab", { name: "API" });
        await expect(apiTab).toHaveAttribute("aria-selected", "true");

        const panel = await canvas.findByRole("tabpanel");
        await expect(panel).toHaveTextContent("API content");
      }
    );

    await step(
      "Tab click updates external state (onSelectionChange works)",
      async () => {
        const examplesTab = await canvas.findByRole("tab", {
          name: "Examples",
        });
        await userEvent.click(examplesTab);

        await expect(examplesTab).toHaveAttribute("aria-selected", "true");

        const panel = await canvas.findByRole("tabpanel");
        await expect(panel).toHaveTextContent("Examples content");
      }
    );

    await step(
      "External state change followed by tab click (no navigation loop)",
      async () => {
        // Simulate external state change (like URL change)
        const overviewButton = canvas.getByTestId("switch-overview");
        await userEvent.click(overviewButton);

        const overviewTab = await canvas.findByRole("tab", {
          name: "Overview",
        });
        await expect(overviewTab).toHaveAttribute("aria-selected", "true");

        // Now click another tab - should not cause loop
        const apiTab = await canvas.findByRole("tab", { name: "API" });
        await userEvent.click(apiTab);

        await expect(apiTab).toHaveAttribute("aria-selected", "true");

        // Verify content changed
        const panel = await canvas.findByRole("tabpanel");
        await expect(panel).toHaveTextContent("API content");
      }
    );

    await step("State synchronization is bidirectional", async () => {
      // External → Tab
      const examplesButton = canvas.getByTestId("switch-examples");
      await userEvent.click(examplesButton);

      const examplesTab = await canvas.findByRole("tab", { name: "Examples" });
      await expect(examplesTab).toHaveAttribute("aria-selected", "true");

      // Tab → External (verified by external button working next)
      const overviewTab = await canvas.findByRole("tab", { name: "Overview" });
      await userEvent.click(overviewTab);
      await expect(overviewTab).toHaveAttribute("aria-selected", "true");

      // External button should still work after tab click
      await userEvent.click(examplesButton);
      await expect(examplesTab).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * Demonstrates tabs that render as links with `href` props.
 * When `href` is provided, each tab renders as an anchor element (`<a>`)
 * instead of a button, enabling native browser navigation and router integration.
 *
 * This pattern is useful for:
 * - URL-driven tab navigation (each tab maps to a route)
 * - SEO-friendly tabbed content where each section has a unique URL
 * - Integration with client-side routers (React Router, Next.js, etc.)
 */
const mockNavigate = fn();
const mockRouter: NimbusRouterConfig = {
  navigate: mockNavigate,
};

export const LinkTabs: Story = {
  beforeEach: () => {
    mockNavigate.mockClear();
  },
  args: {
    "data-testid": "link-tabs",
  },
  render: (args) => (
    <NimbusProvider router={mockRouter}>
      <Tabs.Root {...args}>
        <Tabs.List>
          <Tabs.Tab id="overview" href="/overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab id="usage" href="/usage">
            Usage
          </Tabs.Tab>
          <Tabs.Tab id="api" href="/api?version=2">
            API Reference
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="overview">
            Overview content — this tab links to /overview.
          </Tabs.Panel>
          <Tabs.Panel id="usage">
            Usage content — this tab links to /usage.
          </Tabs.Panel>
          <Tabs.Panel id="api">
            API reference content — this tab links to /api.
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>
    </NimbusProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Link tabs render as anchor elements", async () => {
      const overviewTab = await canvas.findByRole("tab", { name: "Overview" });
      const usageTab = await canvas.findByRole("tab", { name: "Usage" });
      const apiTab = await canvas.findByRole("tab", {
        name: "API Reference",
      });

      // Tabs with href should render as <a> elements
      await expect(overviewTab.tagName).toBe("A");
      await expect(usageTab.tagName).toBe("A");
      await expect(apiTab.tagName).toBe("A");
    });

    await step("Link tabs have correct href attributes", async () => {
      const overviewTab = canvas.getByRole("tab", { name: "Overview" });
      const usageTab = canvas.getByRole("tab", { name: "Usage" });
      const apiTab = canvas.getByRole("tab", { name: "API Reference" });

      await expect(overviewTab).toHaveAttribute("href", "/overview");
      await expect(usageTab).toHaveAttribute("href", "/usage");
      await expect(apiTab).toHaveAttribute("href", "/api?version=2");
    });

    await step(
      "Clicking a link tab calls the router navigate function",
      async () => {
        mockNavigate.mockClear();

        const usageTab = canvas.getByRole("tab", { name: "Usage" });
        await userEvent.click(usageTab);

        await expect(mockNavigate).toHaveBeenCalledWith("/usage", undefined);
      }
    );

    await step(
      "URL parameters are forwarded to the router navigate function",
      async () => {
        mockNavigate.mockClear();

        const apiTab = canvas.getByRole("tab", { name: "API Reference" });
        await userEvent.click(apiTab);

        await expect(mockNavigate).toHaveBeenCalledWith(
          "/api?version=2",
          undefined
        );
      }
    );

    await step("Link tabs support keyboard navigation", async () => {
      const overviewTab = canvas.getByRole("tab", { name: "Overview" });

      overviewTab.focus();
      await expect(overviewTab).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      const usageTab = canvas.getByRole("tab", { name: "Usage" });
      await expect(usageTab).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      const apiTab = canvas.getByRole("tab", { name: "API Reference" });
      await expect(apiTab).toHaveFocus();
    });
  },
};
