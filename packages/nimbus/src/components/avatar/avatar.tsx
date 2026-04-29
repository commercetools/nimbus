import { useState } from "react";
import { Person } from "@commercetools/nimbus-icons";
import { Image } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { type AvatarProps } from "./avatar.types";
import { AvatarRoot } from "./avatar.slots";
import { avatarMessagesStrings } from "./avatar.messages";

/**
 * Extract a one- or two-character initials string from the supplied names.
 *
 * Defensive against missing input: handles `undefined`, empty strings, and
 * whitespace-only strings by trimming and dropping empty parts. Codepoint-
 * safe: uses `Array.from` so astral-plane characters (e.g. emoji surrogate
 * pairs) are not split mid-surrogate. Returns an empty string when neither
 * input yields a usable character — callers use that signal to render the
 * `Person` icon fallback instead of text.
 */
export function getInitials(firstName?: string, lastName?: string) {
  const first = Array.from((firstName ?? "").trim())[0]?.toUpperCase() ?? "";
  const last = Array.from((lastName ?? "").trim())[0]?.toUpperCase() ?? "";
  return `${first}${last}`;
}

/**
 * Compose a display-ready full name from the trimmed non-empty parts.
 * Returns "" when both inputs are missing/empty/whitespace-only so the
 * caller can fall back to a generic localized label.
 */
export function getFullName(firstName?: string, lastName?: string) {
  return [firstName, lastName]
    .map((s) => s?.trim() ?? "")
    .filter(Boolean)
    .join(" ");
}

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
  const { ref, firstName, lastName, src, alt, ...rest } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const initials = getInitials(firstName, lastName);
  const fullName = getFullName(firstName, lastName);

  const avatarLabel = fullName
    ? msg.format("avatarLabel", { fullName })
    : msg.format("avatarLabelGeneric");

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

  // Show the fallback (initials or Person icon) when no src is provided,
  // while the image is loading, or when the image failed to load.
  const shouldShowFallback = !src || !imageLoaded || imageError;

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
