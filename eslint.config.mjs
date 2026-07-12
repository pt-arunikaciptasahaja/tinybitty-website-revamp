import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "coverage/**", "node_modules/**", "playwright-report/**"],
  },
];

export default eslintConfig;
