/**
 * Share Button Component
 *
 * Allows users to share documentation links via various methods
 */

import { useState } from "react";
import { Menu, IconButton } from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({
  title,
  url = window.location.href,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsOpen(false);
    } catch {
      // Copy failed
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Nimbus: ${title}`,
          text: `Check out this Nimbus documentation: ${title}`,
          url,
        });
        setIsOpen(false);
      } catch (error) {
        // User cancelled or error occurred
        console.error(error);
      }
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Check out ${title} - Nimbus Design System`
    );
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "width=550,height=420");
    setIsOpen(false);
  };

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "width=550,height=420");
    setIsOpen(false);
  };

  const supportsNativeShare = typeof navigator.share !== "undefined";

  return (
    <Menu.Root open={isOpen} onOpenChange={setIsOpen}>
      <Menu.Trigger asChild>
        <IconButton aria-label="Share this page" size="sm" variant="outline">
          <Icons.Share />
        </IconButton>
      </Menu.Trigger>

      <Menu.Content>
        <Menu.Item onAction={handleCopyLink}>
          <Icons.Link />
          Copy Link
        </Menu.Item>

        {supportsNativeShare && (
          <Menu.Item onAction={handleShareNative}>
            <Icons.IosShare />
            Share...
          </Menu.Item>
        )}

        <Menu.Separator />

        <Menu.Item onAction={handleShareTwitter}>
          <Icons.Public />
          Share on Twitter
        </Menu.Item>

        <Menu.Item onAction={handleShareLinkedIn}>
          <Icons.Public />
          Share on LinkedIn
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}
