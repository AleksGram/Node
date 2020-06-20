const express = require("express");
const { join } = require("path");
const { log_module } = require("./log_module")
const message_module = require("./messages");

const server = express();

server.all('*', log_module);


server.use(express.static(join(__dirname, "assets")));



server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.locals.messages = [];


server.use(message_module);

server.use(function(err, req, res, next) {
  res.status(err.code || 400).send({ message: err.message || err });
});


const PORT = process.env.PORT || 2525;
server.listen(PORT, "localhost", () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = server;
