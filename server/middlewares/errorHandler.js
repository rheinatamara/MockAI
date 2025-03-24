const errorHandler = async (err, req, res, next) => {
  let code = 500;
  let message = "Internal server error";
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    code = 400;
    message = err.errors.map((error) => {
      return error.message;
    });
  } else if (err.name === "BADREQUEST") {
    code = 400;
    message = err.message;
  } else if (err.name === "NOTFOUND") {
    code = 404;
    message = err.message;
  } else if (err.name === "FORBIDDEN") {
    code = 403;
    message = err.message;
  } else if (err.name === "UNAUTHORIZED") {
    code = 401;
    message = err.message;
  }
  return res.status(code).json({ message });
};

module.exports = errorHandler;
