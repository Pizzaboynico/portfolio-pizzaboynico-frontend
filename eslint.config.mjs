import next from "eslint-config-next";

export default [
  {
    ignores: ["node_modules/**", ".next/**"],
  },

  ...next(),

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];