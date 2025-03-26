const express = require("express");
const Controller = require("../controllers/controller");

const user = express.Router();

user.post("/register", Controller.register);
user.post("/login", Controller.login);

// mungkin nanti akan bikin endpoint untuk upload foto profil, tp tergantung waktu

module.exports = user;
