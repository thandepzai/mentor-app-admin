// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

// Kết hợp cấu hình cũ thông qua FlatCompat
const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"),

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            ecmaFeatures: {
                jsx: true,
                globalReturn: false,
                impliedStrict: true
            }
        },
        plugins: {
            prettier
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json"
                }
            }
        },
        rules: {
            "prettier/prettier": "warn",
            "no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "@typescript-eslint/no-var-requires": "off",
            "react/display-name": "off",
            "react-hooks/rules-of-hooks": "off",
            "@next/next/no-img-element": "off"
        }
    }
];

export default eslintConfig;
