import { useState } from "react";
import { Image } from "@chakra-ui/react";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots.tsx";

function getInitials(firstName: string, lastName: string) {
  return (
    firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()
  );
}

export const Avatar = (props: AvatarProps) => {
  const { ref, firstName, lastName, src, alt, ...rest } = props;
  const [imageError, setImageError] = useState(false);

  const fullName = `${firstName} ${lastName}`;

  const sharedProps = {
    "aria-label": `${fullName} avatar`,
    ref,
    ...rest,
  };

  // Reset error state when src changes
  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Show initials if no src provided or if image failed to load
  const shouldShowInitials = !src || imageError;

  return (
    <AvatarRoot {...sharedProps}>
      {shouldShowInitials ? (
        getInitials(firstName, lastName)
      ) : (
        <Image
          src={src}
          alt={alt || fullName}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </AvatarRoot>
  );
};

Avatar.displayName = "Avatar";
