import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Link,
  List,
  Stack,
  Text,
  type AlertProps,
} from "@commercetools/nimbus";
import { AutoAwesome, Campaign, Lightbulb } from "@commercetools/nimbus-icons";

const meta: Meta<typeof Alert.Root> = {
  title: "Playground/Alert",
  component: Alert.Root,
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

export default meta;

type Story = StoryObj<typeof Alert.Root>;

const variants = ["flat", "outlined", "accent-start"] as const;
const palettes: AlertProps["colorPalette"][] = [
  "neutral",
  "primary",
  "info",
  "positive",
  "warning",
  "critical",
];

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="700" fontSize="500">
    {children}
  </Text>
);

const SubHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="600" fontSize="400">
    {children}
  </Text>
);

const Caption = ({ children }: { children: ReactNode }) => (
  <Text color="neutral.11" fontSize="300">
    {children}
  </Text>
);

/** Status-appropriate copy, so the matrix reads like product rather than lorem. */
const copy: Record<string, { title: string; description: string }> = {
  primary: {
    title: "New workspace available",
    description: "Your team can now collaborate on catalogs in one place.",
  },
  neutral: {
    title: "Draft saved",
    description: "Last saved 2 minutes ago.",
  },
  info: {
    title: "New pricing model",
    description: "Tiered pricing is now available on all projects.",
  },
  positive: {
    title: "Import finished",
    description: "248 products were added to your catalog.",
  },
  warning: {
    title: "Trial ending soon",
    description: "Your trial ends in 5 days.",
  },
  critical: {
    title: "Payment failed",
    description: "We could not charge the card on file.",
  },
};

// ---------------------------------------------------------------------------
// In-use assemblies
// ---------------------------------------------------------------------------

/** Full-bleed page banner — built from style props, not a layout axis. */
const MaintenanceBannerAssembly = () => (
  <Box
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    overflow="hidden"
    maxWidth="760px"
  >
    <Alert.Root
      colorPalette="warning"
      variant="outlined"
      borderRadius="0"
      borderInline="none"
      paddingInline="600"
    >
      <Alert.Title>Scheduled maintenance</Alert.Title>
      <Alert.Description>
        The system will be unavailable tonight from 02:00 to 03:00 UTC.{" "}
        <Link href="#">See the status page</Link>
      </Alert.Description>
      <Alert.DismissButton onPress={() => {}} />
    </Alert.Root>
    <Box padding="400" minHeight="96px" bg="neutral.1">
      <Text fontWeight="700" marginBottom="200">
        Orders
      </Text>
      <Caption>
        The banner sits flush against the page chrome above the content.
      </Caption>
    </Box>
  </Box>
);

/** Form validation summary — `critical`, so it defaults to `role="alert"`. */
const FormErrorAssembly = () => (
  <Stack
    gap="400"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
  >
    <Text fontWeight="700" fontSize="500">
      Create discount
    </Text>
    <Alert.Root colorPalette="critical">
      <Alert.Title as="h3">This discount could not be saved</Alert.Title>
      <Alert.Description>
        <Stack gap="100">
          <Text>Two fields need attention before you can continue:</Text>
          <List.Root>
            <List.Item>Discount value must be greater than 0</List.Item>
            <List.Item>Valid-from date cannot be in the past</List.Item>
          </List.Root>
        </Stack>
      </Alert.Description>
    </Alert.Root>
    <Stack direction="row" gap="200" justifyContent="flex-end">
      <Button variant="ghost">Cancel</Button>
      <Button variant="solid" colorPalette="primary">
        Save
      </Button>
    </Stack>
  </Stack>
);

/** Agent confirmation — silent, icon-less, with a single undo action. */
const AgentConfirmationAssembly = () => (
  <Stack
    gap="300"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
  >
    <Stack direction="row" gap="200" alignItems="center">
      <AutoAwesome />
      <Text fontWeight="600">Pricing assistant</Text>
    </Stack>
    <Caption>
      Applied a 10% discount to 3 products, as you asked. Let me know if you
      want it reverted.
    </Caption>
    <Alert.Root
      colorPalette="positive"
      role="group"
      aria-label="Suggestion applied"
      hideIcon
    >
      <Alert.Title>Suggestion applied</Alert.Title>
      <Alert.Description>3 products updated.</Alert.Description>
      <Alert.Actions>
        <Button size="sm" variant="outline">
          Undo
        </Button>
      </Alert.Actions>
    </Alert.Root>
  </Stack>
);

