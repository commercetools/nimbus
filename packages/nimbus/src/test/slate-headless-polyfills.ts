/**
 * Minimal polyfills for Slate.js testing in headless browsers
 *
 * Only adds the essential missing APIs without interfering with Slate internals
 */

// Ensure we're in a browser environment
if (typeof window !== "undefined") {
  // 1. InputEvent constructor - minimal implementation
  if (!window.InputEvent) {
    (window as any).InputEvent = class InputEvent extends Event {
      inputType: string;
      data: string | null;

      constructor(type: string, eventInitDict: any = {}) {
        super(type, eventInitDict);
        this.inputType = eventInitDict.inputType || "insertText";
        this.data = eventInitDict.data || null;
      }
    };
  }

  // 2. Clipboard API - minimal implementation
  if (typeof navigator !== "undefined" && !navigator.clipboard) {
    (navigator as any).clipboard = {
      writeText: async () => Promise.resolve(),
      readText: async () => Promise.resolve(""),
    };
  }

  // 3. Ensure DataTransfer exists
  if (!window.DataTransfer) {
    (window as any).DataTransfer = class DataTransfer {
      private items: Map<string, string> = new Map();

      getData(format: string): string {
        return this.items.get(format) || "";
      }

      setData(format: string, data: string): void {
        this.items.set(format, data);
      }
    };
  }

  console.log("Minimal Slate.js polyfills loaded");
}
