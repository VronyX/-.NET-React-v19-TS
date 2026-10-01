import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import pluginQuery from "@tanstack/eslint-plugin-query";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat["jsx-runtime"],
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
    },
  },
  // Khusus file config JavaScript di root (seperti vite.config.js, eslint.config.mjs):
  // Matikan aturan type-checking agar ESLint tidak komplain bahwa file ini "tidak terdaftar di tsconfig.json"
  {
    files: ["*.js", "*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  prettier,
];
