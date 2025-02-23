const nextConfig = {
  images: {
    domains: [
      "nzhtsvoqrnjktpfehmtz.supabase.co", // Supabase Storage
      "images-na.ssl-images-amazon.com", // Amazon 
      "m.media-amazon.com", // Amazon
      "cdn.gramedia.com", // Gramedia
    ],
  },
  experimental: {
    turbo: false, // Turbopack
  },
};

export default nextConfig;
