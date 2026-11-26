import type { LifecycleState } from "@/schemas/lifecycle-states";

/**
 * Props for the DocMetadata component, the header of a documentation page.
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
   * Lifecycle state (e.g., 'Stable', 'Experimental', 'Beta', 'Deprecated', 'EOL')
   */
  lifecycleState?: LifecycleState;

  /**
   * Link to Figma design resources
   */
  figmaLink?: string;

  /**
   * Link to the stories of the component in the published Storybook
   */
  storybookLink?: string;

  /**
   * Link to the source of the component on GitHub
   */
  githubLink?: string;

  /**
   * Name of the illustration shown next to the title. Nothing is shown when the
   * name is not set or no illustration exists for it.
   */
  illustration?: string;
};
