/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Required for static export (Capacitor will load files from /out)
  reactStrictMode: true,
  images: {
    unoptimized: true, // Prevents image optimization errors in static export
  },
  trailingSlash: true, // Optional: ensures proper routing for static exports
};

export default nextConfig;
