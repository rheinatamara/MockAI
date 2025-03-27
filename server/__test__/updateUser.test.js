// require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");
const jwt = require("jsonwebtoken");

describe("PUT /user - Update User Profile", () => {
  let token;
  let mockUser;

  beforeAll(async () => {
    // Sync database and insert a mock user
    mockUser = await User.create({
      name: "John Doe",
      email: "oldemail@example.com",
      password: "hashedpassword", // Assume password is already hashed
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

  it("should update user profile successfully", async () => {
    const newProfileData = {
      email: "newemail@example.com",
      password: "newpassword",
    };
    console.log(token, "<<< ini token");

    const response = await request(app)
      .put("/update")
      .set("Authorization", `Bearer ${token}`)
      .send(newProfileData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Profile updated successfully",
    });

    // Verify the user was updated in the database
    const updatedUser = await User.findByPk(mockUser.id);
    expect(updatedUser.email).toBe(newProfileData.email);
  });
});
