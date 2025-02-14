import { forwardRef } from "react";
import { Image } from "@chakra-ui/react";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots.tsx";

function getInitials(firstName: string, lastName: string) {
  return (
    firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()
  );
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { firstName, lastName, src, alt, ...rest } = props;

  const fullName = `${firstName} ${lastName}`;

  const sharedProps = {
    "aria-label": `${fullName} avatar`,
    ref,
    ...rest,
    role: "figure",
  };
  return (
    <AvatarRoot {...sharedProps}>
      {src ? (
        // TODO: implement more robust error handling for image
        <Image src={src} alt={alt || fullName} />
      ) : (
        getInitials(firstName, lastName)
      )}
    </AvatarRoot>
  );
});

Avatar.displayName = "Avatar";
