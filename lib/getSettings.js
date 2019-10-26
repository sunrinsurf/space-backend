const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.resolve(__dirname, '../settings.json'))) {
    global.settings = {};
} else {
    global.settings = require('../settings.json');
}