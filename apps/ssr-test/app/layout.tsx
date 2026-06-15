import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Nimbus SSR Test",
  description:
    "Validates Nimbus components render correctly via SSR in Next.js App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // next-themes (via Nimbus's color-mode provider) sets the `class` and
  // `color-scheme` on <html> from a pre-hydration script, so the server markup
  // and React's initial client tree differ by design. suppressHydrationWarning
  // tells React to ignore that one-level-deep attribute mismatch.
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
