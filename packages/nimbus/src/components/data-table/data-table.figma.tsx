import figma from "@figma/code-connect/react";
import { DataTable } from "./data-table";

// NOTE: Skipped VARIANT "Content type" [Primary text, Primary + secondary text, Default text, Default text + sublabel, Secondary text, No value fallback, Badge, Checkbox, Active icon, Input, Toggle, Custom content, Action buttons, Link, Button, Tag group, Dragable button, Checkbox with expandable] → no matching code prop "contentType"
figma.connect(
  DataTable,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6041-28672",
  {
    props: {
      children: figma.string("Text"),
    },
    example: () => <DataTable columns={[]} rows={[]} />,
  }
);
