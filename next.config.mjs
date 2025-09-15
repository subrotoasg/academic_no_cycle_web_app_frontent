/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apars.b-cdn.net",
        pathname: "/varsity/**",
      },
      {
        protocol: "https",
        hostname: "fai-cg.b-cdn.net",
        pathname: "/**",
      },
    ],
    // unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