/** Onboarding hint — flat, custom icon, no surface of its own. */
const OnboardingHintAssembly = () => (
  <Stack
    gap="300"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
  >
    <Text fontWeight="700" fontSize="500">
      Product settings
    </Text>
    <Alert.Root colorPalette="info" variant="flat">
      <Alert.Icon>
        <Lightbulb />
      </Alert.Icon>
      <Alert.Description>
        Products inherit their tax category from the project unless you set one
        here. <Link href="#">Read about tax categories</Link>
      </Alert.Description>
    </Alert.Root>
  </Stack>
);

/** Trial expiry — promoted heading, two actions, with a dismiss button. */
const TrialExpiryAssembly = () => (
  <Stack
    gap="300"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
  >
    <Alert.Root colorPalette="green">
      <Alert.Icon>
        <Campaign />
      </Alert.Icon>
      <Alert.Title as="h3">Your trial ends in 5 days</Alert.Title>
      <Alert.Description>
        Add a payment method to keep your projects active after 28 September.
      </Alert.Description>
      {/* No colorPalette on the buttons: they inherit the alert's, so the
          action hierarchy is carried by variant alone. A primary-palette
          button here would put a second colour identity inside a container
          that already has one. */}
      <Alert.Actions>
        <Button size="sm" variant="solid">
          Add payment method
        </Button>
        <Button size="sm" variant="outline">
          Compare plans
        </Button>
      </Alert.Actions>
      <Alert.DismissButton onPress={() => {}} />
    </Alert.Root>
  </Stack>
);

