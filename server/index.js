const express = require("express");
const routes = require("../routes");

const server = express();

const bodyParser = require("body-parser");

server.use(express.json());

server.use(bodyParser.urlencoded({ extended: false }));

server.use("/api", routes);

module.exports = server;
