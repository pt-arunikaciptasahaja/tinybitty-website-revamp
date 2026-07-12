import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/cookies",
        permanent: true,
      },
      {
        source: "/products",
        destination: "/cookies",
        permanent: true,
      },
      {
        source: "/cookie",
        destination: "/cookies",
        permanent: true,
      },
      {
        source: "/cookie/:slug",
        destination: "/cookies/:slug",
        permanent: true,
      },
      {
        source: "/corporate",
        destination: "/corporate-gifts",
        permanent: true,
      },
      {
        source: "/order",
        destination: "/cart",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
