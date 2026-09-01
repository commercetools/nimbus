/* -------------------------------------------------------------------------- */
/* Sidebar navigation model.                                                  */
/* One source of truth for routes, labels, icons, and grouping — consumed by  */
/* both the Sidebar and the router in app.tsx.                                */
/* -------------------------------------------------------------------------- */

import {
  Dashboard,
  TrendingUp,
  Inventory2,
  Groups,
  Campaign,
  LocalShipping,
  AccountBalance,
} from "@commercetools/nimbus-icons";
import type { ComponentType } from "react";

export interface NavItem {
  path: string;
  label: string;
  /** Short label for the top-bar breadcrumb / page title. */
  title: string;
  icon: ComponentType;
  /** One-line description shown under the page title. */
  blurb: string;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    heading: "Store",
    items: [
      {
        path: "/",
        label: "Overview",
        title: "Store overview",
        icon: Dashboard,
        blurb: "The whole business at a glance — trailing 12 months.",
      },
      {
        path: "/sales",
        label: "Sales & revenue",
        title: "Sales & revenue",
        icon: TrendingUp,
        blurb: "Where revenue comes from, and how it's moving.",
      },
      {
        path: "/products",
        label: "Products & inventory",
        title: "Products & inventory",
        icon: Inventory2,
        blurb: "Catalog performance, the 80/20, and what's in stock.",
      },
    ],
  },
  {
    heading: "Growth",
    items: [
      {
        path: "/customers",
        label: "Customers & retention",
        title: "Customers & retention",
        icon: Groups,
        blurb: "Who's coming back, who's worth the most, and who's slipping.",
      },
      {
        path: "/marketing",
        label: "Marketing & channels",
        title: "Marketing & channels",
        icon: Campaign,
        blurb: "Acquisition funnel, channel mix, and campaign returns.",
      },
    ],
  },
  {
    heading: "Back office",
    items: [
      {
        path: "/operations",
        label: "Operations & fulfillment",
        title: "Operations & fulfillment",
        icon: LocalShipping,
        blurb: "Fulfillment throughput, delivery SLAs, and returns.",
      },
      {
        path: "/finance",
        label: "Finance",
        title: "Finance",
        icon: AccountBalance,
        blurb: "P&L, margin, cashflow, and budget vs. actual.",
      },
    ],
  },
];

/** Flat lookup of every nav item by path (for breadcrumb / page header). */
export const NAV_BY_PATH: Record<string, NavItem> = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((item) => [item.path, item])
);
