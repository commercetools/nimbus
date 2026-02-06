import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Box, Button, Flex, Stack, Steps, Text } from "@commercetools/nimbus";
import { within, expect, userEvent } from "storybook/test";
import {
  Home,
  Person,
  Settings,
  CheckCircle,
  ShoppingCart,
  LocalShipping,
  Check,
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
  parameters: {
    a11y: {
      config: {
        rules: [
          // TODO: evaluate these
          {
            // Disable aria-required-children rule for Steps component.
            // This is an upstream issue in Chakra/Ark UI where the Steps.List
            // has role="tablist" but the Items render as div elements with
            // aria-current instead of proper role="tab" elements.
            // See: https://github.com/chakra-ui/ark/issues/XXXX (tracking issue)
            id: "aria-required-children",
            enabled: false,
          },
          {
            // Disable aria-valid-attr-value rule for Steps component.
            // Chakra/Ark Steps sets aria-controls on triggers pointing to
            // content panel IDs even when no Steps.Content is rendered for
            // that index. This causes axe to report invalid aria-controls.
            id: "aria-valid-attr-value",
            enabled: false,
          },
        ],
      },
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Steps.Root>;

/**
 * Base story - Uncontrolled Mode
 * Demonstrates the most basic implementation with built-in state management
 */
export const Base: Story = {
  args: {
    defaultStep: 1,
    count: 3,
    size: "sm",
    orientation: "horizontal",
  },
  render: (args) => (
    <Steps.Root {...args} data-testid="steps-root">
      <Steps.List>
        <Steps.Item index={0}>
          <Steps.Trigger>
            <Steps.Indicator>
              <Steps.Status
                complete={<Check />}
                incomplete={<Steps.Number />}
              />
            </Steps.Indicator>
            <Box>
              <Steps.Title>Account</Steps.Title>
              <Steps.Description>Create your account</Steps.Description>
            </Box>
          </Steps.Trigger>
          <Steps.Separator />
        </Steps.Item>

        <Steps.Item index={1}>
          <Steps.Trigger>
            <Steps.Indicator>
              <Steps.Status
                complete={<Check />}
                incomplete={<Steps.Number />}
              />
            </Steps.Indicator>
            <Box>
              <Steps.Title>Profile</Steps.Title>
              <Steps.Description>Complete your profile</Steps.Description>
            </Box>
          </Steps.Trigger>
          <Steps.Separator />
        </Steps.Item>

        <Steps.Item index={2}>
          <Steps.Trigger>
            <Steps.Indicator>
              <Steps.Status
                complete={<Check />}
                incomplete={<Steps.Number />}
              />
            </Steps.Indicator>
            <Box>
              <Steps.Title>Review</Steps.Title>
              <Steps.Description>Review and submit</Steps.Description>
            </Box>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>

      <Box mt="600">
        <Steps.Content index={0}>
          <Text>Account form content goes here</Text>
        </Steps.Content>
        <Steps.Content index={1}>
          <Text>Profile form content goes here</Text>
        </Steps.Content>
        <Steps.Content index={2}>
          <Text>Review content goes here</Text>
        </Steps.Content>
        <Steps.CompletedContent>
          <Text fontWeight="bold" color="success.9">
            All steps completed!
          </Text>
        </Steps.CompletedContent>
      </Box>

      <Flex gap="400" mt="400">
        <Steps.PrevTrigger asChild>
          <Button variant="outline">Previous</Button>
        </Steps.PrevTrigger>
        <Steps.NextTrigger asChild>
          <Button variant="solid">Next</Button>
        </Steps.NextTrigger>
      </Flex>
    </Steps.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has step content visible for current step", async () => {
      const content = canvas.getByText("Profile form content goes here");
      await expect(content).toBeInTheDocument();
    });

    await step("Navigation triggers are present", async () => {
      const prevButton = canvas.getByRole("button", { name: "Previous" });
      const nextButton = canvas.getByRole("button", { name: "Next" });
      await expect(prevButton).toBeInTheDocument();
      await expect(nextButton).toBeInTheDocument();
    });
  },
};

/**
 * Controlled Mode
 * Demonstrates using external state management
 */
export const Controlled: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
      <Stack direction="column" gap="600" width="100%">
        <Steps.Root
          step={currentStep}
          onStepChange={(details) => setCurrentStep(details.step)}
          count={3}
          size="sm"
        >
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Status
                    complete={<Check />}
                    incomplete={<Steps.Number />}
                  />
                </Steps.Indicator>
                <Steps.Title>Account</Steps.Title>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>

            <Steps.Item index={1}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Status
                    complete={<Check />}
                    incomplete={<Steps.Number />}
                  />
                </Steps.Indicator>
                <Steps.Title>Profile</Steps.Title>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>

            <Steps.Item index={2}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Status
                    complete={<Check />}
                    incomplete={<Steps.Number />}
                  />
                </Steps.Indicator>
                <Steps.Title>Review</Steps.Title>
              </Steps.Trigger>
            </Steps.Item>
          </Steps.List>

          <Box mt="600">
            <Steps.Content index={0}>Step 1 Content</Steps.Content>
            <Steps.Content index={1}>Step 2 Content</Steps.Content>
            <Steps.Content index={2}>Step 3 Content</Steps.Content>
            <Steps.CompletedContent>All done!</Steps.CompletedContent>
          </Box>

          <Flex gap="400" mt="400">
            <Steps.PrevTrigger asChild>
              <Button variant="outline" data-testid="prev-button">
                Previous
              </Button>
            </Steps.PrevTrigger>
            <Steps.NextTrigger asChild>
              <Button variant="solid" data-testid="next-button">
                Next
              </Button>
            </Steps.NextTrigger>
          </Flex>
        </Steps.Root>

        <Text textStyle="sm" color="neutral.11">
          Controlled step: {currentStep} of 3
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Click next navigates to next step", async () => {
      const nextButton = canvas.getByTestId("next-button");
      await user.click(nextButton);

      const content = canvas.getByText("Step 2 Content");
      await expect(content).toBeInTheDocument();
    });
  },
};

