/* eslint-env node */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "simple-import-sort"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    eqeqeq: ["error", "always"],
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "import/order": "off",
    "import/no-unresolved": "off",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react/jsx-runtime",
            message: "Import from 'react' instead of 'react/jsx-runtime'.",
          },
          {
            name: "react/jsx-dev-runtime",
            message: "Import from 'react' instead of 'react/jsx-dev-runtime'.",
          },
        ],
      },
    ],
  },
  ignorePatterns: ["node_modules/", ".next/", "dist/", "build/", "coverage/"],
};
