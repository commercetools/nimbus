import { brandNameAtom } from "@/atoms/brand.ts";
import { activeRouteAtom } from "@/atoms/route.ts";
import { Pencil } from "@bleh-ui/icons";
import { Box, Button, Text } from "@bleh-ui/react";
import { useAtom } from "jotai";
import {FormEvent,MouseEvent, KeyboardEvent, useEffect, useRef, useState} from "react";

export const AppNavBarBrand = () => {
  const [, setActiveroute] = useAtom(activeRouteAtom);
  const [hover, setHover] = useState(false);
  const [editable, setEditable] = useState(false);
  const [brand, setBrand] = useAtom(brandNameAtom);

  const contentRef = useRef<HTMLLinkElement>(null);

  const onInput = (e: FormEvent<HTMLSpanElement>) => {
    const inputEvent = e as unknown as InputEvent;
    if (inputEvent.inputType === "insertParagraph") {
      e.preventDefault();
      (e.target as HTMLSpanElement).blur();
      return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    const newBrand = (e.target as HTMLSpanElement).innerText;
    setBrand(newBrand.length === 0 ? "@bleh-ui" : newBrand);

    // Save the caret position
    const startOffset = range?.startOffset ?? 0;

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

  const onHomeRequest = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setActiveroute("home");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLSpanElement).blur();
    }
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
          <a href="/apps/docs/public">
          <span
              contentEditable={editable}
              ref={contentRef}
              onInput={onInput}
              suppressContentEditableWarning
              onClick={onHomeRequest}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
          >
            {brand}
          </span>
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