/**
 * Showcase Sizes
 * Displays xs, sm, and md sizes
 */
export const Sizes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="800" alignItems="stretch" width="100%">
        {sizes.map((size) => (
          <Flex
            key={size}
            direction="column"
            gap="200"
            data-testid={`size-${size}`}
          >
            <Text textStyle="md" fontWeight="600">
              Size: {size}
            </Text>
            <Steps.Root defaultStep={1} count={3} size={size}>
              <Steps.List>
                <Steps.Item index={0}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check />}
                        incomplete={<Steps.Number />}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title>Account</Steps.Title>
                      <Steps.Description>Create your account</Steps.Description>
                    </Box>
                  </Steps.Trigger>
                  <Steps.Separator />
                </Steps.Item>

                <Steps.Item index={1}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check />}
                        incomplete={<Steps.Number />}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title>Profile</Steps.Title>
                      <Steps.Description>
                        Complete your profile
                      </Steps.Description>
                    </Box>
                  </Steps.Trigger>
                  <Steps.Separator />
                </Steps.Item>

                <Steps.Item index={2}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check />}
                        incomplete={<Steps.Number />}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title>Review</Steps.Title>
                      <Steps.Description>Review and submit</Steps.Description>
                    </Box>
                  </Steps.Trigger>
                </Steps.Item>
              </Steps.List>
            </Steps.Root>
          </Flex>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All three sizes are rendered", async () => {
      const xsSize = canvas.getByTestId("size-xs");
      const smSize = canvas.getByTestId("size-sm");
      const mdSize = canvas.getByTestId("size-md");

      await expect(xsSize).toBeInTheDocument();
      await expect(smSize).toBeInTheDocument();
      await expect(mdSize).toBeInTheDocument();
    });

    await step("Each size has three steps with titles", async () => {
      // Each size variant should have Account, Profile, Review titles
      const accountTitles = canvas.getAllByText("Account");
      const profileTitles = canvas.getAllByText("Profile");
      const reviewTitles = canvas.getAllByText("Review");

      await expect(accountTitles).toHaveLength(3);
      await expect(profileTitles).toHaveLength(3);
      await expect(reviewTitles).toHaveLength(3);
    });
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
          <Box
            key={orientation}
            flex="1"
            data-testid={`orientation-${orientation}`}
          >
            <Text textStyle="md" fontWeight="600" mb="400">
              {orientation}
            </Text>
            <Steps.Root
              defaultStep={1}
              count={3}
              size="sm"
              orientation={orientation}
              data-testid={`steps-${orientation}`}
            >
              <Steps.List>
                <Steps.Item index={0}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check />}
                        incomplete={<Steps.Number />}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title>Account</Steps.Title>
                      <Steps.Description>Create your account</Steps.Description>
                    </Box>
                  </Steps.Trigger>
                  <Steps.Separator />
                </Steps.Item>

                <Steps.Item index={1}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check />}
                        incomplete={<Steps.Number />}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title>Profile</Steps.Title>
                      <Steps.Description>
                        Complete your profile
                      </Steps.Description>
                    </Box>
                  </Steps.Trigger>
                  <Steps.Separator />
                </Steps.Item>

                <Steps.Item index={2}>
                  <Steps.Trigger>
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check />}
                        incomplete={<Steps.Number />}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title>Review</Steps.Title>
                      <Steps.Description>Review and submit</Steps.Description>
                    </Box>
                  </Steps.Trigger>
                </Steps.Item>
              </Steps.List>
            </Steps.Root>
          </Box>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both orientations are rendered", async () => {
      const horizontal = canvas.getByTestId("orientation-horizontal");
      const vertical = canvas.getByTestId("orientation-vertical");

      await expect(horizontal).toBeInTheDocument();
      await expect(vertical).toBeInTheDocument();
    });

    await step(
      "Horizontal steps has correct orientation attribute",
      async () => {
        const horizontalSteps = canvas.getByTestId("steps-horizontal");
        await expect(horizontalSteps).toHaveAttribute(
          "data-orientation",
          "horizontal"
        );
      }
    );

    await step("Vertical steps has correct orientation attribute", async () => {
      const verticalSteps = canvas.getByTestId("steps-vertical");
      await expect(verticalSteps).toHaveAttribute(
        "data-orientation",
        "vertical"
      );
    });
  },
};

