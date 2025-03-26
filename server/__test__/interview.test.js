const request = require("supertest");
const app = require("../app");
const { Interview, Feedback } = require("../models");
const { verify, sign } = require("../helpers/jwt");

jest.mock("../models", () => ({
  Interview: {
    findAll: jest.fn(),
  },
  Feedback: {}, // Add mock for Feedback model
}));
jest.mock("../helpers/jwt", () => {
  const originalModule = jest.requireActual("../helpers/jwt");
  return {
    ...originalModule,
    verify: jest.fn(),
    sign: jest.fn(),
  };
});

describe("GET /interview/active", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //   it("should return 200 and a list of active interviews when a valid JWT token is provided", async () => {
  //     const mockInterviews = [
  //       {
  //         id: 1,
  //         role: "Frontend Developer",
  //         level: "Mid-level",
  //         techstack: ["React", "JavaScript"],
  //         finalized: false,
  //         createdAt: "2023-03-01T00:00:00.000Z",
  //       },
  //     ];

  //     verify.mockReturnValue({ id: 1 }); // Pastikan ini digunakan setelah mock

  //     Interview.findAll.mockResolvedValue(mockInterviews);

  //     const response = await request(app)
  //       .get("/interview/active")
  //       .set("Authorization", "Bearer mockValidToken"); // Simulate Bearer token

  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual(mockInterviews);
  //     expect(verify).toHaveBeenCalledWith("mockValidToken");
  //   });

  it("should return 401 if no Authorization token is provided", async () => {
    const response = await request(app).get("/interview/active");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized Error" });
  });

  it("should return 401 if the token is invalid", async () => {
    // Mock JWT verification to throw an error
    verify.mockImplementation(() => {
      throw new Error("Invalid Token");
    });

    const response = await request(app)
      .get("/interview/active")
      .set("Authorization", "Bearer mockInvalidToken"); // Simulate invalid token

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Token" });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    // Mock JWT verification
    verify.mockReturnValue({ id: 1 });

    // Mock database query to throw an error
    Interview.findAll.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/interview/active")
      .set("Authorization", "Bearer mockValidToken"); // Simulate Bearer token

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
describe("GET /interview/completed", () => {
  let validToken;
  let mockUserId;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock user ID and token
    mockUserId = 1;
    validToken = sign({ id: mockUserId });

    // Default mock implementation for token verification
    verify.mockReturnValue({ id: mockUserId });
  });

  //   it("should return 200 and completed interviews with feedback", async () => {
  //     // Mock completed interviews with feedback
  //     const mockCompletedInterviews = [
  //       {
  //         id: 1,
  //         userId: mockUserId,
  //         finalized: true,
  //         companyName: "Tech Corp",
  //         createdAt: new Date(),
  //         Feedback: {
  //           id: 101,
  //           totalScore: 85,
  //           createdAt: new Date(),
  //         },
  //       },
  //       {
  //         id: 2,
  //         userId: mockUserId,
  //         finalized: true,
  //         companyName: "Innovative Solutions",
  //         createdAt: new Date(),
  //         Feedback: {
  //           id: 102,
  //           totalScore: 90,
  //           createdAt: new Date(),
  //         },
  //       },
  //     ];

  //     // Setup findAll mock
  //     Interview.findAll.mockResolvedValue(mockCompletedInterviews);

  //     // Send request
  //     const response = await request(app)
  //       .get("/interview/completed")
  //       .set("Authorization", `Bearer ${validToken}`);

  //     // Assertions
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual(mockCompletedInterviews);

  //     // Verify method calls
  //     expect(Interview.findAll).toHaveBeenCalledWith({
  //       where: {
  //         userId: mockUserId,
  //         finalized: true,
  //       },
  //       include: [
  //         {
  //           model: Feedback,
  //           attributes: ["id", "totalScore", "createdAt"],
  //         },
  //       ],
  //       order: [["createdAt", "DESC"]],
  //     });
  //   });

  //   it("should return 200 with empty array if no completed interviews exist", async () => {
  //     // Mock empty interviews list
  //     Interview.findAll.mockResolvedValue([]);

  //     // Send request
  //     const response = await request(app)
  //       .get("/interview/completed")
  //       .set("Authorization", `Bearer ${validToken}`);

  //     // Assertions
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual([]);

  //     // Verify method calls
  //     expect(Interview.findAll).toHaveBeenCalledWith({
  //       where: {
  //         userId: mockUserId,
  //         finalized: true,
  //       },
  //       include: [
  //         {
  //           model: Feedback,
  //           attributes: ["id", "totalScore", "createdAt"],
  //         },
  //       ],
  //       order: [["createdAt", "DESC"]],
  //     });
  //   });

  it("should return 401 if no authorization token is provided", async () => {
    // Send request without token
    const response = await request(app).get("/interview/completed");

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized Error" });
  });

  it("should return 401 if invalid token is provided", async () => {
    // Mock token verification to throw an error
    verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Send request with invalid token
    const response = await request(app)
      .get("/interview/completed")
      .set("Authorization", "Bearer invalidtoken");

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Token" });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    // Mock findAll to throw an error
    Interview.findAll.mockRejectedValue(new Error("Database error"));

    // Send request
    const response = await request(app)
      .get("/interview/completed")
      .set("Authorization", `Bearer ${validToken}`);

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
