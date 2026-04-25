import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react()],
  /*server: {
    host: true, // Or '0.0.0.0' - listens on all addresses (LAN, Wi-Fi, etc.)
    port: 5173, // Your dev server port
    https:false,
  },*/
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

