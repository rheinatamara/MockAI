const { decode, encode } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");
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
  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client();
      const { googleToken } = req.body;
      console.log(googleToken, "<<<");
      if (!googleToken) {
        throw { name: "BADREQUEST", message: "Google token is required" };
      }
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log(payload);
      const [user] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          name: payload.name,
          email: payload.email,
          password: `${Math.random()}+${Date.now()}`,
        },
      });
      const access_token = sign({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
  static async updateProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const { email, password } = req.body;
      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "NOTFOUND", message: "User not found" };
      }
      if (email) user.email = email;
      if (password) user.password = encode(password);
      await user.save();
      res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error in updateProfile:", error);
      next(error);
    }
  }
  static async getProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const user = await User.findByPk(userId);

      res.status(200).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      console.error("Error in getProfile:", error);
      next(error);
    }
  }
}
module.exports = Controller;
