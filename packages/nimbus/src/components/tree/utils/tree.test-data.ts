/**
 * Shared sample data for Tree stories and tests.
 */
export interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
}

export const fileTree: TreeNode[] = [
  {
    id: "documents",
    title: "Documents",
    children: [
      {
        id: "project",
        title: "Project",
        children: [
          { id: "report", title: "Weekly Report" },
          { id: "budget", title: "Budget" },
        ],
      },
    ],
  },
  {
    id: "photos",
    title: "Photos",
    children: [
      { id: "image-1", title: "Image 1" },
      { id: "image-2", title: "Image 2" },
    ],
  },
];
