// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The docs pages live at the root here. /docs/* mirrors the in-app paths
  // (sidereal.tech/docs/amm), so redirect that shape for shared links.
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/",
        permanent: false,
      },
      {
        source: "/docs/:path*",
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
