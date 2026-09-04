/** Mock discount data for discount list and detail views */

export interface Discount {
  id: string;
  name: string;
  key: string;
  type: "cart" | "product" | "code";
  typeLabel: string;
  value: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  sortOrder: number;
  requiresCode: boolean;
  stores: string[];
  // J4 augmentations
  /** Redemption rate % */
  redemptionRate?: number;
  /** Redemption target % */
  redemptionTarget?: number;
  /** Performance status */
  performanceStatus?: "on-target" | "above-target" | "underperforming";
}

export const backToSchoolDiscounts: Discount[] = [
  {
    id: "back-to-school-collars",
    name: "Back to School Pet Prep — Collars",
    key: "bts-collars-10",
    type: "cart",
    typeLabel: "Relative %",
    value: "10% off",
    isActive: true,
    validFrom: "2026-08-15",
    validUntil: "2026-09-15",
    sortOrder: 1,
    requiresCode: false,
    stores: ["All US stores"],
    redemptionRate: 14,
    redemptionTarget: 15,
    performanceStatus: "on-target",
  },
  {
    id: "back-to-school-leashes",
    name: "Back to School Pet Prep — Leashes",
    key: "bts-leashes-15",
    type: "cart",
    typeLabel: "Relative %",
    value: "15% off",
    isActive: true,
    validFrom: "2026-08-15",
    validUntil: "2026-09-15",
    sortOrder: 2,
    requiresCode: false,
    stores: ["All US stores"],
    redemptionRate: 3,
    redemptionTarget: 15,
    performanceStatus: "underperforming",
  },
  {
    id: "back-to-school-crates",
    name: "Back to School Pet Prep — Crates",
    key: "bts-crates-20",
    type: "cart",
    typeLabel: "Relative %",
    value: "20% off",
    isActive: true,
    validFrom: "2026-08-15",
    validUntil: "2026-09-15",
    sortOrder: 3,
    requiresCode: false,
    stores: ["All US stores"],
    redemptionRate: 17,
    redemptionTarget: 15,
    performanceStatus: "above-target",
  },
];

export const otherDiscounts: Discount[] = [
  {
    id: "loyalty-10",
    name: "Loyalty Paw Points — 10%",
    key: "loyalty-paw-points-10",
    type: "code",
    typeLabel: "Relative %",
    value: "10% off",
    isActive: true,
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    sortOrder: 10,
    requiresCode: true,
    stores: ["All US stores"],
  },
  {
    id: "summer-clearance",
    name: "Summer Clearance 2026",
    key: "summer-clearance-2026",
    type: "cart",
    typeLabel: "Relative %",
    value: "25% off",
    isActive: false,
    validFrom: "2026-06-01",
    validUntil: "2026-08-31",
    sortOrder: 5,
    requiresCode: false,
    stores: ["Online"],
  },
];

export const allDiscounts = [...backToSchoolDiscounts, ...otherDiscounts];
