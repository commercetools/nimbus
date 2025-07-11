import { IconButton } from "@commercetools/nimbus";
import { Github } from "@commercetools/nimbus-icons";

// TODO: put this in some config file
const prefix = "https://github.com/commercetools/nimbus/blob/main/";

type Props = {
  /** text to display next to the icon */
  text?: string;
  /** the path to the file starting from the repo-root */
  repoPath: string;
};

export const GithubRepoLink = ({ repoPath, text = "" }: Props) => {
  const link = [prefix, repoPath].join("");

  return (
    <IconButton size="xs" variant="ghost" asChild>
      <a href={link} target="_blank">
        <Github />
        {text.length > 0 && " "}
        {text}
      </a>
    </IconButton>
  );
};
