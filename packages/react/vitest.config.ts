import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      clean: true,
      reporter: ["text", "cobertura"],
    },
  },
});
