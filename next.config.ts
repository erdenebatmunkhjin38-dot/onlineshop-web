import type { NextConfig } from "next"; 
  
// Spring Boot backend-ийн хаяг. Зөвхөн сервер талд хэрэглэгдэнэ (browser мэдэхгүй).
const API_URL = process.env.API_URL ?? "http://localhost:8080"; 
  
const nextConfig: NextConfig = {   cacheComponents: true,   partialPrefetching: true, 
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  
  // Backend-ийн байршуулсан зургийг (/uploads/...) өөрийн домэйноор дамжуулна. 
  async rewrites() { 
    return [{ source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` }];   }, 
    images: { 
    // next/image зөвхөн эдгээр дотоод замын зургийг оновчтой болгоно. 
    localPatterns: [{ pathname: "/uploads/**" }],   }, }; 
  
export default nextConfig; 
