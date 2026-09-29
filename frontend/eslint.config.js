import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 1. Ignore the compiled production folder (don't lint build output)
  globalIgnores(['dist']),
  {
    // 2. Scan all JavaScript and JSX React files
    files: ['**/*.{js,jsx}'],
    // 3. Use standard recommended rules for JS, React Hooks, and Vite
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    // 4. Tell ESLint this code runs in a Web Browser
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // 5. Custom project overrides
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
