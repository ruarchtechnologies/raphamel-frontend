/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Explicitly set the root to the frontend directory so Turbopack does not
    // walk up and confuse the monorepo-level package-lock.json as the root.
    root: process.cwd(),
  },
  images: {
    qualities: [75, 85],
    remotePatterns: [
      ...(process.env.NODE_ENV === 'development' ? [{ protocol: 'http', hostname: 'localhost' }] : []),
      { protocol: 'https', hostname: 'staging.api.raphamel.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.*.amazonaws.com' },
      { protocol: 'https', hostname: 'lfatwnwexrfrqhcnfzwf.supabase.co' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
};

export default nextConfig;
