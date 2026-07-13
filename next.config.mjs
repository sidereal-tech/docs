// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
