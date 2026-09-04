/** Mock PetSmart product data used across views */

export interface Product {
  id: string;
  name: string;
  key: string;
  productType: string;
  categories: string[];
  status: "published" | "modified" | "unpublished";
  priceRange: string;
  variantCount: number;
  lastModified: string;
  imageUrl?: string;
  // Agent-augmented fields (journey-dependent)
  /** J1: days on hand from PetSmart inventory system */
  daysOnHand?: number;
  /** J1: velocity trend */
  velocityTrend?: "rising" | "flat" | "declining";
  /** J1: margin headroom % */
  marginHeadroom?: number;
  /** J1: whether this SKU is flagged as aging */
  isAging?: boolean;
  /** J2: current margin % */
  currentMargin?: number;
  /** J2: previous margin % (before cost increase) */
  previousMargin?: number;
  /** J2: whether below the 18% margin floor */
  belowFloor?: boolean;
  /** J2: whether this is a house-brand alternative */
  isHouseBrand?: boolean;
  /** J2: house-brand margin comparison */
  houseBrandMargin?: number;
  /** J3: which discount matches this product */
  matchedDiscount?: string;
  /** J3: effective discount % */
  effectiveDiscount?: number;
  /** J3: whether promo badge is set */
  hasBadge?: boolean;
}

// ─── Dog Toys > Outdoor (Journey 1) ─────────────────────────────────────────

export const outdoorDogToys: Product[] = [
  {
    id: "outdoor-fetch-toy",
    name: "ChuckIt! Ultra Ball Launcher",
    key: "chuckit-ultra-launcher",
    productType: "Dog Toys",
    categories: ["Dog Toys", "Outdoor"],
    status: "published",
    priceRange: "$14.99–$24.99",
    variantCount: 3,
    lastModified: "2026-07-15",
    daysOnHand: 89,
    velocityTrend: "declining",
    marginHeadroom: 34,
    isAging: true,
  },
  {
    id: "rope-tug-toy",
    name: "KONG Wubba Dog Toy",
    key: "kong-wubba",
    productType: "Dog Toys",
    categories: ["Dog Toys", "Outdoor"],
    status: "published",
    priceRange: "$9.99–$16.99",
    variantCount: 4,
    lastModified: "2026-06-28",
    daysOnHand: 112,
    velocityTrend: "declining",
    marginHeadroom: 28,
    isAging: true,
  },
  {
    id: "frisbee-flyer",
    name: "Chuckit! Paraflight Flyer",
    key: "chuckit-paraflight",
    productType: "Dog Toys",
    categories: ["Dog Toys", "Outdoor"],
    status: "published",
    priceRange: "$11.99–$15.99",
    variantCount: 2,
    lastModified: "2026-08-01",
    daysOnHand: 74,
    velocityTrend: "flat",
    marginHeadroom: 31,
    isAging: true,
  },
  {
    id: "splash-toy",
    name: "Outward Hound Splash Pad",
    key: "outward-splash-pad",
    productType: "Dog Toys",
    categories: ["Dog Toys", "Outdoor", "Water Toys"],
    status: "published",
    priceRange: "$19.99",
    variantCount: 1,
    lastModified: "2026-05-20",
    daysOnHand: 145,
    velocityTrend: "declining",
    marginHeadroom: 22,
    isAging: true,
  },
  {
    id: "agility-tunnel",
    name: "PetSafe Agility Tunnel",
    key: "petsafe-agility-tunnel",
    productType: "Dog Toys",
    categories: ["Dog Toys", "Outdoor", "Training"],
    status: "published",
    priceRange: "$34.99–$49.99",
    variantCount: 2,
    lastModified: "2026-08-10",
    daysOnHand: 42,
    velocityTrend: "rising",
    marginHeadroom: 38,
    isAging: false,
  },
  {
    id: "tennis-balls-12pk",
    name: "Petco Tennis Ball 12-Pack",
    key: "tennis-balls-12pk",
    productType: "Dog Toys",
    categories: ["Dog Toys", "Outdoor"],
    status: "published",
    priceRange: "$8.99",
    variantCount: 1,
    lastModified: "2026-08-20",
    daysOnHand: 23,
    velocityTrend: "rising",
    marginHeadroom: 45,
    isAging: false,
  },
];

// ─── Hill's Science Diet (Journey 2) ────────────────────────────────────────

