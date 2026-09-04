export interface Persona {
  id: string;
  name: string;
  role: string;
  /** Path to a realistic photo avatar in public/avatars/ */
  avatarUrl: string;
  description: string;
  journeyIds: number[];
}

/**
 * Persona avatars live in public/avatars/.
 * The Nimbus Avatar component uses `src` to render them.
 * The active persona's avatar is shown in the app bar.
 */
export const personas: Record<string, Persona> = {
  dana: {
    id: "dana",
    name: "Dana",
    role: "Merchandiser",
    avatarUrl: "/avatars/dana.svg",
    description:
      "Hands-on merchandiser who builds promotions and works with inventory day to day.",
    journeyIds: [1, 3],
  },
  carlos: {
    id: "carlos",
    name: "Carlos",
    role: "Category Manager",
    avatarUrl: "/avatars/carlos.svg",
    description:
      "Owns the category P&L and builds recommendations for stakeholders.",
    journeyIds: [2],
  },
  priya: {
    id: "priya",
    name: "Priya",
    role: "Merchandising Manager",
    avatarUrl: "/avatars/priya.svg",
    description:
      "Manages the merchandising team and reviews campaign performance.",
    journeyIds: [4],
  },
};

export const personaList = Object.values(personas);
