import figma from "@figma/code-connect/react";
import { ToastOutlet } from "./components/toast.outlet";

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

// --- Variant-specific: Success toast ---
figma.connect(
  ToastOutlet,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    variant: { Variant: "Success" },
    example: () => (
      // Usage: toast.create({ title: "Success", variant: "success" })
      <ToastOutlet variant="success" />
    ),
  }
);

// --- Variant-specific: Error toast ---
figma.connect(
  ToastOutlet,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    variant: { Variant: "Error" },
    example: () => (
      // Usage: toast.create({ title: "Error", variant: "error" })
      <ToastOutlet variant="error" />
    ),
  }
);

// --- Variant-specific: Warning toast ---
figma.connect(
  ToastOutlet,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    variant: { Variant: "Warning" },
    example: () => (
      // Usage: toast.create({ title: "Warning", variant: "warning" })
      <ToastOutlet variant="warning" />
    ),
  }
);

// --- Variant-specific: Info toast ---
figma.connect(
  ToastOutlet,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    variant: { Variant: "Info" },
    example: () => (
      // Usage: toast.create({ title: "Info", variant: "info" })
      <ToastOutlet variant="info" />
    ),
  }
);