/**
 * With Custom Icons
 * Using custom icons in the indicator
 */
export const WithIcons: Story = {
  render: () => {
    return (
      <Steps.Root
        defaultStep={1}
        count={3}
        size="sm"
        data-testid="steps-with-icons"
      >
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator data-testid="indicator-0">
                <Steps.Status complete={<Check />} incomplete={<Home />} />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Home</Steps.Title>
                <Steps.Description>Set up your home</Steps.Description>
              </Box>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator data-testid="indicator-1">
                <Steps.Status complete={<Check />} incomplete={<Person />} />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Profile</Steps.Title>
                <Steps.Description>Add your details</Steps.Description>
              </Box>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator data-testid="indicator-2">
                <Steps.Status complete={<Check />} incomplete={<Settings />} />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Settings</Steps.Title>
                <Steps.Description>Configure preferences</Steps.Description>
              </Box>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Steps component renders with icons", async () => {
      const stepsRoot = canvas.getByTestId("steps-with-icons");
      await expect(stepsRoot).toBeInTheDocument();
    });

    await step("All three indicators are present", async () => {
      const indicator0 = canvas.getByTestId("indicator-0");
      const indicator1 = canvas.getByTestId("indicator-1");
      const indicator2 = canvas.getByTestId("indicator-2");

      await expect(indicator0).toBeInTheDocument();
      await expect(indicator1).toBeInTheDocument();
      await expect(indicator2).toBeInTheDocument();
    });

    await step(
      "Completed step indicator has data-complete attribute",
      async () => {
        // Step 0 is complete (defaultStep=1), so its indicator should have data-complete
        const indicator0 = canvas.getByTestId("indicator-0");
        await expect(indicator0).toHaveAttribute("data-complete");
      }
    );

    await step(
      "Incomplete step indicator does not have data-complete",
      async () => {
        // Step 2 is incomplete, so its indicator should NOT have data-complete
        const indicator2 = canvas.getByTestId("indicator-2");
        await expect(indicator2).not.toHaveAttribute("data-complete");
      }
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
      <Steps.Root defaultStep={1} count={3} size="xs">
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Billing</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Payment</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Confirm</Steps.Title>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    );
  },
};

