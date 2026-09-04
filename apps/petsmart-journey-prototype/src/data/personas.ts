export interface Persona {
  id: string;
  name: string;
  role: string;
  /** URL to a realistic photo avatar */
  avatarUrl: string;
  description: string;
  journeyIds: number[];
}

/**
 * Persona avatars are real photos in public/avatars/.
 * The active persona's avatar is shown in the app bar and journey cards.
 */
const base = import.meta.env.BASE_URL;

export const personas: Record<string, Persona> = {
  dana: {
    id: "dana",
    name: "Dana",
    role: "Merchandiser",
    avatarUrl: `${base}avatars/dana.jpg`,
    description:
      "Hands-on merchandiser who builds promotions and works with inventory day to day.",
    journeyIds: [1, 3],
  },
  carlos: {
    id: "carlos",
    name: "Carlos",
    role: "Category Manager",
    avatarUrl: `${base}avatars/carlos.jpg`,
    description:
      "Owns the category P&L and builds recommendations for stakeholders.",
    journeyIds: [2],
  },
  priya: {
    id: "priya",
    name: "Priya",
    role: "Merchandising Manager",
    avatarUrl: `${base}avatars/priya.jpg`,
    description:
      "Manages the merchandising team and reviews campaign performance.",
    journeyIds: [4],
  },
};

export const personaList = Object.values(personas);
