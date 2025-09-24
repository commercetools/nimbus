import { Tabs } from "./tabs";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Tabs.Root> = {
  title: "components/Tabs",
  component: Tabs.Root,
  argTypes: {
    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Direction of the tabs layout",
    },
    placement: {
      control: "select",
      options: ["start", "end"],
      description: "Placement of the tab list relative to panels",
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

const Content = (props: { title: string; body: string }) => (
  <>
    <h3>{props.title}</h3>
    <p>{props.body}</p>
  </>
);

const navigationTabs = [
  {
    id: "home",
    title: "Home",
    content: (
      <Content
        title="Home Page"
        body="Welcome to our homepage! This is where you'll find our latest updates."
      />
    ),
  },
  {
    id: "about",
    title: "About",
    content: (
      <Content
        title="About Us"
        body="Learn more about our company and our mission."
      />
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <Content
        title="Contact Information"
        body="Get in touch with us through various channels."
      />
    ),
  },
];

const simpleTabs = [
  {
    id: "1",
    title: "Founding of Rome",
    content: "Arma virumque cano, Troiae qui primus ab oris.",
  },
  {
    id: "2",
    title: "Monarchy and Republic",
    content: "Senatus Populusque Romanus.",
  },
  { id: "3", title: "Empire", content: "Alea jacta est." },
];

export const Base: Story = {
  args: {
    direction: "horizontal",
    placement: "start",
    size: "md",
  },
  render: (args) => <Tabs {...args} tabs={simpleTabs} />,
};

export const BaseWithManualStructureData: Story = {
  args: {
    direction: "horizontal",
    placement: "start",
    size: "md",
  },
  render: (args) => (
    <>
      <Tabs.Root {...args}>
        <Tabs.List>
          <Tabs.Tab id="1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="1">Content 1</Tabs.Panel>
          <Tabs.Panel id="2">Content 2</Tabs.Panel>
          <Tabs.Panel id="3">Content 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>
    </>
  ),
};

export const HorizontalStart: Story = {
  args: {
    direction: "horizontal",
    placement: "start",
  },
  render: (args) => {
    return <Tabs {...args} tabs={navigationTabs} />;
  },
};

export const HorizontalEnd: Story = {
  args: {
    direction: "horizontal",
    placement: "end",
  },
  render: (args) => {
    return <Tabs {...args} tabs={navigationTabs} />;
  },
};

export const VerticalStart: Story = {
  args: {
    direction: "vertical",
    placement: "start",
  },
  render: (args) => {
    return <Tabs {...args} height="300px" tabs={navigationTabs} />;
  },
};

export const VerticalEnd: Story = {
  args: {
    direction: "vertical",
    placement: "end",
  },
  render: (args) => {
    return <Tabs {...args} height="300px" tabs={navigationTabs} />;
  },
};

export const Disabled: Story = {
  render: () => {
    const withDisabledTabs = [
      {
        id: "enabled1",
        title: "Enabled Tab",
        content: "This tab is enabled and can be clicked.",
      },
      {
        id: "disabled1",
        title: "Disabled Tab",
        content: "This content should not be accessible.",
        isDisabled: true,
      },
      {
        id: "enabled2",
        title: "Another Enabled Tab",
        content: "This tab is also enabled.",
      },
      {
        id: "disabled2",
        title: "Another Disabled Tab",
        content: "This content is also not accessible.",
        isDisabled: true,
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h3>Tabs with Disabled State</h3>
          <br />
          <Tabs tabs={withDisabledTabs} />
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const smallTabs = [
      {
        id: "small1",
        title: "Small Tab 1",
        content: "Small tab content with 4px 12px padding and 12px font",
      },
      {
        id: "small2",
        title: "Small Tab 2",
        content: "Small tab panel 2",
      },
      {
        id: "small3",
        title: "Small Tab 3",
        content: "Small tab panel 3",
      },
    ];

    const mediumTabs = [
      {
        id: "medium1",
        title: "Medium Tab 1",
        content: "Medium tab content with 8px 16px padding and 14px font",
      },
      {
        id: "medium2",
        title: "Medium Tab 2",
        content: "Medium tab panel 2",
      },
      {
        id: "medium3",
        title: "Medium Tab 3",
        content: "Medium tab panel 3",
      },
    ];

    const largeTabs = [
      {
        id: "large1",
        title: "Large Tab 1",
        content: "Large tab content with 12px 24px padding and 16px font",
      },
      {
        id: "large2",
        title: "Large Tab 2",
        content: "Large tab panel 2",
      },
      {
        id: "large3",
        title: "Large Tab 3",
        content: "Large tab panel 3",
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h3>Small (sm)</h3>
          <Tabs size="sm" tabs={smallTabs} />
        </div>

        <div>
          <h3>Medium (md) - Default</h3>
          <Tabs size="md" tabs={mediumTabs} />
        </div>

        <div>
          <h3>Large (lg)</h3>
          <Tabs size="lg" tabs={largeTabs} />
        </div>
      </div>
    );
  },
};
