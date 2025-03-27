const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");
const jwt = require("jsonwebtoken");

describe("GET /user - Get User Profile", () => {
  let token;
  let mockUser;
  beforeAll(async () => {
    mockUser = await User.create({
      name: "John Doe",
      email: "oldemail@example.com",
      password: "hashedpassword",
    });
    console.log(mockUser, "<<< ini mockUser");

    const JWT_SECRET = "fallback_secret";
    token = jwt.sign({ id: mockUser.id }, JWT_SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    // Clean up the database
    await User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  });

  it("should return user profile successfully", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: mockUser.id,
      email: mockUser.email,
    });
  });
});
