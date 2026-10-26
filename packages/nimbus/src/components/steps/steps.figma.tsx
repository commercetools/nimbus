import figma from "@figma/code-connect/react";
import { Steps } from "./steps";

// --- Steps → Steps.Root ---
//
// Only the "Step" instances become children. The "Separator" instances between
// them are drawn by Steps.Separator inside each Steps.Item instead.
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
      children: figma.children("Step"),
    },
    example: (props) => (
      <Steps.Root count={0} size={props.size} orientation={props.orientation}>
        <Steps.List>{props.children}</Steps.List>
      </Steps.Root>
    ),
  }
);

// --- Step → Steps.Item ---
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
      <Steps.Item index={0}>
        <Steps.Trigger>
          <Steps.Indicator />
          <Steps.Title>{props.title}</Steps.Title>
          {props.description}
        </Steps.Trigger>
        {/* Omit the separator on the last step */}
        <Steps.Separator />
      </Steps.Item>
    ),
  }
);
