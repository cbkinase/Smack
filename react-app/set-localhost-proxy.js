const fs = require("fs");
const path = require("path");

// Rename `proxy` in package.json to the local backend server
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
packageJson.proxy = "http://localhost:5000";
fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

// Remove `HOST` from .env.development if it exists
const filePath = path.join(__dirname, ".env.development");
fs.writeFileSync(filePath, "");
