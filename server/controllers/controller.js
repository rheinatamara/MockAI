const { decode } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");
const { User } = require("../models");
class Controller {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "BADREQUEST",
          message: "Email and password are required",
        };
      }

      const found = await User.findOne({ where: { email } });
      if (!found) {
        throw { name: "UNAUTHORIZED", message: "Invalid email / password" };
      }

      const isValidPassword = decode(password, found.password);

      if (!isValidPassword) {
        throw { name: "UNAUTHORIZED", message: "Invalid email / password" };
      }
      const access_token = sign({ id: found.id });
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error, "<<<");
      next(error);
    }
  }
}
module.exports = Controller;
