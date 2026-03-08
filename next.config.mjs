/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // You can keep domains, but remotePatterns is the modern standard
    domains: [
      'localhost',
      'res.cloudinary.com',
      'via.placeholder.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
};

export default nextConfig;