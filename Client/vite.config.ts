import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: './',
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      '/api': 'http://localhost:5000'
    },
  },
  plugins: [
    react({
      jsxImportSource: "react"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  build: {
    outDir: "../build/client",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Suppress warnings up to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-switch",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip"
          ],
          lucide: ["lucide-react"],
          framer: ["framer-motion"],
          vendor: ["axios", "classnames", "zustand"]
        }
      }
    }
  }
});
