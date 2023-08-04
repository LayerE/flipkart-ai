/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
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

module.exports = nextConfig
