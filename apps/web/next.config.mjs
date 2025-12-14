/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false,
  },
  transpilePackages: ['@workspace/ui'],
};

export default nextConfig;
