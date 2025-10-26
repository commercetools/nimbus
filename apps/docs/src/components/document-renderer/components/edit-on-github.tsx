/**
 * Edit on GitHub Link
 *
 * Provides a link to edit the documentation source on GitHub
 */

import { Button, Link } from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";

interface EditOnGitHubProps {
  /**
   * Path to the file relative to monorepo root
   * e.g., "packages/nimbus/src/components/button/button.mdx"
   */
  repoPath?: string;
}

const GITHUB_BASE_URL = "https://github.com/commercetools/nimbus/edit/main";

export function EditOnGitHub({ repoPath }: EditOnGitHubProps) {
  if (!repoPath) return null;

  const githubUrl = `${GITHUB_BASE_URL}/${repoPath}`;

  return (
    <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="sm" aria-label="Edit this page on GitHub">
        <Icons.Edit />
        Edit on GitHub
      </Button>
    </Link>
  );
}
