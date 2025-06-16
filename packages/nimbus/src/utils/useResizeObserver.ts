/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * this util is copied from @react-aria/utils because it is not worth bringing in the full library for one method
 */

import { type RefObject, useEffect } from "react";

function hasResizeObserver() {
  return typeof window.ResizeObserver !== "undefined";
}

type useResizeObserverOptionsType<T> = {
  ref: RefObject<T | undefined | null> | undefined;
  box?: ResizeObserverBoxOptions;
  onResize: () => void;
};

export function useResizeObserver<T extends Element>(
  options: useResizeObserverOptionsType<T>
): void {
  const { ref, box, onResize } = options;

  useEffect(() => {
    const element = ref?.current;
    if (!element) {
      return;
    }

    if (!hasResizeObserver()) {
      window.addEventListener("resize", onResize, false);
      return () => {
        window.removeEventListener("resize", onResize, false);
      };
    } else {
      const resizeObserverInstance = new window.ResizeObserver((entries) => {
        if (!entries.length) {
          return;
        }

        onResize();
      });
      resizeObserverInstance.observe(element, { box });

      return () => {
        if (element) {
          resizeObserverInstance.unobserve(element);
        }
      };
    }
  }, [onResize, ref, box]);
}
