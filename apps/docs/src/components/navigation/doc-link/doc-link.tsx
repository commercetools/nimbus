import React from "react";
import { Link, Code } from "@commercetools/nimbus";
import { useAtom } from "jotai";
import { activeRouteAtom } from "../../../atoms/route";

interface DocLinkProps {
  /**
   * The path to the documentation page
   */
  docRoute?: string;
  /**
   * The text content of the link
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Optional flag to render an unstyled link
   */
  unstyled?: boolean;
}

/**
 * DocLink is a component for linking to internal documentation pages.
 * It handles proper routing to documentation pages using the activeRouteAtom
 * and provides options for styling the link content.
 */
export const DocLink: React.FC<DocLinkProps> = ({
  docRoute,
  children,
  onClick,
  unstyled = false,
}) => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);

  // If no docRoute is provided, just render the content without a link
  if (!docRoute) {
    return <>{children}</>;
  }

  // Format the route path to make sure it starts with a "/"
  const formattedRoute = docRoute.startsWith("/") ? docRoute : `/${docRoute}`;

  // Handle click event to update the activeRouteAtom
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Update activeRouteAtom with the route without the leading slash
    setActiveRoute(formattedRoute.substring(1));

    // Call the optional onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={formattedRoute} onClick={handleClick} unstyled={unstyled}>
      {children}
    </Link>
  );
};
