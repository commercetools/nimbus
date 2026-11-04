import { describe, expect, it } from "vitest";
import {
  createIconIndex,
  searchIcons,
  splitIconName,
  toWords,
  type SearchableIcon,
} from "./search-icons";

const icon = (
  name: string,
  tags: string[] = [],
  popularity = 0,
  categories: string[] = []
): SearchableIcon => ({ name, tags, categories, popularity });

const names = (icons: SearchableIcon[], query: string) =>
  searchIcons(createIconIndex(icons), query).map((match) => match.name);

describe("splitIconName", () => {
  it("splits camel case into lower-case words", () => {
    expect(splitIconName("ShoppingCartCheckout")).toEqual([
      "shopping",
      "cart",
      "checkout",
    ]);
  });

  it("drops the Svg prefix of names that start with a digit", () => {
    expect(splitIconName("Svg10k")).toEqual(["10", "k"]);
  });

  it("keeps an upper-case run together", () => {
    expect(splitIconName("MoneyOffCSRed")).toEqual([
      "money",
      "off",
      "cs",
      "red",
    ]);
  });
});

describe("toWords", () => {
  it("lower-cases and splits on anything that is not a letter or digit", () => {
    expect(toWords("  Add-User, now ")).toEqual(["add", "user", "now"]);
  });
});

describe("searchIcons", () => {
  const icons = [
    icon("Delete", ["trash", "remove", "bin"], 5000, ["action"]),
    icon("RestoreFromTrash", ["undo"], 10, ["action"]),
    icon("ShoppingCart", ["cart", "store"], 4000, ["action"]),
    icon("CardGiftcard", ["gift", "present"], 300, ["action"]),
    icon("PersonAdd", ["add user", "account"], 2000, ["social"]),
    icon("Groups", ["users", "team"], 1500, ["social"]),
  ];

  it("returns every icon, most used first, for an empty query", () => {
    expect(names(icons, "  ")).toEqual([
      "Delete",
      "ShoppingCart",
      "PersonAdd",
      "Groups",
      "CardGiftcard",
      "RestoreFromTrash",
    ]);
  });

  it("finds icons by keyword tag and names the tag", () => {
    const matches = searchIcons(createIconIndex(icons), "trash");
    expect(matches).toEqual([
      { name: "RestoreFromTrash", matchedTag: null },
      { name: "Delete", matchedTag: "trash" },
    ]);
  });

  it("does not match similar spellings", () => {
    // "cart" must not find CardGiftcard.
    expect(names(icons, "cart")).toEqual(["ShoppingCart"]);
  });

  it("requires every word of the query to match", () => {
    expect(names(icons, "shopping store")).toEqual(["ShoppingCart"]);
    expect(names(icons, "shopping gift")).toEqual([]);
  });

  it("matches the start of a word", () => {
    expect(names(icons, "shop")).toEqual(["ShoppingCart"]);
  });

  it("reports a tag of several words as one match", () => {
    expect(searchIcons(createIconIndex(icons), "add user")[0]).toEqual({
      name: "PersonAdd",
      matchedTag: "add user",
    });
  });

  it("also finds the singular form of a plural word", () => {
    expect(names(icons, "users")).toContain("Groups");
    expect(names(icons, "carts")).toEqual(["ShoppingCart"]);
  });

  it("finds icons by category", () => {
    expect(names(icons, "social")).toEqual(["PersonAdd", "Groups"]);
  });

  it("ranks a name match above a tag match", () => {
    const list = [icon("Store", [], 0), icon("LocalMall", ["store"], 9000)];
    expect(names(list, "store")).toEqual(["Store", "LocalMall"]);
  });

  it("ranks the more used icon first when the points are equal", () => {
    const list = [icon("Bin", ["trash"], 1), icon("Delete", ["trash"], 900)];
    expect(names(list, "trash")).toEqual(["Delete", "Bin"]);
  });
});
