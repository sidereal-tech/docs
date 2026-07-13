// SPDX-License-Identifier: Apache-2.0

import type { Config } from "tailwindcss";

// Same "cinematic darkroom" tokens as the main app: monochrome with one
// amber accent for live signals, binary radius (pill controls, sharp panels).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#000000",
        carbon: "#181818",
        ash: "#6D6D6D",
        smoke: "#9A9A9A",
        pewter: "#808080",
        graphite: "#636363",
        amber: "#FFAC2E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        none: "0px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
