const request = require("supertest");
const app = require("../app"); // Adjust the path as needed
const { User } = require("../models");
const jwt = require("jsonwebtoken");

jest.mock("../models");

describe("GET /user - Get User Profile", () => {
  let token;
  let mockUser;

  beforeEach(() => {
    // Mock user data
    mockUser = {
      id: 4,
      email: "rhein@mail.com",
    };

    const JWT_SECRET = process.env.SECRET_KEY || "fallback_secret";
    token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: "1h" });

    // Mock User.findByPk
    User.findByPk = jest.fn(async (id) => {
      console.log("Mocked User.findByPk called with:", id);
      return id === mockUser.id ? mockUser : null;
    });
  });

  //   it("should return user profile successfully", async () => {
  //     const response = await request(app)
  //       .get("/user")
  //       .set("Authorization", `Bearer ${token}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       id: mockUser.id,
  //       email: mockUser.email,
  //     });
  //   });

  it("should return 404 if user is not found", async () => {
    // Generate a token with a non-existent user ID
    const invalidToken = jwt.sign(
      { userId: 9999 },
      process.env.SECRET_KEY || "fallback_secret",
      {
        expiresIn: "1h",
      }
    );

    User.findByPk.mockResolvedValue(null); // Simulate user not found

    const response = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(404);
  });
});