/**
 * With Content Panels
 * Full example with content panels and navigation
 */
export const WithContentPanels: Story = {
  render: () => {
    return (
      <Steps.Root defaultStep={0} count={3} size="sm">
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Account</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Profile</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Review</Steps.Title>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>

        <Box mt="600" p="400" bg="neutral.2" borderRadius="md">
          <Steps.Content index={0}>
            <Text fontWeight="bold" mb="200">
              Create your account
            </Text>
            <Text>Enter your email and password to get started.</Text>
          </Steps.Content>
          <Steps.Content index={1}>
            <Text fontWeight="bold" mb="200">
              Complete your profile
            </Text>
            <Text>Add your personal information and preferences.</Text>
          </Steps.Content>
          <Steps.Content index={2}>
            <Text fontWeight="bold" mb="200">
              Review and confirm
            </Text>
            <Text>Review your information before submitting.</Text>
          </Steps.Content>
          <Steps.CompletedContent>
            <Text fontWeight="bold" color="success.9">
              All steps completed successfully!
            </Text>
          </Steps.CompletedContent>
        </Box>

        <Flex gap="400" mt="400">
          <Steps.PrevTrigger asChild>
            <Button variant="outline">Back</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button variant="solid">Continue</Button>
          </Steps.NextTrigger>
        </Flex>
      </Steps.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Initial content is shown", async () => {
      const content = canvas.getByText("Create your account");
      await expect(content).toBeInTheDocument();
    });

    await step("Clicking next shows next content", async () => {
      const nextButton = canvas.getByRole("button", { name: "Continue" });
      await user.click(nextButton);

      const content = canvas.getByText("Complete your profile");
      await expect(content).toBeInTheDocument();
    });

    await step("Clicking back shows previous content", async () => {
      const backButton = canvas.getByRole("button", { name: "Back" });
      await user.click(backButton);

      const content = canvas.getByText("Create your account");
      await expect(content).toBeInTheDocument();
    });
  },
};

/**
 * E-Commerce Checkout Example
 * Real-world usage example for checkout flow
 */
export const ECommerceCheckout: Story = {
  render: () => {
    return (
      <Steps.Root defaultStep={1} count={4} size="md">
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<ShoppingCart />}
                />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Cart</Steps.Title>
                <Steps.Description>Review your items</Steps.Description>
              </Box>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status complete={<Check />} incomplete={<Person />} />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Billing</Steps.Title>
                <Steps.Description>Billing address</Steps.Description>
              </Box>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<LocalShipping />}
                />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Shipping</Steps.Title>
                <Steps.Description>Delivery options</Steps.Description>
              </Box>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={3}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<CheckCircle />}
                />
              </Steps.Indicator>
              <Box>
                <Steps.Title>Confirm</Steps.Title>
                <Steps.Description>Place order</Steps.Description>
              </Box>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>

        <Box mt="600" p="600" bg="neutral.2" borderRadius="md">
          <Steps.Content index={0}>
            <Text fontWeight="bold">Review Your Cart</Text>
          </Steps.Content>
          <Steps.Content index={1}>
            <Text fontWeight="bold">Enter Billing Address</Text>
          </Steps.Content>
          <Steps.Content index={2}>
            <Text fontWeight="bold">Choose Shipping Method</Text>
          </Steps.Content>
          <Steps.Content index={3}>
            <Text fontWeight="bold">Confirm Your Order</Text>
          </Steps.Content>
          <Steps.CompletedContent>
            <Text fontWeight="bold" color="success.9">
              Order Complete! Thank you for your purchase.
            </Text>
          </Steps.CompletedContent>
        </Box>

        <Flex gap="400" mt="400">
          <Steps.PrevTrigger asChild>
            <Button variant="outline">Back</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button variant="solid">Continue</Button>
          </Steps.NextTrigger>
        </Flex>
      </Steps.Root>
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
        <Steps.Root defaultStep={1} count={3} size="md" orientation="vertical">
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Status complete={<Check />} incomplete={<Home />} />
                </Steps.Indicator>
                <Box>
                  <Steps.Title>Setup Home</Steps.Title>
                  <Steps.Description>
                    Configure your workspace and preferences
                  </Steps.Description>
                </Box>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>

            <Steps.Item index={1}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Status complete={<Check />} incomplete={<Person />} />
                </Steps.Indicator>
                <Box>
                  <Steps.Title>Create Profile</Steps.Title>
                  <Steps.Description>
                    Add your personal information and photo
                  </Steps.Description>
                </Box>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>

            <Steps.Item index={2}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Status
                    complete={<Check />}
                    incomplete={<CheckCircle />}
                  />
                </Steps.Indicator>
                <Box>
                  <Steps.Title>Get Started</Steps.Title>
                  <Steps.Description>
                    You are ready to use the application
                  </Steps.Description>
                </Box>
              </Steps.Trigger>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>
      </Box>
    );
  },
};

