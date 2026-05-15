import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { Storefront } from "@commercetools/nimbus-icons";
import { Box, Icon, PageContent, Stack, Text } from "@commercetools/nimbus";
import { PublicPageLayout } from "./public-page-layout";

const meta: Meta<typeof PublicPageLayout> = {
  title: "patterns/pages/PublicPageLayout",
  component: PublicPageLayout,
};

export default meta;

type Story = StoryObj<typeof PublicPageLayout>;

const DemoLogo = () => (
  <Icon size="xl" color="primary.9">
    <Storefront />
  </Icon>
);

const slot = (canvasElement: HTMLElement, name: string) =>
  canvasElement.querySelector(`[data-slot='${name}']`) as HTMLElement | null;

export const Default: Story = {
  args: {
    logo: <DemoLogo />,
    welcomeMessage: "Welcome to the Merchant Center",
    children: (
      <Box
        padding="400"
        borderWidth="1px"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <Text>Login form placeholder</Text>
      </Box>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Renders as a main landmark with default aria-label",
      async () => {
        await expect(
          canvas.getByRole("main", { name: "Public page" })
        ).toBeInTheDocument();
      }
    );

    await step("Logo is inside the logo slot", async () => {
      const logoSlot = slot(canvasElement, "logo");
      await expect(logoSlot).toBeInTheDocument();
      await expect(logoSlot!.querySelector("svg")).toBeTruthy();
    });

    await step(
      "Welcome heading is inside the welcome-message slot",
      async () => {
        const wmSlot = slot(canvasElement, "welcome-message");
        await expect(wmSlot).toBeInTheDocument();
        await expect(wmSlot!.tagName).toBe("H2");
        await expect(wmSlot!.textContent).toBe(
          "Welcome to the Merchant Center"
        );
      }
    );

    await step("Children are inside the content slot", async () => {
      const contentSlot = slot(canvasElement, "content");
      await expect(contentSlot).toBeInTheDocument();
      await expect(
        within(contentSlot!).getByText("Login form placeholder")
      ).toBeInTheDocument();
    });
  },
};

export const WideContent: Story = {
  args: {
    logo: <DemoLogo />,
    welcomeMessage: "Create your account",
    contentWidth: "wide",
    children: (
      <PageContent.Root columns="1/1">
        <PageContent.Column>
          <Text>Column one</Text>
        </PageContent.Column>
        <PageContent.Column>
          <Text>Column two</Text>
        </PageContent.Column>
      </PageContent.Root>
    ),
  },
  play: async ({ canvasElement, step }) => {
    await step("Content slot is wider than the normal variant", async () => {
      const contentSlot = slot(canvasElement, "content")!;
      const maxWidth = window.getComputedStyle(contentSlot).maxWidth;
      const widthPx = parseFloat(maxWidth);
      await expect(widthPx).toBeGreaterThan(400);
    });

    await step("Both columns render inside the content slot", async () => {
      const contentSlot = slot(canvasElement, "content")!;
      const scoped = within(contentSlot);
      await expect(scoped.getByText("Column one")).toBeInTheDocument();
      await expect(scoped.getByText("Column two")).toBeInTheDocument();
    });
  },
};

export const CustomLogo: Story = {
  args: {
    logo: (
      <Box
        width="1200"
        height="1200"
        borderRadius="full"
        bg="primary.9"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white" fontWeight="bold">
          CT
        </Text>
      </Box>
    ),
    welcomeMessage: "Welcome back",
    children: <Text>Content area</Text>,
  },
  play: async ({ canvasElement, step }) => {
    await step(
      "Custom logo ReactNode renders inside the logo slot",
      async () => {
        const logoSlot = slot(canvasElement, "logo")!;
        await expect(within(logoSlot).getByText("CT")).toBeInTheDocument();
      }
    );
  },
};

export const WithLegalMessage: Story = {
  args: {
    logo: <DemoLogo />,
    welcomeMessage: "Sign in",
    legalMessage: (
      <Text fontSize="xs" color="neutral.11">
        © 2026 commercetools · Privacy Policy · Terms of Service
      </Text>
    ),
    children: <Text>Login form</Text>,
  },
  play: async ({ canvasElement, step }) => {
    await step("Legal text renders inside the legal-message slot", async () => {
      const legalSlot = slot(canvasElement, "legal-message")!;
      await expect(legalSlot).toBeInTheDocument();
      await expect(
        within(legalSlot).getByText(/Privacy Policy/)
      ).toBeInTheDocument();
    });

    await step(
      "Login form renders inside the content slot, not the legal slot",
      async () => {
        const contentSlot = slot(canvasElement, "content")!;
        await expect(
          within(contentSlot).getByText("Login form")
        ).toBeInTheDocument();
      }
    );
  },
};

export const MinimalLayout: Story = {
  args: {
    children: <Text>Only children are required</Text>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Children render inside the content slot", async () => {
      const contentSlot = slot(canvasElement, "content")!;
      await expect(
        within(contentSlot).getByText("Only children are required")
      ).toBeInTheDocument();
    });

    await step("Logo slot is not rendered when logo is omitted", async () => {
      await expect(slot(canvasElement, "logo")).not.toBeInTheDocument();
    });

    await step(
      "Welcome-message slot is not rendered when welcomeMessage is omitted",
      async () => {
        await expect(
          slot(canvasElement, "welcome-message")
        ).not.toBeInTheDocument();
      }
    );

    await step(
      "Legal-message slot is not rendered when legalMessage is omitted",
      async () => {
        await expect(
          slot(canvasElement, "legal-message")
        ).not.toBeInTheDocument();
      }
    );

    await step("Main landmark still renders", async () => {
      await expect(
        canvas.getByRole("main", { name: "Public page" })
      ).toBeInTheDocument();
    });
  },
};

export const CustomAriaLabel: Story = {
  args: {
    "aria-label": "Login page",
    children: <Text>Login form</Text>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Uses the custom aria-label on the main landmark", async () => {
      await expect(
        canvas.getByRole("main", { name: "Login page" })
      ).toBeInTheDocument();
    });
  },
};

export const WithBackgroundStyle: Story = {
  args: {
    logo: <DemoLogo />,
    welcomeMessage: "Welcome",
    bg: "neutral.2",
    children: (
      <Stack gap="300">
        <Text>Style props are forwarded to the wrapper.</Text>
        <Text fontSize="sm" color="neutral.11">
          This story uses bg=&quot;neutral.2&quot; on the layout.
        </Text>
      </Stack>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Style props are forwarded to the wrapper", async () => {
      const main = canvas.getByRole("main");
      const bg = window.getComputedStyle(main).backgroundColor;
      await expect(bg).not.toBe("rgba(0, 0, 0, 0)");
    });
  },
};
