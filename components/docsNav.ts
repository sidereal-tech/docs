// SPDX-License-Identifier: Apache-2.0

// Docs navigation data. Plain module (no "use client") so both the client
// sidebar and the server-rendered pager can consume the same source of truth;
// importing this from a client module would hand the server a client-reference
// proxy instead of an array.

export type DocsNavItem = { href: string; label: string };
export type DocsNavGroup = { label: string; items: DocsNavItem[] };

export const DOCS_NAV: DocsNavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Introduction" },
      { href: "/quickstart", label: "Quickstart" },
    ],
  },
  {
    label: "Concepts",
    items: [
      { href: "/concepts", label: "SY, PT and YT" },
      { href: "/lifecycle", label: "Market lifecycle" },
    ],
  },
  {
    label: "Protocol design",
    items: [
      { href: "/sy-wrapper", label: "SY wrapper" },
      { href: "/tokenizer", label: "Tokenizer" },
      { href: "/amm", label: "AMM and YT routing" },
      { href: "/settlement", label: "Settlement and maturity" },
    ],
  },
  {
    label: "Guides",
    items: [
      { href: "/guides/mint", label: "Deposit and split" },
      { href: "/guides/trade", label: "Trade PT and YT" },
      { href: "/guides/liquidity", label: "Provide liquidity" },
      { href: "/guides/claim-redeem", label: "Claim and redeem" },
    ],
  },
  {
    label: "Reference",
    items: [
      { href: "/contracts", label: "Deployed contracts" },
      { href: "/security", label: "Security and risks" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export const DOCS_PAGES: DocsNavItem[] = DOCS_NAV.flatMap((g) => g.items);
