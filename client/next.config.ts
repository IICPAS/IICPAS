// next.config.js
const nextConfig = {
  images: {
    domains: ["randomuser.me", "localhost"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
