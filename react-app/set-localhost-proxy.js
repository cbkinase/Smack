const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
packageJson.proxy = 'http://localhost:5000';
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
