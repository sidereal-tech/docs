// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidereal Docs",
  description:
    "How Sidereal splits yield-bearing positions on Stellar into principal and yield tokens: concepts, protocol design, guides, and contract reference.",
};

// Standalone docs site: document shell only. The /docs route group carries
// all chrome, matching the in-app docs at sidereal.tech/docs.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
