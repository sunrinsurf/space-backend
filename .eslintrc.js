module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
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
        "quotes": "off",
        "consistent-return": "off",
        "import/newline-after-import": "warn",
        "radix": "off",
        "no-undef": "off",
        "spaced-comment": "off",
        "indent": "off"
    }
};