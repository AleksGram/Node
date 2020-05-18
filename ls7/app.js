const express = require("express");
const mongoose = require("mongoose");
const { join } = require("path");
const { log_module } = require("./log_module")
const message_module = require("./messages");
const template_module = require("./templates_module");
const { connectToDb } = require("./db_connection");
const { useTemplates } = require("./templateSettings");

const server = express();

connectToDb();

// available options: "nunjucks", "ejs", "pug"
useTemplates("nunjucks", server);

server.all('*', log_module);


server.use(express.static(join(__dirname, "assets")));

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

server.use(message_module);

server.use(template_module);

server.use(function(err, req, res, next) {
  res.status(err.code || 400).send({ message: err.message || err });
});


const PORT = process.env.PORT || 2525;
server.listen(PORT, "localhost", () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = server;
