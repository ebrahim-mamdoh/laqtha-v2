/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // فاضي مفيش حاجة غلط
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow any HTTPS domain for flexibility
      }
    ],
  }
};

export default nextConfig;
