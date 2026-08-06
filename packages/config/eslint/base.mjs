import baseConfig from '../../../eslint.config.mjs';

/**
 * Re-exports the workspace root ESLint flat config so every app/package can
 * do `import base from '@plan-b/config/eslint/base'` and extend it, rather
 * than duplicating ignores/rules per workspace.
 */
export default baseConfig;
