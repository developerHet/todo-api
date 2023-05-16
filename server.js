const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

const users = require("./routes/users");
const todos = require("./routes/todos");

dontenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "'unsafe-hashes' 'sha256-RFWPLDbv2BY+rCkDzsE+0fr8ylGr2R2faWMhq4lfEQc="
  );
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", users);
app.use("/api/todos", todos);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process
  server.close(() => process.exit(1));
});
