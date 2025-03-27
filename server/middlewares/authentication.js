const { User } = require("../models");
const { verify } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    console.log("APAKAH INI MASUK? 1");
    if (!authorization) {
      throw { name: "UNAUTHORIZED", message: "Unauthorized Error" };
    }

    const rawToken = authorization.split(" ");
    if (rawToken[0] !== "Bearer" || !rawToken[1]) {
      throw { name: "UNAUTHORIZED", message: "Unauthorized Error" };
    }
    console.log("APAKAH INI MASUK? 2");

    let payload;
    try {
      payload = verify(rawToken[1]);
      console.log("APAKAH INI MASUK? 3");
    } catch (err) {
      throw { name: "UNAUTHORIZED", message: "Invalid Token" };
    }
    const foundUser = await User.findOne({
      where: {
        id: payload.id,
      },
    });
    console.log("APAKAH INI MASUK? 4");

    if (!foundUser) {
      throw { name: "NOTFOUND", message: "User not found" };
    }
    req.user = {
      userId: foundUser.id,
    };
    console.log("DEBUGGING");

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
