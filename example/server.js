const FS = require('fs');

const Present = require('../src');

const config = JSON.parse(FS.readFileSync('./config.json', 'utf8') || '{}');
Present(config);