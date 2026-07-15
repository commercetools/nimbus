import { useState } from "react";
import { Person } from "@commercetools/nimbus-icons";
import { Image } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots";
import { avatarMessagesStrings } from "./avatar.messages";
import { getInitials, getFullName } from "./utils";

/**
 * Avatar
 * ============================================================
 * A small image or icon that identifies and personalizes the user within the interface.
 * Displays user images or automatically generates initials from first and last names.
 * Falls back to initials if image fails to load, and to a Person icon when no
 * usable initials can be derived.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/media/avatar}
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <Avatar firstName="John" lastName="Doe" src="https://example.com/avatar.jpg" />
 * ```
 *
 * @example
 * ```tsx
 * // With initials fallback
 * <Avatar firstName="Jane" lastName="Smith" />
 * ```
 *
 * @example
 * ```tsx
 * // No names provided — renders the Person icon and a generic localized label
 * <Avatar />
 * ```
 */
export const Avatar = (props: AvatarProps) => {
  const msg = useLocalizedStringFormatter(avatarMessagesStrings);
  const { ref, firstName, lastName, src, alt, children, ...rest } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const initials = getInitials(firstName, lastName);
  const fullName = getFullName(firstName, lastName);

  const avatarLabel = fullName
    ? msg.format("avatarLabel", { fullName })
    : msg.format("avatarLabelGeneric");

  // A decorative avatar (e.g. a sender glyph hidden with `aria-hidden`) should
  // not inject the generic "avatar" label — the label would be both redundant
  // (the node is already removed from the a11y tree) and, for a nameless
  // avatar, misleading. Omit it when hidden; `rest` still wins for everything.
  const isHidden =
    rest["aria-hidden"] === true || rest["aria-hidden"] === "true";

  const sharedProps = {
    ...(isHidden ? {} : { "aria-label": avatarLabel }),
    ref,
    ...rest,
  };

  const onLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const onError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  // Show the fallback (initials or Person icon) when no src is provided,
  // while the image is loading, or when the image failed to load.
  const shouldShowFallback = !src || !imageLoaded || imageError;

  // Custom content (e.g. an icon) overrides the default rendering entirely —
  // `src` (and its load/error handling) is intentionally ignored when present.
  if (children != null) {
    return <AvatarRoot {...sharedProps}>{children}</AvatarRoot>;
  }

  return (
    <AvatarRoot {...sharedProps}>
      {shouldShowFallback &&
        (initials.length > 0 ? initials : <Person aria-hidden="true" />)}

      {src && (
        <Image
          src={src}
          alt={alt || fullName || avatarLabel}
          onLoad={onLoad}
          onError={onError}
          display={imageLoaded && !imageError ? "block" : "none"}
        />
      )}
    </AvatarRoot>
  );
};

Avatar.displayName = "Avatar";
