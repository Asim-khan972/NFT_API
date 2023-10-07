// server.js

const express = require("express");
const app = express();
const dotenv = require("dotenv");

const morgan = require("morgan");
const NftRoutes = require("./routes/nftRoutes");
const UserRoutes = require("./routes/userRoutes");
app.use(express.json());

dotenv.config({ path: "./.env" });

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// console.log(`${__dirname}/data/nft-simple.json`);
// console.log(nfts);
///////////// get all nfts

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//// middleware

app.use("/api/v1/nfts", NftRoutes);
app.use("/api/v1/users", UserRoutes);

// Start the server

module.exports = app;
