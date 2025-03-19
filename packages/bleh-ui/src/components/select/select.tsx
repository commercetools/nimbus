import { SelectRoot as _SelectRoot } from "./components/select.root";
import { SelectOptions as _SelectOptions } from "./components/select.options";
import { SelectOption as _SelectOption } from "./components/select.option";
import { SelectOptionGroup as _SelectOptionGroup } from "./components/select.option-group";

export const Select = {
  Root: _SelectRoot,
  Options: _SelectOptions,
  Option: _SelectOption,
  OptionGroup: _SelectOptionGroup,
};

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export { _SelectRoot, _SelectOptions, _SelectOption, _SelectOptionGroup };
