import { useState } from "react";
import { Image } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots";
import { avatarMessagesStrings } from "./avatar.messages";

function getInitials(firstName: string, lastName: string) {
  return (
    firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()
  );
}

/**
 * Avatar
 * ============================================================
 * A small image or icon that identifies and personalizes the user within the interface.
 * Displays user images or automatically generates initials from first and last names.
 * Falls back to initials if image fails to load.
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
 */
export const Avatar = (props: AvatarProps) => {
  const msg = useLocalizedStringFormatter(avatarMessagesStrings);
  const { ref, firstName, lastName, src, alt, ...rest } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fullName = `${firstName} ${lastName}`;

  const avatarLabel = msg.format("avatarLabel", {
    fullName,
  });

  const sharedProps = {
    "aria-label": avatarLabel,
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

  // Show initials if no src provided, image hasn't loaded yet, or image failed
  const shouldShowInitials = !src || !imageLoaded || imageError;

  return (
    <AvatarRoot {...sharedProps}>
      {shouldShowInitials ? getInitials(firstName, lastName) : null}

      {src && (
        <Image
          src={src}
          alt={alt || fullName}
          onLoad={onLoad}
          onError={onError}
          display={imageLoaded && !imageError ? "block" : "none"}
        />
      )}
    </AvatarRoot>
  );
};

Avatar.displayName = "Avatar";
