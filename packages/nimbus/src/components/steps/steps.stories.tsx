import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Box, Button, Flex, Stack, Steps, Text } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";
import {
  Home,
  Person,
  Settings,
  CheckCircle,
  ShoppingCart,
  LocalShipping,
} from "@commercetools/nimbus-icons";

const sizes = ["xs", "sm", "md"] as const;
const orientations = ["horizontal", "vertical"] as const;

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Steps.Root> = {
  title: "Components/Steps",
  component: Steps.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Steps.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  args: {
    step: 1,
    count: 3,
    size: "sm",
    orientation: "horizontal",
  },
  render: (args) => (
    <Steps.Root {...args} data-testid="steps-root">
      <Steps.List>
        <Steps.Item index={0}>
          <Steps.Indicator type="numeric" />
          <Steps.Content>
            <Steps.Label>Account</Steps.Label>
            <Steps.Description>Create your account</Steps.Description>
          </Steps.Content>
        </Steps.Item>

        <Steps.Separator />

        <Steps.Item index={1}>
          <Steps.Indicator type="numeric" />
          <Steps.Content>
            <Steps.Label>Profile</Steps.Label>
            <Steps.Description>Complete your profile</Steps.Description>
          </Steps.Content>
        </Steps.Item>

        <Steps.Separator />

        <Steps.Item index={2}>
          <Steps.Indicator type="numeric" />
          <Steps.Content>
            <Steps.Label>Review</Steps.Label>
            <Steps.Description>Review and submit</Steps.Description>
          </Steps.Content>
        </Steps.Item>
      </Steps.List>
    </Steps.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has list role on Steps.List", async () => {
      const list = canvas.getByRole("list");
      await expect(list).toBeInTheDocument();
    });

    await step("Has listitem role on each Steps.Item", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items).toHaveLength(3);
    });

    await step("Current step has aria-current='step'", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items[1]).toHaveAttribute("aria-current", "step");
    });

    await step("Items have correct data-state attributes", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items[0]).toHaveAttribute("data-state", "complete");
      await expect(items[1]).toHaveAttribute("data-state", "current");
      await expect(items[2]).toHaveAttribute("data-state", "incomplete");
    });

    await step("Indicators have data-state attributes", async () => {
      const indicators = canvasElement.querySelectorAll(
        '[data-slot="indicator"]'
      );
      await expect(indicators[0]).toHaveAttribute("data-state", "complete");
      await expect(indicators[1]).toHaveAttribute("data-state", "current");
      await expect(indicators[2]).toHaveAttribute("data-state", "incomplete");
    });
  },
};

/**
 * Showcase Sizes
 * Displays xs, sm, and md sizes side by side
 */
