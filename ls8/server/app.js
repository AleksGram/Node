const express = require("express");
const { join } = require("path");
// const cookieSession = require("cookie-session");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo")(session);
const api = require("./api/index");
const { connectToDb } = require("./dbConnection");
const { env, argv, platform } = process;
const { log_module } = require("./api/log_module");

require('dotenv').config()

console.log("NODE_ENV:", !!Number(env.NODE_ENV));

const server = express();
connectToDb();

server.use(cors({
  origin: 'http://localhost:2530',
  credentials: true
}));


server.use(
  // cookieSession({
  //   name: "session",
  //   // Тоже так никогда не делайте!
  //   keys: ["secret string"],
  //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
  // })
  session({
    secret: "secret string",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
  })
);


server.use(express.json());
if (!!Number(env.NODE_ENV)) {
  server.use(log_module)
}

server.use("/api", api);

server.use(function (err, req, res, next) {
  res.status(err.code || 400).send({ message: err.message || err });
});


const PORT = process.env.PORT || 2525;
server.listen(PORT, "localhost", () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = server;
