const express = require("express");

const user = express.Router();

user.post("/add-user");
user.post("/login");

module.exports = user;
