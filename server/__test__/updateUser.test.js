const request = require("supertest");
const app = require("../app"); // Adjust the path as needed
const { User } = require("../models");
const jwt = require("jsonwebtoken");

jest.mock("../models");

describe("PUT /user - Update User Profile", () => {
  let token;
  let mockUser;

  beforeEach(() => {
    // Mock user data
    mockUser = {
      id: 1,
      email: "oldemail@example.com",
      password: "hashedpassword",
      save: jest.fn().mockResolvedValue(),
    };

    const JWT_SECRET = process.env.SECRET_KEY || "fallback_secret";
    token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: "1h" });

    // Mock User.findByPk and log calls
    User.findByPk = jest.fn(async (id) => {
      console.log("User.findByPk called with:", id);
      return id === mockUser.id ? mockUser : null;
    });
  });

  //   it("should update user profile successfully", async () => {
  //     const newProfileData = {
  //       email: "newemail@example.com",
  //       password: "newpassword",
  //     };

  //     const response = await request(app)
  //       .put("/user")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send(newProfileData);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       message: "Profile updated successfully",
  //     });
  //     expect(mockUser.email).toBe(newProfileData.email);
  //     expect(mockUser.save).toHaveBeenCalled();
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

    User.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/user")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({ email: "newemail@example.com" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
