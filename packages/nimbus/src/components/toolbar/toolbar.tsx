import { ToolbarRoot } from "./components/toolbar.root";
import { ToolbarGroup } from "./components/toolbar.group";
import { ToolbarToggleButtonGroup } from "./components/toolbar.toggle-button-group";
import { ToolbarSeparator } from "./components/toolbar.separator";

export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  ToggleButtonGroup: ToolbarToggleButtonGroup,
  Separator: ToolbarSeparator,
};

// Exports for internal use by react-docgen
export {
  ToolbarRoot as _ToolbarRoot,
  ToolbarGroup as _ToolbarGroup,
  ToolbarSeparator as _ToolbarSeparator,
  ToolbarToggleButtonGroup as _ToolbarToggleButtonGroup,
};
