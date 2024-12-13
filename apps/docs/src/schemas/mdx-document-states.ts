import z from "zod";
export const mdxDocumentStates = [
  "InitialDraft",
  "ReviewedInternal",
  "Revised",
  "PeerReviewed",
  "Approved",
  "EditedForStyle",
  "FinalDraft",
  "Published",
  "Archived",
] as const;

export type DocumentState = (typeof mdxDocumentStates)[number];

type DocumentStateDescription = {
  [K in DocumentState]: {
    label: string;
    description: string;
    order: number;
  };
};

export const documentStateDescriptions: DocumentStateDescription = {
  InitialDraft: {
    label: "Initial Draft",
    description:
      "The document is in its initial creation phase, containing raw ideas and incomplete sections.",
    order: 1,
  },
  ReviewedInternal: {
    label: "Reviewed Internal",
    description:
      "The document has been reviewed internally by the team for basic structure and content.",
    order: 2,
  },
  Revised: {
    label: "Revised",
    description:
      "Feedback has been incorporated, and the document is updated for clarity and accuracy.",
    order: 3,
  },
  PeerReviewed: {
    label: "Peer Reviewed",
    description:
      "The document has undergone peer review by colleagues or subject matter experts.",
    order: 4,
  },
  Approved: {
    label: "Approved",
    description:
      "The document has been formally approved for further processing or publishing.",
    order: 5,
  },
  EditedForStyle: {
    label: "Edited For Style",
    description:
      "The document is edited for tone, style, and consistency with guidelines.",
    order: 6,
  },
  FinalDraft: {
    label: "Final Draft",
    description: "The document is complete and ready for public release.",
    order: 7,
  },
  Published: {
    label: "Published",
    description: "The document is publicly available and in use.",
    order: 8,
  },
  Archived: {
    label: "Archived",
    description:
      "The document is no longer in active use and has been archived for reference.",
    order: 9,
  },
};
