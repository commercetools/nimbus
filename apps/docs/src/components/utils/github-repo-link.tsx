import { Button } from "@bleh-ui/react";
import { Github } from "@bleh-ui/icons";

// TODO: put this in some config file
const prefix = "https://github.com/commercetools/ui-kit-docs-poc/blob/main/";

type Props = {
  /** text to display next to the icon */
  text?: string;
  /** the path to the file starting from the repo-root */
  repoPath: string;
};

export const GithubRepoLink = ({ repoPath, text = "" }: Props) => {
  const link = [prefix, repoPath].join("");

  return (
    <Button size="xs" variant="ghost">
      <a href={link} target="_blank">
        <Github size="1em" />
        {text.length > 0 && " "}
        {text}
      </a>
    </Button>
  );
};
