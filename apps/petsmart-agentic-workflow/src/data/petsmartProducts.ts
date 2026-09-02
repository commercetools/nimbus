export interface PetSmartProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  priceNum: number;
  category: string;
  shelfDays: number;
  velocity: string; // e.g. "-34% vs category"
  units: number;
  isSlow: boolean;
}

export const slowMovers: PetSmartProduct[] = [
  { id: "p1", name: "Advanced Flea & Tick Treatment (Dogs 21-55 lbs)", sku: "PS-FT-2155", price: "$29.99", priceNum: 29.99, category: "Pet Health", shelfDays: 87, velocity: "-34%", units: 42, isSlow: true },
  { id: "p2", name: "Greenies Dental Chews for Dogs (Large, 27 ct)", sku: "PS-DC-LG27", price: "$24.99", priceNum: 24.99, category: "Pet Health", shelfDays: 74, velocity: "-21%", units: 156, isSlow: true },
  { id: "p3", name: "VetriScience Pet Multivitamin (90 chews)", sku: "PS-VM-90", price: "$18.99", priceNum: 18.99, category: "Pet Health", shelfDays: 91, velocity: "-45%", units: 28, isSlow: true },
  { id: "p4", name: "Furminator deShedding Supplement (32 oz)", sku: "PS-FS-32", price: "$14.99", priceNum: 14.99, category: "Pet Health", shelfDays: 68, velocity: "-18%", units: 203, isSlow: true },
  { id: "p5", name: "Zesty Paws Calming Bites (90 ct)", sku: "PS-CB-90", price: "$25.99", priceNum: 25.99, category: "Pet Health", shelfDays: 82, velocity: "-29%", units: 67, isSlow: true },
  { id: "p6", name: "NaturVet Digestive Enzymes (70 soft chews)", sku: "PS-DE-70", price: "$16.99", priceNum: 16.99, category: "Pet Health", shelfDays: 95, velocity: "-52%", units: 31, isSlow: true },
];

export const bundleAccessories: PetSmartProduct[] = [
  { id: "a1", name: "KONG Classic Dog Toy (Large)", sku: "PS-KC-LG", price: "$13.99", priceNum: 13.99, category: "Accessories", shelfDays: 12, velocity: "+14%", units: 892, isSlow: false },
  { id: "a2", name: "Milk-Bone MaroSnacks (40 oz)", sku: "PS-MB-40", price: "$8.99", priceNum: 8.99, category: "Treats", shelfDays: 8, velocity: "+22%", units: 1204, isSlow: false },
  { id: "a3", name: "PetSmart Essentials Dog Collar (Large)", sku: "PS-EC-LG", price: "$9.99", priceNum: 9.99, category: "Accessories", shelfDays: 15, velocity: "+8%", units: 567, isSlow: false },
];
