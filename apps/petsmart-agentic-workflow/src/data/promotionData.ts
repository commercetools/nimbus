export const promotion = {
  name: "Spring Pet Wellness 2026",
  type: "Buy 2 Get 1 Free",
  startDate: "March 1, 2026",
  endDate: "April 15, 2026",
  targetCategory: "Pet Health",
  productsAffected: 340,
  marginImpact: "-4.1%",
  conflictDiscount: "Loyalty Paw Points 10%",
  conflictProducts: 67,
  lowStockProducts: 28,
};

export const simulationCarts = [
  {
    id: "cart-a",
    label: "Cart A: Happy Path",
    items: [
      { name: "Flea & Tick Treatment", qty: 2, unitPrice: 29.99, total: 59.98 },
      { name: "Dental Chews (Large)", qty: 1, unitPrice: 24.99, total: 0 },
    ],
    discountApplied: "Buy 2 Get 1 Free",
    savings: 24.99,
    cartTotal: 59.98,
    margin: "22%",
    status: "ok" as const,
  },
  {
    id: "cart-b",
    label: "Cart B: Below Minimum",
    items: [
      { name: "Flea & Tick Treatment", qty: 1, unitPrice: 29.99, total: 29.99 },
      { name: "Pet Multivitamin", qty: 1, unitPrice: 18.99, total: 18.99 },
    ],
    discountApplied: "None (minimum not met)",
    savings: 0,
    cartTotal: 48.98,
    margin: "31%",
    status: "ok" as const,
  },
  {
    id: "cart-c",
    label: "Cart C: Stacking Violation",
    items: [
      { name: "Dental Chews (Large)", qty: 3, unitPrice: 24.99, total: 49.98 },
    ],
    discountApplied: "Buy 2 Get 1 Free + Loyalty 10%",
    savings: 29.99,
    cartTotal: 44.98,
    margin: "11%",
    status: "warning" as const,
    warning: "Stacking with Loyalty Paw Points drops margin below 15% floor",
  },
];

export const performanceMetrics = {
  ct: {
    orders: 4287,
    revenue: 312400,
    avgOrderValue: 72.88,
    codeUsageRate: "34%",
  },
  petsmart: {
    dailyOrders: [
      { date: "Mar 1", orders: 45 }, { date: "Mar 8", orders: 89 }, { date: "Mar 15", orders: 134 },
      { date: "Mar 22", orders: 156 }, { date: "Mar 29", orders: 142 }, { date: "Apr 5", orders: 128 },
      { date: "Apr 12", orders: 97 },
    ],
    inStorePickupUplift: "+12%",
    onlineToStoreConversion: "8.3%",
    haloEffect: "+7%",
    slowMoversClearedCount: 18,
    slowMoversClearedTotal: 23,
    overstockBefore: 47200,
    overstockAfter: 8200,
    avgDaysToClearBefore: 87,
    avgDaysToClearAfter: 34,
  },
};
