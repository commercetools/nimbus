import { z } from "zod";

export const mdxDocumentAudiences = [
  "Developer",
  "Designer",
  "Maintainer",
  "ProductManager",
] as const;

export type DocumentAudience = (typeof mdxDocumentAudiences)[number];

// Define the Zod schema for document audiences
export const documentAudienceSchema = z.enum(mdxDocumentAudiences);

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

// Define a schema for the audience description object
export const documentAudienceDescriptionSchema = z.object({
  label: z.string().nonempty(),
  description: z.string().nonempty(),
  order: z.number().int().positive(),
});

export type AudienceDescription = z.infer<
  typeof documentAudienceDescriptionSchema
>;

// Complete document audience schema with metadata
export const documentAudienceWithMetadataSchema = z.object({
  audience: documentAudienceSchema,
  metadata: documentAudienceDescriptionSchema,
});

export type DocumentAudienceWithMetadata = z.infer<
  typeof documentAudienceWithMetadataSchema
>;