export const hillsScienceDiet: Product[] = [
  {
    id: "hills-science-diet-30lb",
    name: "Hill's Science Diet Adult 30lb",
    key: "hills-sd-adult-30lb",
    productType: "Dog Food",
    categories: ["Dog Food", "Premium"],
    status: "published",
    priceRange: "$54.99",
    variantCount: 1,
    lastModified: "2026-08-25",
    currentMargin: 14,
    previousMargin: 22,
    belowFloor: true,
  },
  {
    id: "hills-puppy-15lb",
    name: "Hill's Science Diet Puppy 15lb",
    key: "hills-sd-puppy-15lb",
    productType: "Dog Food",
    categories: ["Dog Food", "Premium", "Puppy"],
    status: "published",
    priceRange: "$38.99",
    variantCount: 1,
    lastModified: "2026-08-25",
    currentMargin: 16,
    previousMargin: 24,
    belowFloor: true,
  },
  {
    id: "hills-senior-30lb",
    name: "Hill's Science Diet Senior 30lb",
    key: "hills-sd-senior-30lb",
    productType: "Dog Food",
    categories: ["Dog Food", "Premium", "Senior"],
    status: "published",
    priceRange: "$56.99",
    variantCount: 1,
    lastModified: "2026-08-25",
    currentMargin: 13,
    previousMargin: 21,
    belowFloor: true,
  },
  {
    id: "hills-small-paws",
    name: "Hill's Science Diet Small Paws 15lb",
    key: "hills-sd-small-paws",
    productType: "Dog Food",
    categories: ["Dog Food", "Premium", "Small Breed"],
    status: "published",
    priceRange: "$36.99",
    variantCount: 1,
    lastModified: "2026-08-25",
    currentMargin: 19,
    previousMargin: 27,
    belowFloor: false,
  },
];

// ─── House-brand alternatives (Journey 2 comparison) ─────────────────────────

export const houseBrandDogFood: Product[] = [
  {
    id: "ps-premium-adult-30lb",
    name: "PetSmart Authority Adult 30lb",
    key: "authority-adult-30lb",
    productType: "Dog Food",
    categories: ["Dog Food", "House Brand"],
    status: "published",
    priceRange: "$32.99",
    variantCount: 1,
    lastModified: "2026-08-10",
    isHouseBrand: true,
    houseBrandMargin: 32,
  },
  {
    id: "ps-premium-puppy-15lb",
    name: "PetSmart Authority Puppy 15lb",
    key: "authority-puppy-15lb",
    productType: "Dog Food",
    categories: ["Dog Food", "House Brand", "Puppy"],
    status: "published",
    priceRange: "$24.99",
    variantCount: 1,
    lastModified: "2026-08-10",
    isHouseBrand: true,
    houseBrandMargin: 35,
  },
];

// ─── Back to School campaign products (Journey 3) ───────────────────────────

export const backToSchoolProducts: Product[] = [
  {
    id: "nylon-collar-sm",
    name: "Top Paw Nylon Collar - Small",
    key: "top-paw-collar-sm",
    productType: "Collars & Leashes",
    categories: ["Dog Supplies", "Collars & Leashes"],
    status: "published",
    priceRange: "$7.99–$12.99",
    variantCount: 5,
    lastModified: "2026-08-28",
    matchedDiscount: "Collars 10%",
    effectiveDiscount: 10,
    hasBadge: true,
  },
  {
    id: "nylon-leash-medium",
    name: "Top Paw Nylon Leash - Medium",
    key: "top-paw-leash-md",
    productType: "Collars & Leashes",
    categories: ["Dog Supplies", "Collars & Leashes"],
    status: "published",
    priceRange: "$9.99–$14.99",
    variantCount: 3,
    lastModified: "2026-08-28",
    matchedDiscount: "Leashes 15%",
    effectiveDiscount: 15,
    hasBadge: false,
  },
  {
    id: "retractable-leash",
    name: "Flexi Classic Retractable Leash",
    key: "flexi-retractable",
    productType: "Collars & Leashes",
    categories: ["Dog Supplies", "Collars & Leashes"],
    status: "published",
    priceRange: "$14.99–$24.99",
    variantCount: 4,
    lastModified: "2026-08-28",
    matchedDiscount: "Leashes 15%",
    effectiveDiscount: 15,
    hasBadge: false,
  },
  {
    id: "wire-crate-medium",
    name: "Top Paw Wire Crate - Medium",
    key: "top-paw-crate-md",
    productType: "Crates & Carriers",
    categories: ["Dog Supplies", "Crates"],
    status: "published",
    priceRange: "$49.99–$79.99",
    variantCount: 3,
    lastModified: "2026-08-28",
    matchedDiscount: "Crates 20%",
    effectiveDiscount: 20,
    hasBadge: true,
  },
  {
    id: "soft-crate-large",
    name: "Top Paw Soft-Sided Crate - Large",
    key: "top-paw-soft-crate-lg",
    productType: "Crates & Carriers",
    categories: ["Dog Supplies", "Crates"],
    status: "published",
    priceRange: "$64.99",
    variantCount: 1,
    lastModified: "2026-08-28",
    matchedDiscount: "Crates 20%",
    effectiveDiscount: 20,
    hasBadge: true,
  },
];

/** Returns the correct product set based on the active journey */
export function getProductsForJourney(
  journeyId: number | null,
  filter?: string
): Product[] {
  if (journeyId === 1) return outdoorDogToys;
  if (journeyId === 2) {
    if (filter === "house-brand") return houseBrandDogFood;
    return hillsScienceDiet;
  }
  if (journeyId === 3) return backToSchoolProducts;
  // Default: show outdoor dog toys
  return outdoorDogToys;
}
