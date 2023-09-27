module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react'],
    env: {
        node: true,
        browser: true,
        jest: true,
    },
    globals: {
        window: true,
        module: true,
        CoreManager: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        quotes: 'off',
        'no-console': 1,
        '@typescript-eslint/no-var-requires': 0,
        'quote-props': ['error', 'as-needed'],
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-extra-semi': 'off',
        indent: ['error', 4, { SwitchCase: 1 }],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-named-as-default': 'off',
        'comma-dangle': ['error', 'only-multiline'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'no-empty-function': 'off',
        semi: [2, 'always'],
        'comma-style': [1],
        'prefer-destructuring': ['error', { object: true, array: false }],
        'no-unused-expressions': ['error', { allowShortCircuit: true }],
        'max-len': ['warn', { code: 120, ignoreComments: true, ignoreStrings: true }],
        'react/jsx-key': [
            'error',
            {
                checkFragmentShorthand: true,
            },
        ],
    },
};
