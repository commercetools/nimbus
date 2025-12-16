import { useState, useEffect, useRef } from "react";
import { Flex, Button, TextInput } from "@commercetools/nimbus";

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ChatInput({
  onSend,
  isDisabled = false,
  placeholder = "Ask Claude to create UI components...",
  autoFocus = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce input changes (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  // Auto-focus when enabled
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSend = () => {
    const message = input.trim();
    if (!message || isDisabled) return;

    onSend(message);
    setInput("");
    setDebouncedInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Flex gap="300">
      <TextInput
        ref={inputRef}
        aria-label="chat input"
        flex="1"
        value={input}
        onChange={(value) => setInput(value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
      <Button
        aria-label="send message"
        onPress={handleSend}
        isDisabled={isDisabled || !input.trim()}
        variant="solid"
        colorPalette="primary"
      >
        Send
      </Button>
    </Flex>
  );
}