/**
 * Linear Mode
 * Restricts navigation to sequential progress only
 */
export const LinearMode: Story = {
  render: () => {
    return (
      <Steps.Root
        defaultStep={0}
        count={3}
        size="sm"
        linear
        data-testid="linear-steps"
      >
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger data-testid="trigger-0">
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Step 1</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger data-testid="trigger-1">
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Step 2</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger data-testid="trigger-2">
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Step 3</Steps.Title>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>

        <Box mt="600" p="400" bg="neutral.2" borderRadius="md">
          <Steps.Content index={0}>
            <Text>Complete this step before proceeding.</Text>
          </Steps.Content>
          <Steps.Content index={1}>
            <Text>You can only go forward or back to completed steps.</Text>
          </Steps.Content>
          <Steps.Content index={2}>
            <Text>Final step - you can go back but not skip ahead.</Text>
          </Steps.Content>
          <Steps.CompletedContent>
            <Text fontWeight="bold" color="success.9">
              All steps completed!
            </Text>
          </Steps.CompletedContent>
        </Box>

        <Flex gap="400" mt="400">
          <Steps.PrevTrigger asChild>
            <Button variant="outline" data-testid="back-button">
              Back
            </Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button variant="solid" data-testid="next-button">
              Next
            </Button>
          </Steps.NextTrigger>
        </Flex>
      </Steps.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Linear mode starts at step 0", async () => {
      const content = canvas.getByText("Complete this step before proceeding.");
      await expect(content).toBeInTheDocument();
    });

    await step("Back button is disabled on first step", async () => {
      const backButton = canvas.getByTestId("back-button");
      await expect(backButton).toBeDisabled();
    });

    await step("Can navigate forward with Next button", async () => {
      const nextButton = canvas.getByTestId("next-button");
      await user.click(nextButton);

      const content = canvas.getByText(
        "You can only go forward or back to completed steps."
      );
      await expect(content).toBeInTheDocument();
    });

    await step("Can navigate back to completed step", async () => {
      const backButton = canvas.getByTestId("back-button");
      await user.click(backButton);

      const content = canvas.getByText("Complete this step before proceeding.");
      await expect(content).toBeInTheDocument();
    });
  },
};

/**
 * Responsive Orientation
 * Changes from vertical on mobile to horizontal on larger screens
 */
export const ResponsiveOrientation: Story = {
  render: () => {
    return (
      <Steps.Root
        defaultStep={1}
        count={3}
        size="sm"
        orientation={{ base: "vertical", md: "horizontal" }}
      >
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Account</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Profile</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Review</Steps.Title>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>

        <Text mt="400" textStyle="sm" color="neutral.11">
          Resize the window to see the orientation change (vertical on mobile,
          horizontal on desktop).
        </Text>
      </Steps.Root>
    );
  },
};
