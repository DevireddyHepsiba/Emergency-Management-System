import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function publicSeoFiles(siteUrl: string): Plugin {
  const canonicalSiteUrl = siteUrl.replace(/\/+$/, "");
  const sitemap = canonicalSiteUrl
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonicalSiteUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  const robots = `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /report-emergency\nDisallow: /my-reports\nDisallow: /hospitals\nDisallow: /rescue-missions\nDisallow: /volunteer-tasks\nDisallow: /ai-metrics\n${canonicalSiteUrl ? `Sitemap: ${canonicalSiteUrl}/sitemap.xml\n` : ""}`;
  return {
    name: "sentinel-public-seo-files",
    transformIndexHtml() {
      if (!canonicalSiteUrl) return [];
      return [
        {
          tag: "link",
          attrs: { rel: "canonical", href: `${canonicalSiteUrl}/` },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: { property: "og:url", content: `${canonicalSiteUrl}/` },
          injectTo: "head",
        },
      ];
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url === "/robots.txt") {
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end(robots);
          return;
        }
        if (request.url === "/sitemap.xml") {
          response.setHeader("Content-Type", "application/xml; charset=utf-8");
          response.end(sitemap);
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react(), tailwindcss(), tsconfigPaths(), publicSeoFiles(env.VITE_SITE_URL || "")],
  };
});