export const Sizes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="800" alignItems="stretch" width="100%">
        {sizes.map((size) => (
          <Flex key={size} direction="column" gap="200">
            <Text textStyle="md" fontWeight="600">
              Size: {size}
            </Text>
            <Steps.Root
              step={1}
              count={3}
              size={size}
              orientation={{
                base: "vertical",
                md: "horizontal",
              }}
            >
              <Steps.List>
                <Steps.Item index={0}>
                  <Steps.Indicator type="numeric" />
                  <Steps.Content>
                    <Steps.Label>Account</Steps.Label>
                    <Steps.Description>Create your account</Steps.Description>
                  </Steps.Content>
                </Steps.Item>

                <Steps.Separator />

                <Steps.Item index={1}>
                  <Steps.Indicator type="numeric" />
                  <Steps.Content>
                    <Steps.Label>Profile</Steps.Label>
                    <Steps.Description>Complete your profile</Steps.Description>
                  </Steps.Content>
                </Steps.Item>

                <Steps.Separator />

                <Steps.Item index={2}>
                  <Steps.Indicator type="numeric" />
                  <Steps.Content>
                    <Steps.Label>Review</Steps.Label>
                    <Steps.Description>Review and submit</Steps.Description>
                  </Steps.Content>
                </Steps.Item>
              </Steps.List>
            </Steps.Root>
          </Flex>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Orientations
 * Displays horizontal and vertical layouts
 */
export const Orientations: Story = {
  render: () => {
    return (
      <Stack direction="row" gap="800" alignItems="flex-start" width="100%">
        {orientations.map((orientation) => (
          <Box key={orientation} flex="1">
            <Text textStyle="md" fontWeight="600" mb="400">
              {orientation}
            </Text>
            <Steps.Root step={1} count={3} size="sm" orientation={orientation}>
              <Steps.List>
                <Steps.Item index={0}>
                  <Steps.Indicator type="numeric" />
                  <Steps.Content>
                    <Steps.Label>Account</Steps.Label>
                    <Steps.Description>Create your account</Steps.Description>
                  </Steps.Content>
                </Steps.Item>

                <Steps.Separator />

                <Steps.Item index={1}>
                  <Steps.Indicator type="numeric" />
                  <Steps.Content>
                    <Steps.Label>Profile</Steps.Label>
                    <Steps.Description>Complete your profile</Steps.Description>
                  </Steps.Content>
                </Steps.Item>

                <Steps.Separator />

                <Steps.Item index={2}>
                  <Steps.Indicator type="numeric" />
                  <Steps.Content>
                    <Steps.Label>Review</Steps.Label>
                    <Steps.Description>Review and submit</Steps.Description>
                  </Steps.Content>
                </Steps.Item>
              </Steps.List>
            </Steps.Root>
          </Box>
        ))}
      </Stack>
    );
  },
};

/**
 * Numeric vs Icon Indicators
 * Compares numeric indicators with custom icon indicators
 */
export const IndicatorTypes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="800" alignItems="stretch" width="100%">
        <Box>
          <Text textStyle="md" fontWeight="600" mb="400">
            Numeric Indicators (with checkmark on complete)
          </Text>
          <Steps.Root step={1} count={3} size="sm">
            <Steps.List>
              <Steps.Item index={0}>
                <Steps.Indicator type="numeric" />
                <Steps.Content>
                  <Steps.Label>Account</Steps.Label>
                  <Steps.Description>Create your account</Steps.Description>
                </Steps.Content>
              </Steps.Item>

              <Steps.Separator />

              <Steps.Item index={1}>
                <Steps.Indicator type="numeric" />
                <Steps.Content>
                  <Steps.Label>Profile</Steps.Label>
                  <Steps.Description>Complete your profile</Steps.Description>
                </Steps.Content>
              </Steps.Item>

              <Steps.Separator />

              <Steps.Item index={2}>
                <Steps.Indicator type="numeric" />
                <Steps.Content>
                  <Steps.Label>Review</Steps.Label>
                  <Steps.Description>Review and submit</Steps.Description>
                </Steps.Content>
              </Steps.Item>
            </Steps.List>
          </Steps.Root>
        </Box>

        <Box>
          <Text textStyle="md" fontWeight="600" mb="400">
            Icon Indicators (icons remain, styling changes)
          </Text>
          <Steps.Root step={1} count={3} size="sm">
            <Steps.List>
              <Steps.Item index={0}>
                <Steps.Indicator type="icon" icon={<Home />} />
                <Steps.Content>
                  <Steps.Label>Home</Steps.Label>
                  <Steps.Description>Set up your home</Steps.Description>
                </Steps.Content>
              </Steps.Item>

              <Steps.Separator />

              <Steps.Item index={1}>
                <Steps.Indicator type="icon" icon={<Person />} />
                <Steps.Content>
                  <Steps.Label>Profile</Steps.Label>
                  <Steps.Description>Add your details</Steps.Description>
                </Steps.Content>
              </Steps.Item>

              <Steps.Separator />

              <Steps.Item index={2}>
                <Steps.Indicator type="icon" icon={<Settings />} />
                <Steps.Content>
                  <Steps.Label>Settings</Steps.Label>
                  <Steps.Description>Configure preferences</Steps.Description>
                </Steps.Content>
              </Steps.Item>
            </Steps.List>
          </Steps.Root>
        </Box>
      </Stack>
    );
  },
};

/**
 * Compact (Labels Only)
 * Steps without descriptions for a more compact display
 */
