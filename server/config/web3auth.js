const { Web3Auth } = require("@web3auth/node-sdk");

const web3auth = new Web3Auth({
  clientId: process.env.WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
});

module.exports = web3auth;