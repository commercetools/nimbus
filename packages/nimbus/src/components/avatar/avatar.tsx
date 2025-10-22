import { useState } from "react";
import { useIntl } from "react-intl";
import { Image } from "@commercetools/nimbus";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots.tsx";
import { messages } from "./avatar.i18n";

function getInitials(firstName: string, lastName: string) {
  return (
    firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()
  );
}

export const Avatar = (props: AvatarProps) => {
  const intl = useIntl();
  const { ref, firstName, lastName, src, alt, ...rest } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fullName = `${firstName} ${lastName}`;

  const sharedProps = {
    "aria-label": intl.formatMessage(messages.avatarLabel, { fullName }),
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
