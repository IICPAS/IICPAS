// next.config.js
const nextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "localhost",
      "iicpa.in",
      "api.iicpa.in",
      "media.istockphoto.com",
      "images.unsplash.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === "production"
        ? "https://api.iicpa.in"
        : "http://localhost:8080",
    NEXT_PUBLIC_API_BASE:
      process.env.NODE_ENV === "production"
        ? "https://api.iicpa.in/api"
        : "http://localhost:8080/api",
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NODE_ENV === "production"
        ? "https://api.iicpa.in/api"
        : "http://localhost:8080/api",
  },
};
module.exports = nextConfig;
