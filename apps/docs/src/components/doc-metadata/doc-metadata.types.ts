import type { LifecycleState } from "@/schemas/lifecycle-states";

/**
 * Props for the DocMetadata component.
 * Displays frontmatter metadata as an introduction above view tabs.
 */
export type DocMetadataProps = {
  /**
   * Component or page title
   */
  title?: string;

  /**
   * Brief description of the component or page
   */
  description?: string;

  /**
   * Array of tags for categorization and search
   */
  tags?: string[];

  /**
   * Lifecycle state (e.g., 'Stable', 'Experimental', 'Beta', 'Deprecated', 'EOL')
   */
  lifecycleState?: LifecycleState;

  /**
   * Link to Figma design resources
   */
  figmaLink?: string;
};
