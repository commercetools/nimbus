import { brandNameAtom } from "@/atoms/brand";
import { activeRouteAtom } from "@/atoms/route";
import { Pencil } from "@bleh-ui/icons";
import { Box, Button, Text } from "@bleh-ui/react";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

export const AppNavBarBrand = () => {
  const [, setActiveroute] = useAtom(activeRouteAtom);
  const [hover, setHover] = useState(false);
  const [editable, setEditable] = useState(false);
  const [brand, setBrand] = useAtom(brandNameAtom);

  const contentRef = useRef<HTMLLinkElement>(null);

  const onInput = (e) => {
    if (e.inputType === "insertParagraph") {
      e.preventDefault();
      e.target.blur();
      return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    const newBrand = e.target.innerText;
    setBrand(newBrand.length === 0 ? "@bleh-ui" : newBrand);

    // Save the caret position
    const startOffset = range?.startOffset;

    // Update the content
    setTimeout(() => {
      const node = contentRef.current;
      if (node) {
        // Restore the caret position
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(node.childNodes[0], startOffset);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  const onBlur = () => {
    setEditable(false);
    setHover(false);
  };

  const onHomeRequest = (e) => {
    e.preventDefault();
    setActiveroute("home");
  };

  useEffect(() => {
    setHover(false);
    const element = contentRef.current;
    if (element) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(element); // Select the contents of the element
      range.collapse(false); // Collapse the range to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editable]);

  return (
    <Box
      position="relative"
      zIndex="max"
      role="group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Text textStyle="2xl" asChild fontWeight="bold">
        <a
          href="/"
          contentEditable={editable}
          ref={contentRef}
          onInput={onInput}
          suppressContentEditableWarning
          onClick={onHomeRequest}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.target.blur();
            }
          }}
          onBlur={onBlur}
        >
          {brand}
        </a>
      </Text>
      {hover && (
        <Box position="absolute" left="-10" top="0" pr="2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setEditable(!editable)}
          >
            <Pencil />
          </Button>
        </Box>
      )}
    </Box>
  );
};
