"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { EmotionCache, SerializedStyles } from "@emotion/react";

/**
 * Emotion SSR cache registry for the Next.js App Router.
 *
 * Chakra UI (which Nimbus is built on) inserts some styles through Emotion at
 * runtime. Without a registry, Emotion emits those as inline `<style>` tags
 * during SSR but inserts them via the CSSOM on the client, so the server markup
 * and the hydrated tree disagree and React reports a hydration mismatch.
 *
 * This collects the styles Emotion inserts during the server render and flushes
 * them into the document through Next's `useServerInsertedHTML`, keeping the
 * server and client output consistent.
 */
export function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    // Key must match the one Chakra/Emotion use (the default "css").
    const cache = createCache({ key: "css" });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args: Parameters<EmotionCache["insert"]>) => {
      const serialized = args[1] as SerializedStyles;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
