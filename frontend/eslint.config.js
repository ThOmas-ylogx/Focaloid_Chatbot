import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier'; // Often last among config/plugin imports
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import configReactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import configReactRecommended from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals'; // Often considered 'builtin' or high-priority 'external'
// ... rest of your config

export default [
    // 1. ESLint Recommended Rules (base for .js, .jsx files)
    {
        files: ['**/*.{js,jsx}'], // Apply to JavaScript and JSX files
        ...js.configs.recommended, // Spread ESLint's built-in recommended rules
        languageOptions: {
            ecmaVersion: 'latest', // Use modern ECMAScript features
            sourceType: 'module', // Use ES modules
            parserOptions: {
                ecmaFeatures: {
                    jsx: true, // Enable JSX parsing for ESLint's default parser
                },
            },
            globals: {
                // Define global variables available in your environment
                ...globals.browser, // For browser APIs like window, document
                ...globals.node, // For Node.js globals if you have server-side JS or scripts
                // Add other globals if needed, e.g., for test environments
            },
        },
    },

    // 2. Global Ignores
    {
        ignores: ['node_modules/', 'dist/', 'build/', '.turbo/', '.next/', 'public/'],
    },

    // 3. React Recommended Configuration
    {
        files: ['**/*.{js,jsx}'],
        ...configReactRecommended, // Spread the base React recommended config
        // The spread configReactRecommended should bring its own plugins, languageOptions, rules, settings.
        // We override/add to ensure our specifics.
        plugins: {
            ...configReactRecommended.plugins, // Preserve plugins from recommended (if any)
            react: pluginReact, // Ensure our imported plugin is used
        },
        settings: {
            ...configReactRecommended.settings,
            react: {
                version: 'detect', // Automatically detect React version
            },
        },
        // Ensure JSX is enabled if configReactRecommended doesn't explicitly set it
        languageOptions: {
            ...configReactRecommended.languageOptions,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            ...configReactRecommended.rules,
            'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
            'react/prop-types': 'off', // Turn off if not using PropTypes
        },
    },

    // 4. React JSX Runtime Configuration
    {
        files: ['**/*.{js,jsx}'],
        ...configReactJsxRuntime,
        plugins: {
            // Ensure plugin is available if runtime config relies on it
            ...configReactJsxRuntime.plugins,
            react: pluginReact,
        },
        languageOptions: {
            // Ensure JSX is enabled
            ...configReactJsxRuntime.languageOptions,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },

    // 5. React Hooks Configuration
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            'react-hooks': pluginReactHooks,
        },
        // No specific parser needed here if inheriting from global JS/JSX setup
        languageOptions: {
            // Just ensure JSX context if necessary
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },

    // 6. JSX-A11y Recommended Configuration
    {
        files: ['**/*.{js,jsx}'],
        ...pluginJsxA11y.flatConfigs.recommended, // Use the documented flat config
        plugins: {
            // Ensure the plugin is registered correctly
            ...pluginJsxA11y.flatConfigs.recommended.plugins,
            'jsx-a11y': pluginJsxA11y,
        },
        languageOptions: {
            ...pluginJsxA11y.flatConfigs.recommended.languageOptions,
            parserOptions: {
                // Ensure JSX is enabled
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            ...pluginJsxA11y.flatConfigs.recommended.settings,
            'jsx-a11y': {
                // Your custom jsx-a11y settings
                polymorphicPropName: 'as',
                // components: { "MyCustomButton": "button" },
            },
        },
    },

    // 7. Import Plugin Configuration (eslint-plugin-import)
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            import: pluginImport,
        },
        // No specific parser needed here if inheriting
        settings: {
            'import/resolver': {
                node: {
                    // For resolving node_modules imports
                    extensions: ['.js', '.jsx'],
                },
                // If you use path aliases in Vite (e.g., `@/*`), you'd configure
                // eslint-import-resolver-alias or eslint-import-resolver-typescript (even for JS if tsconfig paths are used for aliases)
                // Example for basic alias (if you set it up elsewhere):
                // alias: {
                //   map: [
                //     ["@", "./src"]
                //   ],
                //   extensions: [".js", ".jsx"]
                // }
            },
        },
        rules: {
            'import/no-unresolved': 'warn', // Warn if it can't resolve, can be noisy without good alias setup
            'import/named': 'error',
            'import/namespace': 'error',
            'import/default': 'error',
            'import/export': 'error',
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },

    // 8. Your Custom Project-Specific Rules (Overrides)
    {
        files: ['**/*.{js,jsx}'],
        // No specific parser needed if inheriting
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and .error
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            // Add any other project-specific rules or overrides here
        },
    },

    // 9. Prettier Configuration - MUST BE THE LAST ONE
    prettierConfig,
];
