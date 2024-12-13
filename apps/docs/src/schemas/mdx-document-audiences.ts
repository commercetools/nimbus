export const mdxDocumentAudiences = [
  "Developer",
  "Designer",
  "Maintainer",
  "ProductManager",
] as const;

export type DocumentAudience = (typeof mdxDocumentAudiences)[number];

type DocumentAudienceDescription = {
  [K in DocumentAudience]: {
    label: string;
    description: string;
    order: number;
  };
};

export const documentAudienceDescriptions: DocumentAudienceDescription = {
  Developer: {
    label: "Developer",
    description:
      "Developers who implement and use the design system components.",
    order: 1,
  },
  Designer: {
    label: "Designer",
    description:
      "Designers who use the design system to design product features.",
    order: 2,
  },
  Maintainer: {
    label: "Maintainer",
    description: "Developers and designers maintaining the design system.",
    order: 3,
  },
  ProductManager: {
    label: "Product Manager",
    description: "Product managers overseeing product development.",
    order: 4,
  },
};
