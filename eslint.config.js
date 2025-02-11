import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const compat = new FlatCompat();

export default [
  ...compat.config({
    extends: ['plugin:@typescript-eslint/recommended'], // Hinzufügen von legacy extends/plugins
    parser: '@typescript-eslint/parser',
  }),
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,           // TypeScript Parser
      ecmaVersion: 'latest',      // Aktuelle ECMAScript-Version
      sourceType: 'module',       // Modul-Importe erlauben
    },
    plugins: {
      '@typescript-eslint': tsPlugin,  // TypeScript Plugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',  // Warnt bei ungenutzten Variablen
      'no-console': 'error',  // Fehler bei console.log()
    },
  },
];