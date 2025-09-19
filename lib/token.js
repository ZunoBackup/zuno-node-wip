const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { TOKEN_PATH, SECRET } = require("./config");

function encryptToken(token) {
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    SECRET,
    Buffer.alloc(16, 0)
  );
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  fs.writeFileSync(TOKEN_PATH, encrypted);
}

function decryptToken() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const encrypted = fs.readFileSync(TOKEN_PATH);
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    SECRET,
    Buffer.alloc(16, 0)
  );
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString();
}

module.exports = { encryptToken, decryptToken };
