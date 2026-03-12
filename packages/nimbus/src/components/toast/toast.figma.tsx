import figma from "@figma/code-connect/react";
import { ToastOutlet } from "./toast";

// Toast is invoked via toast.create(), not as a JSX component.
// This connects the Figma component to ToastOutlet for Dev Mode reference.
figma.connect(
  ToastOutlet,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    props: {
      variant: figma.enum("Variant", {
        Success: "success",
        Error: "error",
        Info: "info",
        Warning: "warning",
      }),
    },
    example: (props) => <ToastOutlet variant={props.variant} />,
  }
);