export const Compact: Story = {
  render: () => {
    return (
      <Steps.Root step={1} count={3} size="xs">
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Billing</Steps.Label>
            </Steps.Content>
          </Steps.Item>

          <Steps.Separator />

          <Steps.Item index={1}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Payment</Steps.Label>
            </Steps.Content>
          </Steps.Item>

          <Steps.Separator />

          <Steps.Item index={2}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Confirm</Steps.Label>
            </Steps.Content>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    );
  },
};

/**
 * State Transitions
 * Interactive demo showing how states change
 */
export const StateTransitions: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
      <Stack direction="column" gap="600" alignItems="stretch" width="100%">
        <Steps.Root step={currentStep} count={3} size="sm">
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Indicator type="numeric" />
              <Steps.Content>
                <Steps.Label>Account</Steps.Label>
                <Steps.Description>Create your account</Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={1}>
              <Steps.Indicator type="numeric" />
              <Steps.Content>
                <Steps.Label>Profile</Steps.Label>
                <Steps.Description>Complete your profile</Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={2}>
              <Steps.Indicator type="numeric" />
              <Steps.Content>
                <Steps.Label>Review</Steps.Label>
                <Steps.Description>Review and submit</Steps.Description>
              </Steps.Content>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>

        <Flex gap="400">
          <Button
            onPress={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            isDisabled={currentStep === 0}
            variant="outline"
            data-testid="prev-button"
          >
            Previous
          </Button>
          <Button
            onPress={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
            isDisabled={currentStep === 3}
            variant="solid"
            data-testid="next-button"
          >
            {currentStep === 2 ? "Complete" : "Next"}
          </Button>
          <Button
            onPress={() => setCurrentStep(0)}
            variant="ghost"
            data-testid="reset-button"
          >
            Reset
          </Button>
        </Flex>

        <Text textStyle="sm" color="neutral.11">
          Current Step: {currentStep} of 3
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial state: first step is current", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items[0]).toHaveAttribute("data-state", "current");
      await expect(items[1]).toHaveAttribute("data-state", "incomplete");
      await expect(items[2]).toHaveAttribute("data-state", "incomplete");
    });
  },
};

/**
 * All States Complete
 * Demonstrates when all steps are marked complete
 */
export const AllComplete: Story = {
  render: () => {
    return (
      <Steps.Root step={3} count={3} size="sm">
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Account</Steps.Label>
              <Steps.Description>Create your account</Steps.Description>
            </Steps.Content>
          </Steps.Item>

          <Steps.Separator />

          <Steps.Item index={1}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Profile</Steps.Label>
              <Steps.Description>Complete your profile</Steps.Description>
            </Steps.Content>
          </Steps.Item>

          <Steps.Separator />

          <Steps.Item index={2}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Review</Steps.Label>
              <Steps.Description>Review and submit</Steps.Description>
            </Steps.Content>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    await step("All steps should be complete", async () => {
      const items = canvasElement.querySelectorAll('[data-slot="item"]');
      for (const item of items) {
        await expect(item).toHaveAttribute("data-state", "complete");
      }
    });
  },
};

/**
 * E-Commerce Checkout Example
 * Real-world usage example for checkout flow
 */
export const ECommerceCheckout: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);

    return (
      <Stack direction="column" gap="600" alignItems="stretch" width="100%">
        <Steps.Root step={currentStep} count={4} size="md">
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Indicator type="icon" icon={<ShoppingCart />} />
              <Steps.Content>
                <Steps.Label>Cart</Steps.Label>
                <Steps.Description>Review your items</Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={1}>
              <Steps.Indicator type="icon" icon={<Person />} />
              <Steps.Content>
                <Steps.Label>Billing</Steps.Label>
                <Steps.Description>Billing address</Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={2}>
              <Steps.Indicator type="icon" icon={<LocalShipping />} />
              <Steps.Content>
                <Steps.Label>Shipping</Steps.Label>
                <Steps.Description>Delivery options</Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={3}>
              <Steps.Indicator type="icon" icon={<CheckCircle />} />
              <Steps.Content>
                <Steps.Label>Confirm</Steps.Label>
                <Steps.Description>Place order</Steps.Description>
              </Steps.Content>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>

        <Box p="600" bg="neutral.2" borderRadius="md">
          <Text textStyle="lg" fontWeight="600" mb="200">
            {currentStep === 0 && "Review Your Cart"}
            {currentStep === 1 && "Enter Billing Address"}
            {currentStep === 2 && "Choose Shipping Method"}
            {currentStep === 3 && "Confirm Your Order"}
            {currentStep === 4 && "Order Complete!"}
          </Text>
          <Text textStyle="sm" color="neutral.11">
            {currentStep < 4
              ? "Form content would go here..."
              : "Thank you for your purchase!"}
          </Text>
        </Box>

        <Flex gap="400">
          <Button
            onPress={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            isDisabled={currentStep === 0}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onPress={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            isDisabled={currentStep === 4}
            variant="solid"
          >
            {currentStep === 3 ? "Place Order" : "Continue"}
          </Button>
        </Flex>
      </Stack>
    );
  },
};

