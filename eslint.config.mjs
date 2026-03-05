import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  // ── Next.js base configs ────────────────────────────────────────────────────
  ...nextVitals,
  ...nextTs,

  // ── Override default ignores of eslint-config-next ──────────────────────────
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // ── TypeScript + React enhanced rules ───────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "unused-imports": unusedImports,
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true, // enables type-aware lint rules
      },
    },
    rules: {
      // ── Unused imports / variables ──────────────────────────────────────────
      // Turn off the base rule; the plugin version handles both imports & vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error", // auto-fixable ✨
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_", // prefix with _ to intentionally ignore
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // ── TypeScript strictness ───────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/consistent-type-assertions": [
        "warn",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "allow-as-parameter",
        },
      ],

      // ── React best practices ────────────────────────────────────────────────
      "react/self-closing-comp": "warn", // prefer <Foo /> over <Foo></Foo>
      "react/jsx-no-useless-fragment": "warn", // remove unnecessary <>…</>
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" }, // no redundant {"text"} literals
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ── General quality ─────────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }], // flag stray console.log
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },
]);

export default eslintConfig;
