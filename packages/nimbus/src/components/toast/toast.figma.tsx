import figma from "@figma/code-connect/react";
import { ToastOutlet } from "./components/toast.outlet";

// Toast is invoked via toast.create(), not as a JSX component.
// This connects the Figma component to ToastOutlet for Dev Mode reference.
figma.connect(
  ToastOutlet,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    example: () => (
      // Variant is set per-toast at creation time:
      // toast.create({ title: "Done", variant: "success" })
      <ToastOutlet />
    ),
  }
);
