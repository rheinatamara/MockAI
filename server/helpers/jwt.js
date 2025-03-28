const jwt = require("jsonwebtoken");
const JWT_SECRET = "fallback_secret";
function sign(payload) {
  return jwt.sign(payload, JWT_SECRET);
}
function verify(payload) {
  return jwt.verify(payload, JWT_SECRET);
}

module.exports = {
  sign,
  verify,
};
