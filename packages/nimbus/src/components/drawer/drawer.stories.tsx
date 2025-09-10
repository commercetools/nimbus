import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { Drawer } from "./drawer";

const meta = {
  title: "Components/Overlay/Drawer",
  component: Drawer.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    // Root props
    isOpen: {
      control: "boolean",
      description: "Whether the drawer is open (controlled mode)",
      table: { category: "Root" },
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the drawer is open by default (uncontrolled mode)",
      table: { category: "Root" },
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the drawer is disabled",
      table: { category: "Root" },
    },
    // Content props
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
      description: "Which edge of the screen the drawer slides in from",
      table: { category: "Content" },
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "narrow",
        "wide",
        "cover",
        "full",
      ],
      description: "Size of the drawer",
      table: { category: "Content" },
    },
    hasBackdrop: {
      control: "boolean",
      description: "Whether to show the backdrop overlay",
      table: { category: "Content" },
    },
    isDismissable: {
      control: "boolean",
      description: "Whether the drawer should close when clicking outside",
      table: { category: "Content" },
    },
    scrollBehavior: {
      control: "select",
      options: ["inside", "outside"],
      description: "Scroll behavior for drawer content",
      table: { category: "Content" },
    },
  },
  args: {
    side: "left",
    size: "md",
    hasBackdrop: true,
    isDismissable: true,
    scrollBehavior: "outside",
    isDisabled: false,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const NavigationContent = ({ side = "left" }) => (
  <>
    <Drawer.Backdrop />
    <Drawer.Header>
      <Drawer.Title>Navigation</Drawer.Title>
      <Drawer.CloseTrigger aria-label="Close navigation">×</Drawer.CloseTrigger>
    </Drawer.Header>
    <Drawer.Body>
      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <a
          href="#"
          style={{
            padding: "0.5rem",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          🏠 Dashboard
        </a>
        <a
          href="#"
          style={{
            padding: "0.5rem",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          👤 Profile
        </a>
        <a
          href="#"
          style={{
            padding: "0.5rem",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          ⚙️ Settings
        </a>
        <a
          href="#"
          style={{
            padding: "0.5rem",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          📊 Analytics
        </a>
        <a
          href="#"
          style={{
            padding: "0.5rem",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          📨 Messages
        </a>
      </nav>
    </Drawer.Body>
  </>
);

const DetailContent = ({ side = "right" }) => (
  <>
    <Drawer.Backdrop />
    <Drawer.Header>
      <Drawer.Title>Product Details</Drawer.Title>
      <Drawer.CloseTrigger aria-label="Close details">×</Drawer.CloseTrigger>
    </Drawer.Header>
    <Drawer.Body>
      <Drawer.Description>
        Detailed information about the selected product including
        specifications, reviews, and availability.
      </Drawer.Description>
      <div style={{ marginTop: "1rem" }}>
        <h3>Specifications</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <strong>Brand:</strong> Acme Corp
          </li>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <strong>Model:</strong> AC-2024
          </li>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <strong>Weight:</strong> 2.5 lbs
          </li>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <strong>Dimensions:</strong> 12" x 8" x 3"
          </li>
        </ul>
      </div>
    </Drawer.Body>
    <Drawer.Footer>
      <button
        style={{
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
        }}
      >
        Add to Wishlist
      </button>
      <button
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#007bff",
          color: "white",
        }}
      >
        Add to Cart
      </button>
    </Drawer.Footer>
  </>
);

const NotificationContent = ({ side = "top" }) => (
  <>
    <Drawer.Backdrop />
    <Drawer.Header>
      <Drawer.Title>Notifications</Drawer.Title>
      <Drawer.CloseTrigger aria-label="Close notifications">
        ×
      </Drawer.CloseTrigger>
    </Drawer.Header>
    <Drawer.Body>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div
          style={{
            padding: "1rem",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>New message received</div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#666",
              marginTop: "0.25rem",
            }}
          >
            You have a new message from John Doe
          </div>
          <div
            style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.25rem" }}
          >
            2 minutes ago
          </div>
        </div>
        <div
          style={{
            padding: "1rem",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>System update available</div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#666",
              marginTop: "0.25rem",
            }}
          >
            A new version is ready to install
          </div>
          <div
            style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.25rem" }}
          >
            1 hour ago
          </div>
        </div>
      </div>
    </Drawer.Body>
  </>
);

const ActionSheetContent = ({ side = "bottom" }) => (
  <>
    <Drawer.Backdrop />
    <Drawer.Header>
      <Drawer.Title>Quick Actions</Drawer.Title>
      <Drawer.CloseTrigger aria-label="Close actions">×</Drawer.CloseTrigger>
    </Drawer.Header>
    <Drawer.Body>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
        }}
      >
        <button
          style={{
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>📤</span>
          Share
        </button>
        <button
          style={{
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>📋</span>
          Copy
        </button>
        <button
          style={{
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>⭐</span>
          Favorite
        </button>
        <button
          style={{
            padding: "1rem",
            border: "1px solid #dc3545",
            borderRadius: "8px",
            backgroundColor: "#dc3545",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🗑️</span>
          Delete
        </button>
      </div>
    </Drawer.Body>
  </>
);

/**
 * Left-side drawer for navigation panels and menus.
 * Perfect for primary navigation in web applications.
 */
export const LeftNavigation: Story = {
  args: {
    side: "left",
    size: "md",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>Open Navigation</Drawer.Trigger>
      <Drawer.Content side={args.side} size={args.size}>
        <NavigationContent side={args.side} />
      </Drawer.Content>
    </Drawer.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the trigger
    const trigger = canvas.getByText("Open Navigation");
    await userEvent.click(trigger);

    // Wait for drawer to open and verify content
    await waitFor(async () => {
      const title = canvas.getByText("Navigation");
      await expect(title).toBeInTheDocument();
    });

    // Verify navigation links are present
    await expect(canvas.getByText("🏠 Dashboard")).toBeInTheDocument();
    await expect(canvas.getByText("👤 Profile")).toBeInTheDocument();

    // Test close button
    const closeButton = canvas.getByLabelText("Close navigation");
    await userEvent.click(closeButton);

    // Verify drawer closes
    await waitFor(async () => {
      await expect(canvas.queryByText("Navigation")).not.toBeInTheDocument();
    });
  },
};

/**
 * Right-side drawer for detail panels and secondary information.
 * Great for product details, user profiles, or contextual information.
 */
export const RightDetails: Story = {
  args: {
    side: "right",
    size: "wide",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>View Details</Drawer.Trigger>
      <Drawer.Content side={args.side} size={args.size}>
        <DetailContent side={args.side} />
      </Drawer.Content>
    </Drawer.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the drawer
    const trigger = canvas.getByText("View Details");
    await userEvent.click(trigger);

    // Verify content loads
    await waitFor(async () => {
      const title = canvas.getByText("Product Details");
      await expect(title).toBeInTheDocument();
    });

    // Verify description and specifications are present
    await expect(
      canvas.getByText(/Detailed information about the selected product/)
    ).toBeInTheDocument();
    await expect(canvas.getByText("Specifications")).toBeInTheDocument();
    await expect(canvas.getByText("Brand:")).toBeInTheDocument();

    // Test footer buttons
    await expect(canvas.getByText("Add to Cart")).toBeInTheDocument();
    await expect(canvas.getByText("Add to Wishlist")).toBeInTheDocument();
  },
};

/**
 * Top drawer for notifications and search results.
 * Excellent for displaying temporary information from the top of the screen.
 */
export const TopNotifications: Story = {
  args: {
    side: "top",
    size: "lg",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>Show Notifications</Drawer.Trigger>
      <Drawer.Content side={args.side} size={args.size}>
        <NotificationContent side={args.side} />
      </Drawer.Content>
    </Drawer.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the drawer
    const trigger = canvas.getByText("Show Notifications");
    await userEvent.click(trigger);

    // Verify notifications content
    await waitFor(async () => {
      const title = canvas.getByText("Notifications");
      await expect(title).toBeInTheDocument();
    });

    // Verify notification items
    await expect(canvas.getByText("New message received")).toBeInTheDocument();
    await expect(
      canvas.getByText("System update available")
    ).toBeInTheDocument();
    await expect(canvas.getByText("2 minutes ago")).toBeInTheDocument();
  },
};

/**
 * Bottom drawer for action sheets and mobile menus.
 * Perfect for mobile-first interfaces and contextual actions.
 */
export const BottomActionSheet: Story = {
  args: {
    side: "bottom",
    size: "sm",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>Show Actions</Drawer.Trigger>
      <Drawer.Content side={args.side} size={args.size}>
        <ActionSheetContent side={args.side} />
      </Drawer.Content>
    </Drawer.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the action sheet
    const trigger = canvas.getByText("Show Actions");
    await userEvent.click(trigger);

    // Verify action sheet content
    await waitFor(async () => {
      const title = canvas.getByText("Quick Actions");
      await expect(title).toBeInTheDocument();
    });

    // Verify action buttons
    await expect(canvas.getByText("Share")).toBeInTheDocument();
    await expect(canvas.getByText("Copy")).toBeInTheDocument();
    await expect(canvas.getByText("Favorite")).toBeInTheDocument();
    await expect(canvas.getByText("Delete")).toBeInTheDocument();
  },
};

/**
 * Narrow drawer for compact navigation or tool panels.
 */
export const NarrowDrawer: Story = {
  args: {
    side: "left",
    size: "narrow",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>Narrow Menu</Drawer.Trigger>
      <Drawer.Content side={args.side} size={args.size}>
        <Drawer.Backdrop />
        <Drawer.Header>
          <Drawer.Title>Tools</Drawer.Title>
          <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
        </Drawer.Header>
        <Drawer.Body>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <button style={{ padding: "0.5rem", textAlign: "center" }}>
              🔧
            </button>
            <button style={{ padding: "0.5rem", textAlign: "center" }}>
              📊
            </button>
            <button style={{ padding: "0.5rem", textAlign: "center" }}>
              ⚙️
            </button>
            <button style={{ padding: "0.5rem", textAlign: "center" }}>
              📝
            </button>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

/**
 * Full-width drawer that covers the entire screen.
 */
export const FullDrawer: Story = {
  args: {
    side: "left",
    size: "full",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>Full Screen</Drawer.Trigger>
      <Drawer.Content side={args.side} size={args.size}>
        <Drawer.Backdrop />
        <Drawer.Header>
          <Drawer.Title>Full Screen View</Drawer.Title>
          <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
        </Drawer.Header>
        <Drawer.Body>
          <div style={{ padding: "2rem" }}>
            <h2>Full Screen Content</h2>
            <p>
              This drawer takes up the full screen, perfect for immersive
              experiences or when you need maximum space for content.
            </p>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

/**
 * Controlled drawer with external state management.
 */
export const ControlledDrawer: Story = {
  args: {
    side: "right",
    size: "md",
    isOpen: false,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(args.isOpen || false);

    return (
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setIsOpen(true)}>
            Open Controlled Drawer
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{ marginLeft: "0.5rem" }}
          >
            Close from Outside
          </button>
          <p
            style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}
          >
            Drawer is {isOpen ? "open" : "closed"}
          </p>
        </div>

        <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Content side={args.side} size={args.size}>
            <Drawer.Backdrop />
            <Drawer.Header>
              <Drawer.Title>Controlled Drawer</Drawer.Title>
              <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                This drawer's open state is controlled by external state. You
                can open/close it from buttons outside the drawer.
              </p>
              <button onClick={() => setIsOpen(false)}>
                Close from Inside
              </button>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </div>
    );
  },
};

/**
 * Drawer with scrollable content demonstrating inside scroll behavior.
 */
export const ScrollableContent: Story = {
  args: {
    side: "right",
    size: "md",
    scrollBehavior: "inside",
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>Scrollable Content</Drawer.Trigger>
      <Drawer.Content
        side={args.side}
        size={args.size}
        scrollBehavior={args.scrollBehavior}
      >
        <Drawer.Backdrop />
        <Drawer.Header>
          <Drawer.Title>Long Content</Drawer.Title>
          <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
        </Drawer.Header>
        <Drawer.Body>
          <div>
            {Array.from({ length: 50 }, (_, i) => (
              <p key={i} style={{ marginBottom: "1rem" }}>
                This is paragraph {i + 1} of long scrollable content. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <button>Scroll to see this footer</button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
