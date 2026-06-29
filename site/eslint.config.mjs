import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import { fileURLToPath } from "node:url";

export default defineConfig([{
    extends: [...nextCoreWebVitals],
    ignores: ["**/.next/**", "**/out/**", "**/_next/**", "**/.turbo/**", "public/docs/**"]
}]);