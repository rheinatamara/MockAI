const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { decode, encode } = require("../helpers/bcrypt");
const { sign, verify } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

jest.mock("../models", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findOrCreate: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock("../helpers/bcrypt", () => ({
  decode: jest.fn(),
  encode: jest.fn(),
}));

jest.mock("../helpers/jwt", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn(),
}));

describe("GET /", () => {
  it("should return 200 and 'Hello world'", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello world");
  });
});
describe("POST /register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user and return 201 with user data", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    User.create.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: mockUser.id,
      email: mockUser.email,
    });
    expect(User.create).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should return 500 if an error occurs", async () => {
    User.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and access_token if Google login is successful", async () => {
    const mockVerifyIdToken = jest.fn().mockResolvedValue({
      getPayload: () => ({
        email: "test@example.com",
        name: "Test User",
      }),
    });
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }));

    const mockUser = { id: 1, email: "test@example.com" };
    const mockToken = "mockAccessToken";

    User.findOrCreate.mockResolvedValue([mockUser]);
    sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post("/google-login")
      .send({ googleToken: "mockGoogleToken" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ access_token: mockToken });
    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: "mockGoogleToken",
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    expect(User.findOrCreate).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      defaults: {
        name: "Test User",
        email: "test@example.com",
        password: expect.any(String),
      },
    });
    expect(sign).toHaveBeenCalledWith({ id: mockUser.id });
  });
  it("should return 400 if email or password is missing", async () => {
    const response = await request(app).post("/login").send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email and password are required",
    });
  });

  it("should return 401 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email / password" });
  });

  it("should return 401 if password is invalid", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    };
    User.findOne.mockResolvedValue(mockUser);
    decode.mockReturnValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email / password" });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and access_token if login is successful", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    };
    User.findOne.mockResolvedValue(mockUser);
    decode.mockReturnValue(true);
    sign.mockReturnValue("mockAccessToken");

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ access_token: "mockAccessToken" });
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(decode).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(sign).toHaveBeenCalledWith({ id: mockUser.id });
  });

  it("should return 400 if email or password is missing", async () => {
    const response = await request(app).post("/login").send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email and password are required",
    });
  });

  it("should return 401 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email / password" });
  });

  it("should return 401 if password is invalid", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    };
    User.findOne.mockResolvedValue(mockUser);
    decode.mockReturnValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email / password" });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});

describe("POST /google-login", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully login with a valid Google token", async () => {
    // Mock Google token verification
    const mockVerifyIdToken = jest.fn().mockResolvedValue({
      getPayload: () => ({
        email: "test@example.com",
        name: "Test User",
      }),
    });

    // Setup OAuth2Client mock
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }));

    // Mock user findOrCreate
    const mockUser = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
    };
    User.findOrCreate.mockResolvedValue([mockUser]);

    // Mock JWT sign
    const mockAccessToken = "mock-access-token";
    sign.mockReturnValue(mockAccessToken);

    // Send request
    const response = await request(app)
      .post("/google-login")
      .send({ googleToken: "valid-google-token" });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ access_token: mockAccessToken });

    // Verify method calls
    expect(OAuth2Client).toHaveBeenCalled();
    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: "valid-google-token",
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    expect(User.findOrCreate).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      defaults: {
        name: "Test User",
        email: "test@example.com",
        password: expect.any(String),
      },
    });
    expect(sign).toHaveBeenCalledWith({ id: mockUser.id });
  });

  it("should return 400 if Google token is missing", async () => {
    const response = await request(app).post("/google-login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Google token is required" });
  });

  it("should handle errors during Google token verification", async () => {
    // Mock Google token verification to throw an error
    const mockVerifyIdToken = jest
      .fn()
      .mockRejectedValue(new Error("Verification failed"));

    // Setup OAuth2Client mock
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }));

    const response = await request(app)
      .post("/google-login")
      .send({ googleToken: "invalid-token" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  it("should create a new user if not exists during Google login", async () => {
    const mockVerifyIdToken = jest.fn().mockResolvedValue({
      getPayload: () => ({
        email: "newuser@example.com",
        name: "New User",
      }),
    });

    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }));

    const mockNewUser = {
      id: 2,
      email: "newuser@example.com",
      name: "New User",
    };
    User.findOrCreate.mockResolvedValue([mockNewUser]);

    const mockAccessToken = "new-user-token";
    sign.mockReturnValue(mockAccessToken);

    const response = await request(app)
      .post("/google-login")
      .send({ googleToken: "new-user-token" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ access_token: mockAccessToken });

    expect(User.findOrCreate).toHaveBeenCalledWith({
      where: { email: "newuser@example.com" },
      defaults: {
        name: "New User",
        email: "newuser@example.com",
        password: expect.any(String),
      },
    });
  });
});

describe("GET /user", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // it("should return 200 and user profile if user exists", async () => {
  //   const mockUser = { id: 1, email: "test@example.com" };

  //   verify.mockReturnValue({ id: 1 }); // Simulasi token valid
  //   User.findByPk.mockResolvedValue(mockUser);

  //   const response = await request(app)
  //     .get("/user")
  //     .set("Authorization", "Bearer mockAccessToken");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(mockUser);
  //   expect(User.findByPk).toHaveBeenCalledWith(1, {
  //     attributes: ["id", "email"],
  //   });
  // });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/user"); // Tidak ada Authorization header

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized Error" });
  });

  it("should return 401 if token is invalid", async () => {
    verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const response = await request(app)
      .get("/user")
      .set("Authorization", "Bearer invalidToken");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Token" });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    verify.mockReturnValue({ id: 1 }); // Token valid
    User.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/user")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
