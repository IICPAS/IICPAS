// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "iicpa.in",
      },
      {
        protocol: "https",
        hostname: "api.iicpa.in",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
