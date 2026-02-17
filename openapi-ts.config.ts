import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.yml",
  output: {
    path: "./src/pokemon/api/generated",
  },
  plugins: ["@hey-api/client-fetch"],
});
