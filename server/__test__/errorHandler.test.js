const errorHandler = require("../middlewares/errorHandler");

describe("Error Handler Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  test("should return 500 for unhandled errors", async () => {
    const err = new Error("Something went wrong");

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });

  test("should return 400 for SequelizeValidationError", async () => {
    const err = {
      name: "SequelizeValidationError",
      errors: [{ message: "Validation failed" }],
    };

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ["Validation failed"],
    });
  });

  test("should return 400 for SequelizeUniqueConstraintError", async () => {
    const err = {
      name: "SequelizeUniqueConstraintError",
      errors: [{ message: "Email must be unique" }],
    };

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: ["Email must be unique"],
    });
  });

  test("should return 400 for BADREQUEST", async () => {
    const err = { name: "BADREQUEST", message: "Bad request error" };

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Bad request error" });
  });

  test("should return 404 for NOTFOUND", async () => {
    const err = { name: "NOTFOUND", message: "Resource not found" };

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Resource not found",
    });
  });

  test("should return 403 for FORBIDDEN", async () => {
    const err = { name: "FORBIDDEN", message: "Forbidden access" };

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden access" });
  });

  test("should return 401 for UNAUTHORIZED", async () => {
    const err = { name: "UNAUTHORIZED", message: "Unauthorized Error" };

    await errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthorized Error",
    });
  });
});
