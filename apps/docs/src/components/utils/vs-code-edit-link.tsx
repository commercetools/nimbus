import { IconButton } from "@nimbus/react";
import { Code as EditorIcon } from "@nimbus/icons";

const prefix = "vscode://file" + process.env.REPO_ROOT;

/**
 * Component props for `VsCodeEditLink`.
 */
interface VsCodeEditLinkProps {
  /**
   * The file path to be used in the VSCode link.
   */
  repoPath: string;

  /**
   * Optional text to be displayed in the link. Defaults to an empty string.
   */
  text?: string;
}

/**
 * `VsCodeEditLink` is a React component that renders a link to open a file in VSCode.
 *
 * @param {VsCodeEditLinkProps} props - The props for the component.
 * @param {string} props.repoPath - The file path to be used in the VSCode link.
 * @param {string} [props.text] - Optional text to be displayed in the link. Defaults to an empty string.
 * @returns {JSX.Element} The rendered link component.
 */
export const VsCodeEditLink = ({
  repoPath,
  text = "",
}: VsCodeEditLinkProps) => {
  const link = [prefix, repoPath].join("/");

  return (
    <IconButton size="xs" variant="ghost" asChild>
      <a href={link} target="_blank" title="Open in VSCode">
        <EditorIcon />
        {text.length > 0 && " "}
        {text}
      </a>
    </IconButton>
  );
};
