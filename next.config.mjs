/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Explicitly set the root to the frontend directory so Turbopack does not
    // walk up and confuse the monorepo-level package-lock.json as the root.
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
};

export default nextConfig;
