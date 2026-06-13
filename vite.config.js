import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  preview: {
    allowedHosts: ["pemirarpl2026.online", "www.pemirarpl2026.online"],
  },
  server: {
    allowedHosts: ["pemirarpl2026.online", "www.pemirarpl2026.online"],
  },
});
