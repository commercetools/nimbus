export type ResourceLinkSource = {
  figmaLink?: string;
  storybookLink?: string;
  githubLink?: string;
};

export type ResourceLink = {
  key: "figma" | "storybook" | "github";
  label: string;
  href: string;
};

/**
 * Turns the link fields of a document into the list shown in the page header.
 * The order is fixed: Figma, Storybook, GitHub. Fields that are not set are
 * left out.
 */
export const getResourceLinks = ({
  figmaLink,
  storybookLink,
  githubLink,
}: ResourceLinkSource): ResourceLink[] => {
  const links: ResourceLink[] = [
    { key: "figma", label: "Figma", href: figmaLink ?? "" },
    { key: "storybook", label: "Storybook", href: storybookLink ?? "" },
    { key: "github", label: "GitHub", href: githubLink ?? "" },
  ];
  return links.filter((link) => link.href !== "");
};
