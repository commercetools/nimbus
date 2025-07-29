import { ToolbarRoot } from "./components/toolbar.root";
import { ToolbarGroup } from "./components/toolbar.group";
import { ToolbarSeparator } from "./components/toolbar.separator";

export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
};

// Exports for internal use by react-docgen
export {
  ToolbarRoot as _ToolbarRoot,
  ToolbarGroup as _ToolbarGroup,
  ToolbarSeparator as _ToolbarSeparator,
};
