import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from "@commercetools/nimbus";

/**
 * FEC-1170 — variant × activeFillStyle exploration (NOT the final component
 * stories).
 *
 * Read top to bottom: Button (the variant vocabulary we build on) →
 * ToggleButton (resting chrome × active fill) → ToggleButtonGroup.
 *
 * Two orthogonal style axes on the toggles:
 *   - `variant`         → resting chrome, always neutral. Standalone
 *     ToggleButton: outline | ghost | subtle. The group omits `ghost`
 *     (outline | subtle) — it needs a resting affordance to bind the set.
 *   - `activeFillStyle` → active-state fill: tint (light wash) | solid (full)
 *
 * `colorPalette` applies to the ACTIVE state only; resting is always neutral.
 * In a group, `activeFillStyle` defaults from `selectionMode` (single → solid,
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

const buttonVariants = ["solid", "subtle", "outline", "ghost", "link"] as const;
// Standalone ToggleButton keeps `ghost`; the group omits it (a group needs a
// resting affordance to bind the set), so the group matrix iterates the
// narrower set.
const toggleButtonVariants = ["outline", "ghost", "subtle"] as const;
const groupVariants = ["outline", "subtle"] as const;
const fillStyles = ["tint", "solid"] as const;

type GroupVariant = (typeof groupVariants)[number];
type FillStyle = (typeof fillStyles)[number];

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

const GroupCell = ({
  variant,
  activeFillStyle,
  selectionMode,
  selectedKeys,
}: {
  variant: GroupVariant;
  activeFillStyle: FillStyle;
  selectionMode: "single" | "multiple";
  selectedKeys: string[];
}) => (
  <ToggleButtonGroup.Root
    variant={variant}
    activeFillStyle={activeFillStyle}
    selectionMode={selectionMode}
    colorPalette="primary"
    defaultSelectedKeys={selectedKeys}
    aria-label={`${variant} ${activeFillStyle} ${selectionMode}`}
  >
    <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="center">Center</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
  </ToggleButtonGroup.Root>
);

// variant × activeFillStyle grid for one selection mode. Both matrices set
// activeFillStyle explicitly, so the columns show the full cross product
// regardless of the selectionMode-derived default (which the "defaults" block
// below illustrates).
const GroupMatrix = ({
  selectionMode,
  selectedKeys,
}: {
  selectionMode: "single" | "multiple";
  selectedKeys: string[];
}) => (
  <Stack gap="400">
    {/* column headers */}
    <Stack direction="row" gap="600" alignItems="center">
      <Box width="90px" flexShrink="0" />
      {fillStyles.map((f) => (
        <Box key={f} width="240px" flexShrink="0">
          <Text fontWeight="600">{f}</Text>
        </Box>
      ))}
    </Stack>

    {groupVariants.map((v) => (
      <Stack key={v} direction="row" gap="600" alignItems="center">
        <Box width="90px" flexShrink="0">
          <Text fontWeight="600">{v}</Text>
        </Box>
        {fillStyles.map((f) => (
          <Box key={f} width="240px" flexShrink="0">
            <GroupCell
              variant={v}
              activeFillStyle={f}
              selectionMode={selectionMode}
              selectedKeys={selectedKeys}
            />
          </Box>
        ))}
      </Stack>
    ))}
  </Stack>
);

export const VariantExploration: Story = {
  render: () => (
    <Stack gap="1200" padding="600">
      {/* 1 — Button (reference) --------------------------------------- */}
      <Stack gap="300">
        <SectionHeading>1 · Button — variants (reference)</SectionHeading>
        <Stack direction="row" gap="400" alignItems="center" flexWrap="wrap">
          {buttonVariants.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* 2 — ToggleButton (standalone) -------------------------------- */}
      <Stack gap="400">
        <SectionHeading>
          2 · ToggleButton — variant × activeFillStyle (resting vs selected)
        </SectionHeading>

        {/* column headers */}
        <Stack direction="row" gap="600" alignItems="center">
          <Box width="90px" flexShrink="0" />
          <Box width="120px" flexShrink="0">
            <Text fontWeight="600">off</Text>
          </Box>
          <Box width="120px" flexShrink="0">
            <Text fontWeight="600">tint · on</Text>
          </Box>
          <Box width="120px" flexShrink="0">
            <Text fontWeight="600">solid · on</Text>
          </Box>
        </Stack>

        {toggleButtonVariants.map((v) => (
          <Stack key={v} direction="row" gap="600" alignItems="center">
            <Box width="90px" flexShrink="0">
              <Text fontWeight="600">{v}</Text>
            </Box>
            <Box width="120px" flexShrink="0">
              <ToggleButton variant={v}>{v}</ToggleButton>
            </Box>
            <Box width="120px" flexShrink="0">
              <ToggleButton variant={v} activeFillStyle="tint" defaultSelected>
                {v}
              </ToggleButton>
            </Box>
            <Box width="120px" flexShrink="0">
              <ToggleButton variant={v} activeFillStyle="solid" defaultSelected>
                {v}
              </ToggleButton>
            </Box>
          </Stack>
        ))}
      </Stack>

      {/* 3 — ToggleButtonGroup ---------------------------------------- */}
      <Stack gap="800">
        <SectionHeading>
          3 · ToggleButtonGroup — variant × activeFillStyle
        </SectionHeading>

        {/* 3a — single-select matrix */}
        <Stack gap="400">
          <SubHeading>Single-select — Center = ON</SubHeading>
          <GroupMatrix selectionMode="single" selectedKeys={["center"]} />
        </Stack>

        {/* 3b — multi-select matrix (adjacent selection shows the border join) */}
        <Stack gap="400">
          <SubHeading>Multi-select — Left + Center = ON</SubHeading>
          <GroupMatrix
            selectionMode="multiple"
            selectedKeys={["left", "center"]}
          />
        </Stack>

        {/* 3c — the selectionMode-derived activeFillStyle default (no explicit prop) */}
        <Stack gap="300">
          <SubHeading>
            Default activeFillStyle derives from selectionMode (no
            activeFillStyle prop)
          </SubHeading>
          <Stack
            direction="row"
            gap="800"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            <Box>
              <Text marginBottom="200">single → solid</Text>
              <ToggleButtonGroup.Root
                selectionMode="single"
                variant="outline"
                colorPalette="primary"
                defaultSelectedKeys={["center"]}
                aria-label="single-select default"
              >
                <ToggleButtonGroup.Button id="left">
                  Left
                </ToggleButtonGroup.Button>
                <ToggleButtonGroup.Button id="center">
                  Center
                </ToggleButtonGroup.Button>
                <ToggleButtonGroup.Button id="right">
                  Right
                </ToggleButtonGroup.Button>
              </ToggleButtonGroup.Root>
            </Box>
            <Box>
              <Text marginBottom="200">multiple → tint (no wall of solid)</Text>
              <ToggleButtonGroup.Root
                selectionMode="multiple"
                variant="subtle"
                colorPalette="primary"
                defaultSelectedKeys={["bold", "italic"]}
                aria-label="multi-select default"
              >
                <ToggleButtonGroup.Button id="bold">
                  Bold
                </ToggleButtonGroup.Button>
                <ToggleButtonGroup.Button id="italic">
                  Italic
                </ToggleButtonGroup.Button>
                <ToggleButtonGroup.Button id="underline">
                  Underline
                </ToggleButtonGroup.Button>
              </ToggleButtonGroup.Root>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  ),
};
