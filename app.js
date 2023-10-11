const express = require("express");
const app = express();
const dotenv = require("dotenv");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

////////////////////////////////
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const NftRoutes = require("./routes/nftRoutes");
const UserRoutes = require("./routes/userRoutes");

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
app.use(express.json());

dotenv.config({ path: "./.env" });

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

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

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
