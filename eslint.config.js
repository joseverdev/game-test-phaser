export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        Phaser: "readonly",
      },
    },
    rules: {
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "space-infix-ops": "error",
      indent: ["error", 2],
    },
  },
];