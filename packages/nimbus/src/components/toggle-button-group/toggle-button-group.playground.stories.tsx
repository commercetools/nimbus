import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Button,
  Stack,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from "@commercetools/nimbus";

/**
 * FEC-1170 — variant exploration (NOT the final component stories).
 *
 * This page exists to document *why* the variant set landed where it did. It
 * puts Buttons, ToggleButtons and ToggleButtonGroups on one page so the
 * relationships are visible at a glance.
 *
 * Where we ended up: a toggle variant describes the resting *chrome* of the
 * control, and every variant escalates to the most prominent color (solid
 * colorPalette.9) when selected. That leaves three coherent variants:
 *
 *   - `outline` — bordered segmented control (view-mode switching)
 *   - `ghost`   — no chrome (toolbar segmentation)
 *   - `subtle`  — filled-tint "track" (filter toggles)
 *
 * Button's `solid` and `link` were dropped on purpose: `solid` is the selected
 * *state* (not a variant), and a "link" has no coherent toggled affordance.
 *
 * This story will be replaced by proper stories + play tests before the change
 * leaves draft.
 */
const meta: Meta<typeof ToggleButtonGroup.Root> = {
  title: "Components/Buttons/ToggleButtonGroup (Playground)",
  component: ToggleButtonGroup.Root,
  parameters: {
    // Exploration scaffolding — keep it out of visual regression.
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleButtonGroup.Root>;

const variants = ["outline", "ghost", "subtle"] as const;

type Variant = (typeof variants)[number];

const GroupRow = ({ variant }: { variant: Variant }) => (
  <Stack direction="row" alignItems="center" gap="600">
    <Box width="80px" flexShrink="0">
      <Text fontWeight="600">{variant}</Text>
    </Box>

    {/* Plain Button for reference. */}
    <Box width="120px" flexShrink="0">
      <Button variant={variant}>Button</Button>
    </Box>

    {/* The candidate: group preselects Center so OFF + ON show together. */}
    <ToggleButtonGroup.Root
      variant={variant}
      colorPalette="primary"
      defaultSelectedKeys={["center"]}
      aria-label={`${variant} group`}
    >
      <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="center">Center</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
    </ToggleButtonGroup.Root>
  </Stack>
);

/**
 * Everything on one page: reference Buttons, reference ToggleButtons, and the
 * candidate ToggleButtonGroup variants.
 */
export const VariantExploration: Story = {
  render: () => (
    <Stack gap="1000" padding="600">
      <Stack gap="300">
        <Text fontWeight="700" fontSize="500">
          Buttons (reference)
        </Text>
        <Stack direction="row" gap="400" alignItems="center">
          <Button variant="solid">solid</Button>
          <Button variant="subtle">subtle</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="link">link</Button>
        </Stack>
      </Stack>

      <Stack gap="300">
        <Text fontWeight="700" fontSize="500">
          ToggleButtons — variants (off vs on)
        </Text>
        <Stack direction="row" gap="600" alignItems="center" flexWrap="wrap">
          {variants.map((v) => (
            <Stack key={v} direction="row" gap="200" alignItems="center">
              <ToggleButton variant={v}>{v} · off</ToggleButton>
              <ToggleButton variant={v} defaultSelected>
                {v} · on
              </ToggleButton>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack gap="400">
        <Text fontWeight="700" fontSize="500">
          ToggleButtonGroup — variants (Center = ON)
        </Text>
        {variants.map((v) => (
          <GroupRow key={v} variant={v} />
        ))}
      </Stack>

      <Stack gap="400">
        <Text fontWeight="700" fontSize="500">
          ToggleButtonGroup — critical palette (Center = ON)
        </Text>
        <Stack direction="row" gap="600" alignItems="center" flexWrap="wrap">
          {variants.map((v) => (
            <ToggleButtonGroup.Root
              key={v}
              variant={v}
              colorPalette="critical"
              defaultSelectedKeys={["center"]}
              aria-label={`${v} critical group`}
            >
              <ToggleButtonGroup.Button id="left">
                {v}
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button id="center">
                On
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button id="right">
                Off
              </ToggleButtonGroup.Button>
            </ToggleButtonGroup.Root>
          ))}
        </Stack>
      </Stack>
    </Stack>
  ),
};
