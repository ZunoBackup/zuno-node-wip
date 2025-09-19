const { loadWallet } = require("./lib/config");
const { validateAndRefresh } = require("./lib/tokenFlow");

const walletId = loadWallet();
validateAndRefresh(walletId);
