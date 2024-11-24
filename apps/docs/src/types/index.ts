export type MdxFileFrontmatter = {
  meta: {
    /** a unique identifier for this document */
    id: string;
    /** the title of the document*/
    title: string;
    /** a description */
    description: string;
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
     * e.g. [" Getting Started", "API Reference"]
     */
    menu: string[];
    /** unique, broser-route, generated from the menu array */
    route: string;
    /** tags one might use to search for this page */
    tags: string[];
    /** table of contents of the document */
    toc: TocItem[];
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
