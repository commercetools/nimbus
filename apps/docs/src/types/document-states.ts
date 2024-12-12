export type DocumentState =
  | "InitialDraft"
  | "ReviewedInternal"
  | "Revised"
  | "PeerReviewed"
  | "Approved"
  | "EditedForStyle"
  | "FinalDraft"
  | "Published"
  | "Archived";

type DocumentStateDescription = {
  [K in DocumentState]: {
    label: string;
    description: string;
  };
};

export const documentStateDescriptions: DocumentStateDescription = {
  InitialDraft: {
    label: "Initial Draft",
    description:
      "The document is in its initial creation phase, containing raw ideas and incomplete sections.",
  },
  ReviewedInternal: {
    label: "Reviewed Internal",
    description:
      "The document has been reviewed internally by the team for basic structure and content.",
  },
  Revised: {
    label: "Revised",
    description:
      "Feedback has been incorporated, and the document is updated for clarity and accuracy.",
  },
  PeerReviewed: {
    label: "Peer Reviewed",
    description:
      "The document has undergone peer review by colleagues or subject matter experts.",
  },
  Approved: {
    label: "Approved",
    description:
      "The document has been formally approved for further processing or publishing.",
  },
  EditedForStyle: {
    label: "Edited For Style",
    description:
      "The document is edited for tone, style, and consistency with guidelines.",
  },
  FinalDraft: {
    label: "Final Draft",
    description: "The document is complete and ready for public release.",
  },
  Published: {
    label: "Published",
    description: "The document is publicly available and in use.",
  },
  Archived: {
    label: "Archived",
    description:
      "The document is no longer in active use and has been archived for reference.",
  },
};
