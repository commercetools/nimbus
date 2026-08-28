import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Stack,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from "@commercetools/nimbus";

/**
 * FEC-1170 — variant × fillStyle exploration (NOT the final component stories).
 *
 * Documents the two orthogonal style axes:
 *   - `variant`   → resting chrome, always neutral: outline | ghost | subtle
 *   - `fillStyle` → active-state fill: tint (light wash) | solid (full fill)
 *
 * `colorPalette` applies to the ACTIVE state only; resting is always neutral.
 * In a group, `fillStyle` defaults from `selectionMode` (single → solid,
 * multiple → tint) and is overridable.
 *
 * Replaced by real stories + play tests before this change leaves draft.
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
const fillStyles = ["tint", "solid"] as const;

type Variant = (typeof variants)[number];
type FillStyle = (typeof fillStyles)[number];

const Cell = ({
  variant,
  fillStyle,
}: {
  variant: Variant;
  fillStyle: FillStyle;
}) => (
  <ToggleButtonGroup.Root
    variant={variant}
    fillStyle={fillStyle}
    selectionMode="single"
    colorPalette="primary"
    defaultSelectedKeys={["center"]}
    aria-label={`${variant} ${fillStyle}`}
  >
    <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="center">Center</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
  </ToggleButtonGroup.Root>
);

export const VariantExploration: Story = {
  render: () => (
    <Stack gap="1000" padding="600">
      <Stack gap="400">
        <Text fontWeight="700" fontSize="500">
          variant × fillStyle — single-select (Center = ON)
        </Text>

        {/* Column headers */}
        <Stack direction="row" gap="600" alignItems="center">
          <Box width="80px" flexShrink="0" />
          {fillStyles.map((f) => (
            <Box key={f} width="240px" flexShrink="0">
              <Text fontWeight="600">{f}</Text>
            </Box>
          ))}
        </Stack>

        {variants.map((v) => (
          <Stack key={v} direction="row" gap="600" alignItems="center">
            <Box width="80px" flexShrink="0">
              <Text fontWeight="600">{v}</Text>
            </Box>
            {fillStyles.map((f) => (
              <Box key={f} width="240px" flexShrink="0">
                <Cell variant={v} fillStyle={f} />
              </Box>
            ))}
          </Stack>
        ))}
      </Stack>

      <Stack gap="300">
        <Text fontWeight="700" fontSize="500">
          Multi-select — fillStyle defaults to tint (no wall of solid)
        </Text>
        <ToggleButtonGroup.Root
          selectionMode="multiple"
          variant="ghost"
          colorPalette="primary"
          defaultSelectedKeys={["bold", "italic"]}
          aria-label="Format"
        >
          <ToggleButtonGroup.Button id="bold">Bold</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="italic">
            Italic
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="underline">
            Underline
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </Stack>

      <Stack gap="300">
        <Text fontWeight="700" fontSize="500">
          Standalone ToggleButton — resting chrome (always neutral)
        </Text>
        <Stack direction="row" gap="400" alignItems="center">
          {variants.map((v) => (
            <ToggleButton key={v} variant={v}>
              {v}
            </ToggleButton>
          ))}
        </Stack>
      </Stack>
    </Stack>
  ),
};
