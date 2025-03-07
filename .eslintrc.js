module.exports = {
  root: true,
  extends: "@react-native",

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    quotes: ["warn", "double"],
    semi: "never",
    // was warn by default
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",

    // was off by default
    "@typescript-eslint/prefer-nullish-coalescing": "error",
  },
}
