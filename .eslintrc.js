module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:jest/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "jest"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-vars": process.env.CI ? "off" : "warn",
    "react/no-unescaped-entities": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
