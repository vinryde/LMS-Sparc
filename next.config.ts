import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES as string}.t3.storage.dev`,
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