export const VariantExploration: Story = {
  render: () => (
    <Stack gap="1200" padding="600">
      <Stack gap="400">
        <SectionHeading>1 · Emphasis × status</SectionHeading>
        <Caption>
          The two axes Alert has. Cells use role="group" so the matrix does not
          spawn a live region per cell. Every palette supplies its own icon.
        </Caption>

        <Stack direction="row" gap="400" alignItems="center">
          <Box width="90px" flexShrink="0" />
          {variants.map((v) => (
            <Box key={v} flex="1 1 0" minWidth="0">
              <Text fontWeight="600">{v}</Text>
            </Box>
          ))}
        </Stack>

        {palettes.map((palette) => {
          const label = String(palette);
          return (
            <Stack key={label} direction="row" gap="400" alignItems="stretch">
              <Box width="90px" flexShrink="0" paddingTop="200">
                <Text fontWeight="600">{label}</Text>
              </Box>
              {variants.map((v) => (
                <Box key={v} flex="1 1 0" minWidth="0">
                  <Alert.Root
                    colorPalette={palette}
                    variant={v}
                    role="group"
                    aria-label={`${label} ${v}`}
                  >
                    <Alert.Title>{copy[label].title}</Alert.Title>
                    <Alert.Description>
                      {copy[label].description}
                    </Alert.Description>
                  </Alert.Root>
                </Box>
              ))}
            </Stack>
          );
        })}
      </Stack>

      <Stack gap="400">
        <SectionHeading>2 · Anatomy</SectionHeading>
        <Caption>
          Every slot, added one at a time. The icon and the dismiss button are
          one text line tall and centred on the first line of text, so they stay
          put as slots come and go.
        </Caption>

        <Stack gap="300" maxWidth="560px">
          <SubHeading>Description only</SubHeading>
          <Alert.Root colorPalette="info" role="group" aria-label="anatomy 1">
            <Alert.Description>A single line of status.</Alert.Description>
          </Alert.Root>

          <SubHeading>+ Title</SubHeading>
          <Alert.Root colorPalette="info" role="group" aria-label="anatomy 2">
            <Alert.Title>Import finished</Alert.Title>
            <Alert.Description>A single line of status.</Alert.Description>
          </Alert.Root>

          <SubHeading>+ Actions</SubHeading>
          <Alert.Root colorPalette="info" role="group" aria-label="anatomy 3">
            <Alert.Title>Import finished</Alert.Title>
            <Alert.Description>A single line of status.</Alert.Description>
            <Alert.Actions>
              <Button size="sm" variant="outline">
                View report
              </Button>
              <Button size="sm" variant="ghost">
                Dismiss
              </Button>
            </Alert.Actions>
          </Alert.Root>

          <SubHeading>+ Dismiss button</SubHeading>
          <Alert.Root colorPalette="info" role="group" aria-label="anatomy 4">
            <Alert.Title>Import finished</Alert.Title>
            <Alert.Description>A single line of status.</Alert.Description>
            <Alert.Actions>
              <Button size="sm" variant="outline">
                View report
              </Button>
            </Alert.Actions>
            <Alert.DismissButton onPress={() => {}} />
          </Alert.Root>

          <SubHeading>Custom icon · no icon</SubHeading>
          <Alert.Root colorPalette="info" role="group" aria-label="anatomy 5">
            <Alert.Icon>
              <Lightbulb />
            </Alert.Icon>
            <Alert.Description>
              A custom icon replaces the status icon.
            </Alert.Description>
          </Alert.Root>
          <Alert.Root
            colorPalette="info"
            role="group"
            aria-label="anatomy 6"
            hideIcon
          >
            <Alert.Description>
              hideIcon removes it, and the text starts at the padding edge.
            </Alert.Description>
          </Alert.Root>

          <SubHeading>Wrapping content</SubHeading>
          <Caption>
            The icon stays on the first line rather than drifting to the middle
            of the paragraph. `Alert.Description` is a div, so block content is
            valid inside it.
          </Caption>
          <Alert.Root
            colorPalette="critical"
            role="group"
            aria-label="anatomy 7"
          >
            <Alert.Title>Import partially failed</Alert.Title>
            <Alert.Description>
              <Stack gap="100">
                <Text>
                  212 of 248 products were imported. The remaining rows were
                  rejected because they referenced a product type that does not
                  exist in this project.
                </Text>
                <List.Root>
                  <List.Item>Row 14 — unknown type "bundle"</List.Item>
                  <List.Item>Row 27 — unknown type "kit"</List.Item>
                </List.Root>
              </Stack>
            </Alert.Description>
            <Alert.DismissButton onPress={() => {}} />
          </Alert.Root>
        </Stack>
      </Stack>

      <Stack gap="400">
        <SectionHeading>3 · Announcement model</SectionHeading>
        <Caption>
          Alert's third axis is invisible. These three look identical and behave
          differently for a screen reader, which is exactly why it is worth
          seeing them side by side.
        </Caption>

        <Stack gap="300" maxWidth="560px">
          <SubHeading>role="status" — default, polite</SubHeading>
          <Caption>Announced once the user is idle. Most alerts.</Caption>
          <Alert.Root colorPalette="positive">
            <Alert.Title>Changes saved</Alert.Title>
            <Alert.Description>All edits are live.</Alert.Description>
          </Alert.Root>

          <SubHeading>role="alert" — assertive, default on critical</SubHeading>
          <Caption>Interrupts. Reserve for errors that block the task.</Caption>
          <Alert.Root colorPalette="critical">
            <Alert.Title>Payment failed</Alert.Title>
            <Alert.Description>
              We could not charge the card on file.
            </Alert.Description>
          </Alert.Root>

          <SubHeading>role="group" — silent</SubHeading>
          <Caption>
            Not a live region. For confirmations the user is already watching.
          </Caption>
          <Alert.Root
            colorPalette="neutral"
            role="group"
            aria-label="Draft saved"
          >
            <Alert.Title>Draft saved</Alert.Title>
            <Alert.Description>Last saved 2 minutes ago.</Alert.Description>
          </Alert.Root>
        </Stack>
      </Stack>

      <Stack gap="400">
        <SectionHeading>4 · Text scale</SectionHeading>
        <Caption>
          `fontSize` on `Alert.Root` scales the whole alert — title, description
          and the icon box, which is one text line tall. Nothing is pinned to a
          pixel value.
        </Caption>
        <Stack gap="300" maxWidth="560px">
          {(["300", "400", "600"] as const).map((size) => (
            <Alert.Root
              key={size}
              colorPalette="info"
              fontSize={size}
              role="group"
              aria-label={`scale ${size}`}
            >
              <Alert.Title>fontSize {size}</Alert.Title>
              <Alert.Description>
                The icon and the dismiss button follow the text.
              </Alert.Description>
              <Alert.DismissButton onPress={() => {}} />
            </Alert.Root>
          ))}
        </Stack>
      </Stack>

      <Stack gap="800">
        <SectionHeading>5 · In use</SectionHeading>

        <Stack gap="300">
          <SubHeading>Page-level maintenance banner</SubHeading>
          <Caption>
            outlined warning · full-bleed via style props · dismiss button
          </Caption>
          <MaintenanceBannerAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Form validation summary</SubHeading>
          <Caption>
            critical · defaults to role="alert" so it interrupts · title
            promoted to h3 · list inside the description
          </Caption>
          <FormErrorAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Agent confirmation</SubHeading>
          <Caption>
            positive · role="group" so it stays silent · hideIcon · single undo
            action
          </Caption>
          <AgentConfirmationAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Onboarding hint</SubHeading>
          <Caption>
            flat info · custom icon · no surface, sits inside an existing panel
          </Caption>
          <OnboardingHintAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Trial expiry</SubHeading>
          <Caption>
            outlined (default) · custom icon · promoted heading · two actions ·
            dismiss button
          </Caption>
          <TrialExpiryAssembly />
        </Stack>
      </Stack>
    </Stack>
  ),
};
