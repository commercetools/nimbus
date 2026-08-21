import { createContext, useContext } from "react";

import type { PopoverConfigContextValue } from "../popover.types";

/**
 * Carries the overlay configuration from `Popover.Root` to `Popover.Content`.
 *
 * `Popover.Root` renders React Aria's `DialogTrigger`, which mounts no DOM
 * element, while the `Popover` and `Dialog` elements those props configure are
 * rendered by `Popover.Content` — and rendered through a portal, so props cannot
 * simply be handed down the tree. Context is what bridges the two.
 *
 * The value type is `PopoverRootProps` minus `DialogTrigger`'s own props, so the
 * open-state props cannot reach the overlay through here. That matters: React
 * Aria's `Popover` derives its own state as soon as `isOpen` or `defaultOpen` is
 * set on it, which would desynchronise the surface from its trigger.
 */
const PopoverConfigContext = createContext<
  PopoverConfigContextValue | undefined
>(undefined);

export const PopoverConfigProvider = PopoverConfigContext.Provider;

/**
 * Reads the configuration published by `Popover.Root`.
 *
 * Returns `undefined` when there is no `Popover.Root` above — `Popover.Content`
 * treats that as "nothing configured" and falls back to its own props, so a
 * bare `Popover.Content` keeps working.
 */
export const usePopoverConfigContext = () => useContext(PopoverConfigContext);
