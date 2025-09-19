const { encryptToken, decryptToken } = require("./token");
const { requestToken, validateToken } = require("./tokenClient");
const { MAX_RETRIES } = require("./config");

let retries = 0;
const isDebug = process.argv.includes("--debug");

async function validateAndRefresh(walletId) {
  const token = decryptToken();
  if (isDebug) {
    console.log("🔧 Validating token:", token);
  }

  if (!token) {
    if (retries >= MAX_RETRIES) {
      console.error("❌ Token creation failed after multiple attempts.");
      return;
    }
    console.log("🔍 No token found. Requesting initial token...");
    retries++;
    const res = await requestToken(walletId, "connect");
    handleTokenResponse(res);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return validateAndRefresh(walletId);
  }

  try {
    const res = await validateToken(token);
    if (res.data.status === "valid") {
      console.log("✅ Token validated. Previous token expired or invalid.");
      console.log("🔄 New token issued:", res.data.new_token);
      encryptToken(res.data.new_token);
      retries = 0;
    } else if (res.data.error === "Token expired") {
      if (retries >= MAX_RETRIES) {
        console.error(
          "❌ Token expired and reissue failed after multiple attempts."
        );
        return;
      }
      console.log("🔁 Token expired. Requesting new token...");
      retries++;
      const res = await requestToken(walletId, "refresh");
      handleTokenResponse(res);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return validateAndRefresh(walletId);
    } else {
      console.log("❌ Validation failed:", res.data.error);
    }
  } catch (err) {
    handleError(err);
  }
}

function handleTokenResponse(res) {
  if (res.data.token) {
    console.log("🆕 Initial token received:", res.data.token);
    encryptToken(res.data.token);
  } else {
    console.log("❌ Token request failed:", res.data.error);
  }
}

function handleError(err) {
  if (err.response) {
    console.error("❌ Server responded with status:", err.response.status);
    console.error("❌ Response body:", err.response.data);
  } else if (err.request) {
    console.error("❌ No response received. Request details:", err.request);
  } else {
    console.error("❌ Unexpected error:", err.message);
  }
}

module.exports = { validateAndRefresh };
