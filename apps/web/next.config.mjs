/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: true,
  },
  transpilePackages: ['@workspace/ui'],
};

export default nextConfig;
