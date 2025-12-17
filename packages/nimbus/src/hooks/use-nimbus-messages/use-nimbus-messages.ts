import { useEffect, useState } from "react";
import { getMessagesForLocale, type IntlMessages } from "@/utils/i18n";

/**
 * Hook to automatically load Nimbus translation messages for a given locale.
 * Handles loading state and errors automatically.
 *
 * @param locale - BCP47 language tag (e.g., "en", "de", "en-US")
 * @returns Object with messages, loading state, and error
 *
 * @example
 * ```tsx
 * import { useNimbusMessages, NimbusProvider } from "@commercetools/nimbus";
 *
 * function App() {
 *   const { messages, isLoading } = useNimbusMessages("en");
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return (
 *     <NimbusProvider locale="en" messages={messages}>
 *       <YourApp />
 *     </NimbusProvider>
 *   );
 * }
 * ```
 */
export function useNimbusMessages(locale: string) {
  const [messages, setMessages] = useState<IntlMessages>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getMessagesForLocale(locale)
      .then((loadedMessages) => {
        setMessages(loadedMessages);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
        // Fallback to empty messages on error
        setMessages({});
      });
  }, [locale]);

  return { messages, isLoading, error };
}
