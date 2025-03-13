module.exports = {
  root: true,
  extends: "@react-native",

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    quotes: ["warn", "double"],
    semi: "off",
    // was warn by default
    "react-native/no-inline-styles": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",

    // was off by default
    "@typescript-eslint/prefer-nullish-coalescing": "error",
  },
}
