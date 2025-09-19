const os = require("os");
const path = require("path");
const crypto = require("crypto");

const fingerprint = crypto
  .createHash("sha256")
  .update(os.hostname() + os.userInfo().username + __dirname)
  .digest("hex");

module.exports = fingerprint;
