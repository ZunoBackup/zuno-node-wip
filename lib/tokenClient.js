const axios = require("axios");
const { BASE_URL } = require("./config");
const fingerprint = require("./fingerprint");

async function requestToken(walletId, action = "connect") {
  return axios.post(
    `${BASE_URL}/token.php`,
    new URLSearchParams({ wallet_id: walletId, fingerprint, action }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
}

async function validateToken(token) {
  return axios.post(
    `${BASE_URL}/validate.php`,
    new URLSearchParams({ token, fingerprint }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
}

module.exports = { requestToken, validateToken };
