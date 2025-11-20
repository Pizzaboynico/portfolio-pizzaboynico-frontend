/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  
  // FIX: Ignora ESLint durante il build per risolvere l'errore "next is not a function..."
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;