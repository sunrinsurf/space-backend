module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "eslint:recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-unused-vars": "warn",
        "no-console": "off",
        "no-undef": "off",
        "consistent-return": "off",
        "radix": "off",
        "global-require": "off",
        "no-continue": "off",
        "import/no-dynamic-require": "off",
        "no-restricted-syntax": "off",
        "no-plusplus": "off"
    }
};