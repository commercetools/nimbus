import { brandNameAtom } from "@/atoms/brand.ts";
import { activeRouteAtom } from "@/atoms/route.ts";
import { Edit } from "@bleh-ui/icons";
import { Box, Button, Text } from "@bleh-ui/react";
import { useAtom } from "jotai";
import {
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Component for the brand section of the app navigation bar.
 * for the time being it allows the user to edit the brand name.
 */
export const AppNavBarBrand = () => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);
  const [hover, setHover] = useState(false);
  const [editable, setEditable] = useState(false);
  const [brand, setBrand] = useAtom(brandNameAtom);

  const contentRef = useRef<HTMLSpanElement>(null);

  /**
   * Handles input events on the brand name span.
   * @param e - The form event.
   */
  const handleInput = (e: FormEvent<HTMLSpanElement>) => {
    const inputEvent = e as unknown as InputEvent;
    if (inputEvent.inputType === "insertParagraph") {
      e.preventDefault();
      (e.target as HTMLSpanElement).blur();
      return;
    }

    const newBrand = (e.target as HTMLSpanElement).innerText;
    setBrand(newBrand.length === 0 ? "@bleh-ui" : newBrand);

    // Save and restore the caret position
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const startOffset = range?.startOffset ?? 0;

    setTimeout(() => {
      const node = contentRef.current;
      if (node) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(node.childNodes[0], startOffset);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  /**
   * Handles blur events on the brand name span.
   */
  const handleBlur = () => {
    setEditable(false);
    setHover(false);
  };

  /**
   * Handles click events on the brand name span to navigate home.
   * @param e - The mouse event.
   */
  const handleHomeRequest = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setActiveRoute("home");
  };

  /**
   * Handles key down events on the brand name span.
   * @param e - The keyboard event.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
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
      range.selectNodeContents(element);
      range.collapse(false);
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
      <Text textStyle="2xl" asChild fontWeight="700">
        <a href="/apps/docs/public">
          <span
            contentEditable={editable}
            ref={contentRef}
            onInput={handleInput}
            suppressContentEditableWarning
            onClick={handleHomeRequest}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          >
            {brand}
          </span>
        </a>
      </Text>
      {hover && (
        <Box position="absolute" left="-1000" top="0" pr="200">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setEditable(!editable)}
          >
            <Edit />
          </Button>
        </Box>
      )}
    </Box>
  );
};
