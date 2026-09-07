/** @type {import("prettier").Config} */
export default {
    // Line length before Prettier wraps
    printWidth: 100,

    // Indentation
    tabWidth: 4,
    useTabs: false,

    // Semicolons at end of statements
    semi: true,

    // Use single quotes instead of double quotes
    singleQuote: true,

    // Quotes in JSX (double is the HTML convention)
    jsxSingleQuote: false,

    // Trailing commas wherever valid in ES5 (objects, arrays, params)
    trailingComma: 'all',

    // Spaces inside object braces: { foo: bar }
    bracketSpacing: true,

    // Put > of multi-line JSX elements on the last line
    bracketSameLine: false,

    // Arrow function parentheses — always: (x) => x
    arrowParens: 'always',

    // Line endings (lf keeps Git diffs clean cross-platform)
    endOfLine: 'lf',
};
