import { Link } from "@bleh-ui/react";
import { FileCode } from "@bleh-ui/icons";

const prefix = "vscode://file";

/**
 * Component props for `VsCodeEditLink`.
 */
interface VsCodeEditLinkProps {
  /**
   * The file path to be used in the VSCode link.
   */
  filePath: string;

  /**
   * Optional text to be displayed in the link. Defaults to an empty string.
   */
  text?: string;
}

/**
 * `VsCodeEditLink` is a React component that renders a link to open a file in VSCode.
 *
 * @param {VsCodeEditLinkProps} props - The props for the component.
 * @param {string} props.filePath - The file path to be used in the VSCode link.
 * @param {string} [props.text] - Optional text to be displayed in the link. Defaults to an empty string.
 * @returns {JSX.Element} The rendered link component.
 */
export const VsCodeEditLink = ({
  filePath,
  text = "",
}: VsCodeEditLinkProps) => {
  const link = [prefix, filePath].join("/");

  return (
    <Link href={link} target="_blank" title="Open in VSCode">
      <FileCode size="1em" />
      {text.length > 0 && " "}
      {text}
    </Link>
  );
};
