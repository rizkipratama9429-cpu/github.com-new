import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

// Konfigurasi flat ESLint: rekomendasi JS + TypeScript, lalu matikan
// aturan yang bertabrakan dengan Prettier (harus paling akhir).
export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "coverage/**", ".vscode/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
);
