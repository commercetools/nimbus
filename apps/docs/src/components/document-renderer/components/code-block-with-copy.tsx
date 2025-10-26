/**
 * Code Block with Copy Button
 *
 * Wraps code blocks with a copy-to-clipboard button
 */

import { useState } from "react";
import { Box, IconButton, useToast } from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";

interface CodeBlockWithCopyProps {
  code: string;
  children: React.ReactNode;
}

export function CodeBlockWithCopy({ code, children }: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copied",
        description: "Copied to clipboard",
        variant: "positive",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "critical",
      });
    }
  };

  return (
    <Box position="relative" marginY="400">
      <Box
        position="absolute"
        top="200"
        right="200"
        zIndex="1"
        opacity={copied ? "1" : "0.6"}
        _hover={{ opacity: "1" }}
        transition="opacity 0.2s"
      >
        <IconButton
          aria-label={copied ? "Copied!" : "Copy code"}
          size="sm"
          variant="ghost"
          onClick={handleCopy}
        >
          {copied ? <Icons.Check /> : <Icons.ContentCopy />}
        </IconButton>
      </Box>
      {children}
    </Box>
  );
}
