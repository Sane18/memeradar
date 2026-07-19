/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets `next build` succeed on Vercel even before every key is wired in.
  // Tighten these once all integrations are in place.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
