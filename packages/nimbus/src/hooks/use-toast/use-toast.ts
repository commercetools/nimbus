"use client";

import { useCallback } from "react";
import { toaster } from "./toaster";
import type { CreateToastOptions } from "@chakra-ui/react";

/**
 * Options for creating a toast notification.
 */
export type UseToastOptions = Omit<CreateToastOptions, "id"> & {
  /**
   * The title of the toast notification.
   */
  title?: string;
  /**
   * The description text of the toast notification.
   */
  description?: string;
  /**
   * The status/type of the toast notification.
   * @default "info"
   */
  type?: "success" | "error" | "warning" | "info" | "loading";
  /**
   * Duration in milliseconds before the toast closes automatically.
   * Set to `null` to keep it open indefinitely.
   * @default 5000
   */
  duration?: number | null;
};

/**
 * Return type of the useToast hook.
 */
export type UseToastReturn = {
  /**
   * Shows a toast notification with the given options.
   *
   * @param options - Toast configuration options
   * @returns The ID of the created toast
   *
   * @example
   * ```tsx
   * const toast = useToast();
   *
   * toast({
   *   title: "Success!",
   *   description: "Your changes have been saved.",
   *   type: "success",
   * });
   * ```
   */
  (options: UseToastOptions): string;

  /**
   * Shows a success toast notification.
   *
   * @param options - Toast configuration options
   * @returns The ID of the created toast
   */
  success: (options: Omit<UseToastOptions, "type">) => string;

  /**
   * Shows an error toast notification.
   *
   * @param options - Toast configuration options
   * @returns The ID of the created toast
   */
  error: (options: Omit<UseToastOptions, "type">) => string;

  /**
   * Shows a warning toast notification.
   *
   * @param options - Toast configuration options
   * @returns The ID of the created toast
   */
  warning: (options: Omit<UseToastOptions, "type">) => string;

  /**
   * Shows an info toast notification.
   *
   * @param options - Toast configuration options
   * @returns The ID of the created toast
   */
  info: (options: Omit<UseToastOptions, "type">) => string;

  /**
   * Shows a loading toast notification.
   *
   * @param options - Toast configuration options
   * @returns The ID of the created toast
   */
  loading: (options: Omit<UseToastOptions, "type">) => string;

  /**
   * Closes a specific toast by ID.
   *
   * @param id - The ID of the toast to close
   */
  close: (id: string) => void;

  /**
   * Closes all open toasts.
   */
  closeAll: () => void;
};

/**
 * Hook for creating and managing toast notifications.
 *
 * This hook provides a simple API for showing toast notifications with different types
 * (success, error, warning, info, loading). It wraps Chakra UI v3's toaster API.
 *
 * **Important:** You must render the `<Toaster />` component somewhere in your app
 * (typically in your root component) for toasts to display.
 *
 * @returns An object with methods to create and manage toast notifications
 *
 * @example
 * ```tsx
 * import { useToast, Toaster } from '@commercetools/nimbus';
 *
 * // In your root component
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * // In your component
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleClick = () => {
 *     toast({
 *       title: "Success!",
 *       description: "Your changes have been saved.",
 *       type: "success",
 *       duration: 5000,
 *     });
 *
 *     // Or use convenience methods
 *     toast.success({ title: "Saved!" });
 *     toast.error({ title: "Failed to save" });
 *   };
 *
 *   return <button onClick={handleClick}>Save</button>;
 * }
 * ```
 */
export function useToast(): UseToastReturn {
  const createToast = useCallback((options: UseToastOptions) => {
    const {
      title,
      description,
      type = "info",
      duration = 5000,
      ...rest
    } = options;

    return toaster.create({
      title,
      description,
      type,
      duration: duration === null ? undefined : duration,
      ...rest,
    });
  }, []);

  const success = useCallback(
    (options: Omit<UseToastOptions, "type">) =>
      createToast({ ...options, type: "success" }),
    [createToast]
  );

  const error = useCallback(
    (options: Omit<UseToastOptions, "type">) =>
      createToast({ ...options, type: "error" }),
    [createToast]
  );

  const warning = useCallback(
    (options: Omit<UseToastOptions, "type">) =>
      createToast({ ...options, type: "warning" }),
    [createToast]
  );

  const info = useCallback(
    (options: Omit<UseToastOptions, "type">) =>
      createToast({ ...options, type: "info" }),
    [createToast]
  );

  const loading = useCallback(
    (options: Omit<UseToastOptions, "type">) =>
      createToast({ ...options, type: "loading" }),
    [createToast]
  );

  const close = useCallback((id: string) => {
    toaster.dismiss(id);
  }, []);

  const closeAll = useCallback(() => {
    toaster.dismissAll();
  }, []);

  const toast = Object.assign(createToast, {
    success,
    error,
    warning,
    info,
    loading,
    close,
    closeAll,
  });

  return toast;
}
