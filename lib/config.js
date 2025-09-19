const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

// Load environment variables
require("dotenv").config({ quiet: true });

const TOKEN_PATH = path.join(__dirname, "..", ".token.enc");
const WALLET_PATH = path.join(__dirname, "..", "mywallet.txt");
const MAX_RETRIES = 2;

// Enforce presence of BASE_URL
if (!process.env.ZUNO_API_URL) {
  console.error("❌ Missing ZUNO_API_URL in .env file.");
  process.exit(1);
}
const BASE_URL = process.env.ZUNO_API_URL;

const SECRET = crypto
  .createHash("sha256")
  .update(os.hostname() + path.join(__dirname, ".."))
  .digest();

function loadWallet() {
  if (!fs.existsSync(WALLET_PATH)) {
    console.error("❌ mywallet.txt not found.");
    process.exit(1);
  }
  return fs.readFileSync(WALLET_PATH, "utf8").trim();
}

module.exports = {
  BASE_URL,
  TOKEN_PATH,
  WALLET_PATH,
  MAX_RETRIES,
  SECRET,
  loadWallet,
};
