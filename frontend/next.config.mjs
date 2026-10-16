const backend = process.env.BACKEND_URL || "http://localhost:8000";

/** @type {import('next').NextConfig} */
export default {
  // Proxy API calls so the browser never talks to the backend directly (no CORS needed).
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backend}/:path*` }];
  },
};
