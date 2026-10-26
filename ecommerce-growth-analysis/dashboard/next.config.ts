import type { NextConfig } from "next";

/**
 * GitHub Pages 部署：静态导出 + basePath。
 *
 * `NEXT_EXPORT=1 npm run build` 产出 `out/` 目录（用于推 gh-pages 分支）；
 * 普通 `npm run build` / `npm run dev` 保持服务端模式，不受影响。
 */
const isStaticExport = process.env.NEXT_EXPORT === "1";

const nextConfig: NextConfig = {
  // 站点挂在 https://<user>.github.io/ecommerce-growth-analysis/ 子路径下
  basePath: "/ecommerce-growth-analysis",
  ...(isStaticExport ? { output: "export" as const } : {}),
};

export default nextConfig;
