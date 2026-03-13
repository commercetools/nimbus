import figma from "@figma/code-connect/react";
import { Switch } from "./switch";

figma.connect(
  Switch,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=253-1276",
  {
    props: {
      isSelected: figma.enum("Toggled", { YES: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
      }),
    },
    example: (props) => (
      <Switch
        isSelected={props.isSelected}
        isDisabled={props.isDisabled}
        size={props.size}
      >
        Label
      </Switch>
    ),
  }
);
