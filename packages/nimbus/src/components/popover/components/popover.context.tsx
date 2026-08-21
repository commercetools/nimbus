import { createContext, useContext } from "react";

import type { PopoverConfigContextValue } from "../popover.types";

/**
 * Carries the overlay configuration from `Popover.Root` to `Popover.Content`.
 *
 * The elements those props configure are rendered by `Popover.Content` through
 * a portal, so they cannot be handed down the tree. The value type excludes
 * `DialogTrigger`'s open-state props by construction — see `Popover.Root` for
 * why they must not reach the overlay.
 */
const PopoverConfigContext = createContext<
  PopoverConfigContextValue | undefined
>(undefined);

export const PopoverConfigProvider = PopoverConfigContext.Provider;

/**
 * Reads the configuration published by `Popover.Root`. `undefined` without a
 * Root above, which keeps a bare `Popover.Content` working.
 */
export const usePopoverConfigContext = () => useContext(PopoverConfigContext);
