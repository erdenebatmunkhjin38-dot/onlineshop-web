import type { NextConfig } from "next";

// Spring Boot backend-ийн хаяг. Зөвхөн сервер талд хэрэглэгдэнэ (browser мэдэхгүй).
const API_URL = process.env.API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // Next.js 16-ийн кэшийн загвар: 'use cache', cacheTag, cacheLife (Лекц 9).
  cacheComponents: true,
  partialPrefetching: true,

  // Docker image-д зөвхөн хэрэгтэй файлуудыг багцална (Лекц 16).
  output: "standalone",

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Backend-ийн байршуулсан зургийг (/uploads/...) өөрийн домэйноор дамжуулна.
  // Browser нь зөвхөн Next.js-тэй харьцаж, backend-ийн хаягийг мэдэхгүй (BFF).
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` }];
  },

  images: {
    // next/image зөвхөн эдгээр дотоод замын зургийг оновчтой болгоно (Лекц 15).
    localPatterns: [{ pathname: "/uploads/**" }],
  },

  experimental: {
    // Бүтээгдэхүүний зураг 5MB хүртэл тул Server Action-ий анхдагч 1MB хязгаарыг нэмнэ.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
