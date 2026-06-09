import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { config as baseConfig } from "@repo/eslint-config/react-internal";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
    },
  },
];