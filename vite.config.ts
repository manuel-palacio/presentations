import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The web page lives in web/; images are shared with the Remotion composition in public/.
export default defineConfig({
  root: "web",
  publicDir: "../public",
  base: "./",
  plugins: [react()],
  build: { outDir: "../dist", emptyOutDir: true },
});
