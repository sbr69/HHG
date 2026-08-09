import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async ({ command, mode }) => {
  // Mirror VITE_* env into import.meta.env.* so server-side code sees it too.
  const env: Record<string, string> = {};
  const loaded = loadEnv(mode, process.cwd(), "VITE_");
  for (const entry of Object.entries(loaded)) {
    const safeKey = String(entry[0]).replace(/[^A-Za-z0-9_]/g, "");
    if (safeKey) {
      Object.defineProperty(env, `import.meta.env.${safeKey}`, {
        value: JSON.stringify(entry[1]),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
  }

  const plugins = [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Route TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
  ];

  // Production build: emit a deployable worker via nitro (Cloudflare by default,
  // overridable with NITRO_PRESET or platform auto-detection).
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  }

  plugins.push(react());

  return {
    define: env,
    resolve: {
      tsconfigPaths: true,
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    plugins,
  };
});
