const fs = require('fs');
const path = require('path');


// Rename `proxy` in package.json to the Docker backend server
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
packageJson.proxy = 'http://backend:5000';
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

// Set `HOST` in .env.development to the Docker frontend server
const filePath = path.join(__dirname, '.env.development');
const feVal = "HOST=http://frontend:3000\n";
fs.writeFileSync(filePath, feVal);
console.log(`Wrote to ${filePath}!`, feVal);
