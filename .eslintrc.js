module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "jsx-a11y"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "warn",
    "no-unused-vars": process.env.CI ? "warn" : "error",
  },
};
