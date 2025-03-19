import react from "@vitejs/plugin-react-swc";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: readFileSync(resolve(__dirname, "./localhost-key.pem")),
      cert: readFileSync(resolve(__dirname, "./localhost.pem")),
    },
  },
});
