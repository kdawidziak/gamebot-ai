import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      indent: ["error", 2],
      semi: ["error", "never"],
      quotes: ["error", "double"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "space-in-parens": ["error", "never"],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
    },
  }),
]

export default eslintConfig
