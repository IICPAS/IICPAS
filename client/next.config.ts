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
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8080',
  },
};
module.exports = nextConfig;
