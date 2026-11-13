import { describe, expect, it } from "vitest";
import { measureCollapsedHeaderHeight } from "./measure-collapsed-header-height";

describe("measureCollapsedHeaderHeight", () => {
  it("does not move content when measuring on a short page scrolled to the bottom", () => {
    const root = document.createElement("div");
    const header = document.createElement("header");
    const content = document.createElement("main");
    header.style.height = "120px";
    content.style.height = "80px";
    content.style.overflow = "auto";
    const inner = document.createElement("div");
    inner.style.height = "200px";
    content.append(inner);
    root.append(header, content);
    document.body.append(root);

    content.scrollTop = content.scrollHeight;
    const scrollTopBefore = content.scrollTop;

    const height = measureCollapsedHeaderHeight(header, root);

    expect(content.scrollTop).toBe(scrollTopBefore);
    expect(root.contains(document.querySelector("[inert]"))).toBe(false);
    expect(Number.isFinite(height)).toBe(true);

    root.remove();
  });

  it("reads the clone after setting data-collapsed and removes it", () => {
    const root = document.createElement("div");
    const header = document.createElement("header");
    header.append(document.createTextNode("Title"));
    root.append(header);
    document.body.append(root);

    measureCollapsedHeaderHeight(header, root);

    expect(root.querySelector("[data-collapsed]")).toBeNull();
    expect(header.hasAttribute("data-collapsed")).toBe(false);

    root.remove();
  });
});
