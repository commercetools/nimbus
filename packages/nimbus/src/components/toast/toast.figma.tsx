import figma from "@figma/code-connect/react";
import { toast } from "./services/toast.manager";

// --- Toast is an imperative API, not a JSX component ---
figma.connect(
  "toast",
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3512-13119",
  {
    props: {
      type: figma.enum("Tone", {
        Neutral: "info",
        Warning: "warning",
        Error: "error",
        Info: "info",
        Success: "success",
      }),
      title: figma.string("Title text"),
      description: figma.string("Description text"),
    },
    example: (props) =>
      toast({
        type: props.type,
        title: props.title,
        description: props.description,
      }),
  }
);
