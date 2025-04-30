/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Set up the directory structure
  pageExtensions: ['tsx', 'ts'],
  distDir: '.next',
  // Configure async/await transpilation
  experimental: {
    esmExternals: 'loose',
  },
  // Set up the API proxy to the backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig 