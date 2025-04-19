import { IconButton, Heading, Box } from "@commercetools/nimbus";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import GithubSlugger from "github-slugger";
import { Link as LinkIcon } from "@commercetools/nimbus-icons";
import { useCopyToClipboard } from "@commercetools/nimbus";
/**
 * Generates a slug from React children.
 *
 * This function ensures that the slug generated is consistent with the one produced by the toc-plugin.
 * It converts the children to a string, generates a slug, and then removes any "-1" suffixes that might
 * be added by the slugger.
 *
 * @param {ReactNode} children - The React children to convert to a slug
 * @returns {string} The generated slug
 */
const sluggifyChildren = (children: ReactNode) => {
  const slugger = new GithubSlugger();
  return slugger.slug(typeof children === "string" ? children.toString() : "");
};

type HeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

const commonProps = (props: HeadingProps) => ({
  /**
   * adds the id to the heading
   * this is needed for linking directly to this part of the document
   */
  id: sluggifyChildren(props.children),
  /**
   * makes sure that the heading is not covered by the sticky navbar
   * magic-number: roughly the header-height + some extra-padding
   */
  scrollMarginTop: "2400",
  position: "relative",
  className: "group",
});

const CopyLink = ({ id }: { id: string }) => {
  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopyLink = () => {
    // Get the current URL without hash
    const baseUrl = window.location.href.split("#")[0];
    // Construct the full URL with the heading ID as hash
    const fullUrl = `${baseUrl}#${id}`;
    // Copy to clipboard
    copyToClipboard(fullUrl);
    alert("Copied to clipboard.");
  };

  return (
    <Box as="span" display="inline-block" position="relative" boxSize="1ch">
      <Box
        position="absolute"
        top="50%"
        left="calc(50% + 1ch)"
        transform="translate(-50%, -50%)"
        focusRing="outside"
        color="neutral.11"
        opacity="0"
        verticalAlign="middle"
        _groupHover={{
          opacity: "1",
        }}
        asChild
      >
        <IconButton
          variant="ghost"
          size="xs"
          aria-label="Copy Link"
          onPress={handleCopyLink}
        >
          <LinkIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export const H1 = ({ children, ...props }: HeadingProps) => {
  const id = sluggifyChildren(children);
  return (
    <Heading
      {...commonProps({ children, ...props })}
      mb="600"
      size="3xl"
      asChild
    >
      <h1 {...props}>
        {children} <CopyLink id={id} />
      </h1>
    </Heading>
  );
};

export const H2 = ({ children, ...props }: HeadingProps) => {
  const id = sluggifyChildren(children);
  return (
    <Heading
      {...commonProps({ children, ...props })}
      mb="300"
      mt="600"
      size="2xl"
      asChild
    >
      <h2 {...props}>
        {children} <CopyLink id={id} />
      </h2>
    </Heading>
  );
};

export const H3 = ({ children, ...props }: HeadingProps) => {
  const id = sluggifyChildren(children);
  return (
    <Heading
      {...commonProps({ children, ...props })}
      mb="300"
      mt="600"
      size="xl"
      asChild
    >
      <h3 {...props}>
        {children} <CopyLink id={id} />
      </h3>
    </Heading>
  );
};
export const H4 = ({ children, ...props }: HeadingProps) => {
  const id = sluggifyChildren(children);
  return (
    <Heading
      {...commonProps({ children, ...props })}
      mb="300"
      mt="600"
      size="lg"
      asChild
    >
      <h4 {...props}>
        {children} <CopyLink id={id} />
      </h4>
    </Heading>
  );
};
export const H5 = ({ children, ...props }: HeadingProps) => {
  const id = sluggifyChildren(children);
  return (
    <Heading
      {...commonProps({ children, ...props })}
      mb="300"
      mt="600"
      size="lg"
      fontWeight="500"
      asChild
    >
      <h5 {...props}>
        {children} <CopyLink id={id} />
      </h5>
    </Heading>
  );
};
export const H6 = ({ children, ...props }: HeadingProps) => {
  const id = sluggifyChildren(children);
  return (
    <Heading
      {...commonProps({ children, ...props })}
      mb="300"
      mt="600"
      size="lg"
      fontWeight="400"
      asChild
    >
      <h6 {...props}>
        {children} <CopyLink id={id} />
      </h6>
    </Heading>
  );
};
