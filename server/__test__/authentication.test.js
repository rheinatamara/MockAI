const authentication = require("../middlewares/authentication");
const { User } = require("../models");
const { verify } = require("../helpers/jwt");

jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../helpers/jwt", () => ({
  verify: jest.fn(),
}));

describe("Authentication Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 401 if no authorization header is provided", async () => {
    await authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: "UNAUTHORIZED",
      message: "Unauthorized Error",
    });
  });

  test("should return 401 if authorization header is invalid", async () => {
    mockReq.headers.authorization = "InvalidToken";

    await authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: "UNAUTHORIZED",
      message: "Unauthorized Error",
    });
  });

  test("should return 401 if token verification fails", async () => {
    mockReq.headers.authorization = "Bearer invalidtoken";
    verify.mockImplementation(() => {
      throw {
        name: "UNAUTHORIZED",
        message: "Invalid Token",
      };
    });

    await authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: "UNAUTHORIZED",
      message: "Invalid Token",
    });
  });

  test("should return 404 if user is not found", async () => {
    mockReq.headers.authorization = "Bearer validtoken";
    verify.mockReturnValue({ id: 1 });
    User.findOne.mockResolvedValue(null);

    await authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: "NOTFOUND",
      message: "User not found",
    });
  });

  test("should set req.user and call next() if authentication succeeds", async () => {
    mockReq.headers.authorization = "Bearer validtoken";
    verify.mockReturnValue({ id: 1 });
    User.findOne.mockResolvedValue({ id: 1 });

    await authentication(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual({ userId: 1 });
    expect(mockNext).toHaveBeenCalledWith();
  });
});
