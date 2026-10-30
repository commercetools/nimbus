import figma from "@figma/code-connect/react";
import { Steps } from "./steps";
import { Box } from "../box/box";

// --- Steps → Steps.Root ---
//
// The Figma Steps component always has three steps, and Code Connect cannot
// give each repeated child snippet its own position. So the snippet writes
// out three items with their own index and a matching count instead of using
// figma.children. The titles are placeholders: the designer's titles are on
// the canvas.
figma.connect(
  Steps.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=7381-65271",
  {
    props: {
      size: figma.enum("size", { xs: "xs", sm: "sm", md: "md" }),
      orientation: figma.enum("orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),
    },
    example: (props) => (
      <Steps.Root count={3} size={props.size} orientation={props.orientation}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Step 1</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Step 2</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Step 3</Steps.Title>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    ),
  }
);

// --- Step → Steps.Item ---
//
// A single step does not know its position in the list, so index is a
// placeholder for the step's zero-based position.
figma.connect(
  Steps.Item,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=7381-65256",
  {
    props: {
      title: figma.textContent("Step 1"),
      description: figma.boolean("Hint text", {
        true: <Steps.Description>Description</Steps.Description>,
        false: undefined,
      }),
    },
    example: (props) => (
      <Steps.Item index={/* step index */ 0}>
        <Steps.Trigger>
          <Steps.Indicator />
          <Box>
            <Steps.Title>{props.title}</Steps.Title>
            {props.description}
          </Box>
        </Steps.Trigger>
        {/* Omit the separator on the last step */}
        <Steps.Separator />
      </Steps.Item>
    ),
  }
);
