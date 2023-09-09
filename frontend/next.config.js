/**  @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  // experimental: {
  //   esmExternals: "loose", // <-- add this
  //   serverComponentsExternalPackages: ["mongoose"] // <-- and this
  // },
  experimental: {
    serverComponentsExternalPackages: ['fabric'],
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias["styled-components"] = path.resolve(
      __dirname,
      "node_modules",
      "styled-components"
    );
    
    return config;
  },
}

module.exports = nextConfig;