/**
 * Vertical Layout with Icons
 * Vertical orientation with custom icons
 */
export const VerticalWithIcons: Story = {
  render: () => {
    return (
      <Box maxWidth="400px">
        <Steps.Root step={1} count={3} size="md" orientation="vertical">
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Indicator type="icon" icon={<Home />} />
              <Steps.Content>
                <Steps.Label>Setup Home</Steps.Label>
                <Steps.Description>
                  Configure your workspace and preferences
                </Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={1}>
              <Steps.Indicator type="icon" icon={<Person />} />
              <Steps.Content>
                <Steps.Label>Create Profile</Steps.Label>
                <Steps.Description>
                  Add your personal information and photo
                </Steps.Description>
              </Steps.Content>
            </Steps.Item>

            <Steps.Separator />

            <Steps.Item index={2}>
              <Steps.Indicator type="icon" icon={<CheckCircle />} />
              <Steps.Content>
                <Steps.Label>Get Started</Steps.Label>
                <Steps.Description>
                  You are ready to use the application
                </Steps.Description>
              </Steps.Content>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>
      </Box>
    );
  },
};

/**
 * Accessibility Compliance
 * Verifies WCAG 2.1 AA compliance
 */
export const AccessibilityCompliance: Story = {
  args: {
    step: 1,
    count: 3,
    size: "sm",
    orientation: "horizontal",
  },
  render: (args) => (
    <Steps.Root {...args}>
      <Steps.List>
        <Steps.Item index={0}>
          <Steps.Indicator type="numeric" />
          <Steps.Content>
            <Steps.Label>Account</Steps.Label>
            <Steps.Description>Create your account</Steps.Description>
          </Steps.Content>
        </Steps.Item>

        <Steps.Separator />

        <Steps.Item index={1}>
          <Steps.Indicator type="numeric" />
          <Steps.Content>
            <Steps.Label>Profile</Steps.Label>
            <Steps.Description>Complete your profile</Steps.Description>
          </Steps.Content>
        </Steps.Item>

        <Steps.Separator />

        <Steps.Item index={2}>
          <Steps.Indicator type="numeric" />
          <Steps.Content>
            <Steps.Label>Review</Steps.Label>
            <Steps.Description>Review and submit</Steps.Description>
          </Steps.Content>
        </Steps.Item>
      </Steps.List>
    </Steps.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("List has proper ARIA label", async () => {
      const list = canvas.getByRole("list");
      await expect(list).toHaveAttribute("aria-label", "Progress steps");
    });

    await step("Items have aria-label with step info", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items[0]).toHaveAttribute(
        "aria-label",
        "Step 1 of 3: complete"
      );
      await expect(items[1]).toHaveAttribute(
        "aria-label",
        "Step 2 of 3: current"
      );
      await expect(items[2]).toHaveAttribute(
        "aria-label",
        "Step 3 of 3: incomplete"
      );
    });

    await step("Indicators are hidden from screen readers", async () => {
      const indicators = canvasElement.querySelectorAll(
        '[data-slot="indicator"]'
      );
      for (const indicator of indicators) {
        await expect(indicator).toHaveAttribute("aria-hidden", "true");
      }
    });

    await step("Separators are hidden from screen readers", async () => {
      const separators = canvasElement.querySelectorAll(
        '[data-slot="separator"]'
      );
      for (const separator of separators) {
        await expect(separator).toHaveAttribute("aria-hidden", "true");
      }
    });
  },
};
