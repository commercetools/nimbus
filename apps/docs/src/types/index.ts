import { DocumentState } from "./document-states";

/** this document is aimed at product developers */
export type AudienceDeveloper = "developer";
/** this dodument is aimed at design system maintainers */
export type AudienceMaintainer = "maintainer";
/** this dodument is aimed at designers */
export type AudienceDesigner = "designer";
/** this dodument is aimed at product managers */
export type AudienceProductManager = "pm";

/** the audience a document was made for */
export type AudienceType =
  | AudienceDeveloper
  | AudienceMaintainer
  | AudienceDesigner
  | AudienceProductManager;

export type MdxFileFrontmatter = {
  meta: {
    /** a unique identifier for this document */
    id: string;
    /** the title of the document*/
    title: string;
    /** a description */
    description: string;
    /** the current state of progress of the document */
    documentState: DocumentState;
    /** menu display order */
    order?: number;
    /** the template to use to render this document */
    template?: "Component" | "hook";
    /** the path to the file on the fileSystem */
    filePath: string;
    /** the path to the file within the repo, from the repo-root */
    repoPath: string;
    /**
     * Array of menu labels
     * e.g. ["Getting Started", "API Reference"]
     */
    menu: string[];
    /** unique, browser-route, generated from the menu array */
    route: string;
    /** tags one might use to search for this page */
    tags: string[];
    /** table of contents of the document */
    toc: TocItem[];
    /** the audience the document is made for */
    audience?: AudienceType[];
    /** icon associated with this document */
    icon?: string;
  };

  mdx: string;
};

export type TocItem = {
  value: string;
  href: string;
  depth: number;
  numbering: number[];
  parent: string;
};
