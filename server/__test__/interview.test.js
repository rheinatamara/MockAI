const request = require("supertest");
const app = require("../app");
const { Interview, Feedback, User } = require("../models");
const { verify, sign } = require("../helpers/jwt");
const { GoogleGenerativeAI } = require("@google/generative-ai");

jest.mock("../models", () => ({
  Interview: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
  Feedback: {
    create: jest.fn(),
  },
}));

jest.mock("../helpers/jwt", () => ({
  sign: jest.fn((payload) => `mockedToken.${payload.id}`),
  verify: jest.fn((token) => {
    if (token.startsWith("mockedToken")) {
      return { id: 1 }; // Mock user ID
    }
    throw new Error("Invalid Token");
  }),
}));

jest.mock("@google/generative-ai", () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: jest
        .fn()
        .mockResolvedValue(
          JSON.stringify([
            "Describe a time you faced a challenging technical problem while working on a project. What steps did you take to troubleshoot and resolve it?",
            "Tell me about a situation where you had to learn a new technology or skill quickly. How did you approach the learning process?",
            "Describe a time you had to work with a team to complete a project. What was your role, and how did you contribute to the team's success?",
            "Give an example of a time you received constructive criticism on your code or work. How did you react, and what did you learn from the experience?",
            "Describe a situation where you made a mistake on a project. What did you do to address the mistake, and what did you learn from it?",
          ])
        ),
    },
  });

  const mockGenAI = {
    getGenerativeModel: jest.fn(() => ({
      generateContent: mockGenerateContent,
    })),
  };

  return {
    GoogleGenerativeAI: jest.fn(() => mockGenAI),
  };
});

describe("POST /interview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.findOne.mockResolvedValue({
      id: 1,
      email: "test@example.com",
    }); // Mock user for JWT verification
  });
  afterAll(async () => {
    jest.clearAllMocks();
  });

  it("should return 201 and create an interview", async () => {
    const mockRequestBody = {
      type: "behavioral",
      role: "Frontend Developer",
      level: "Junior",
      techstack: "React, Node.js",
      amount: 5,
    };

    const expectedResponse = {
      id: 22,
      ...mockRequestBody,
      techstack: ["React", "Node.js"],
      questions: [
        "Describe a time you faced a challenging technical problem while working on a project. What steps did you take to troubleshoot and resolve it?",
        "Tell me about a situation where you had to learn a new technology or skill quickly. How did you approach the learning process?",
        "Describe a time you had to work with a team to complete a project. What was your role, and how did you contribute to the team's success?",
        "Give an example of a time you received constructive criticism on your code or work. How did you react, and what did you learn from the experience?",
        "Describe a situation where you made a mistake on a project. What did you do to address the mistake, and what did you learn from it?",
      ],
      userId: 1,
      finalized: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    Interview.create.mockImplementation(async (data) => {
      return expectedResponse;
    });

    const response = await request(app)
      .post("/interview")
      .set("Authorization", "Bearer mockedToken")
      .send(mockRequestBody);

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expectedResponse);
  });

  it("should return 401 if no authorization token is provided", async () => {
    const response = await request(app).post("/interview").send({
      type: "behavioral",
      role: "Frontend Developer",
      level: "Junior",
      techstack: "React, Node.js",
      amount: 5,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized Error" });
  });

  it("should return 401 if the token is invalid", async () => {
    verify.mockImplementation(() => {
      throw new Error("Invalid Token");
    });

    const response = await request(app)
      .post("/interview")
      .set("Authorization", "Bearer invalidToken")
      .send({
        type: "behavioral",
        role: "Frontend Developer",
        level: "Junior",
        techstack: "React, Node.js",
        amount: 5,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Token" });
  });

  // it("should return 500 if an unexpected error occurs", async () => {
  //   Interview.create.mockRejectedValue(new Error("Database error"));

  //   const response = await request(app)
  //     .post("/interview")
  //     .set("Authorization", "Bearer mockedToken")
  //     .send({
  //       type: "behavioral",
  //       role: "Frontend Developer",
  //       level: "Junior",
  //       techstack: "React, Node.js",
  //       amount: 5,
  //     });

  //   expect(response.status).toBe(500);
  //   expect(response.body).toEqual({ message: "Internal server error" });
  // });
});

describe("GET /interview/:interviewId", () => {
  beforeEach(() => {
    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
  });

  it("should return 200 and interview details", async () => {
    const mockInterview = {
      id: 1,
      role: "Frontend Developer",
      level: "Mid-level",
      techstack: ["React", "JavaScript"],
      finalized: false,
      createdAt: "2023-03-01T00:00:00.000Z",
      createdAt: new Date().toISOString(),
      Feedback: {
        id: 101,
        totalScore: 85,
        categoryScores: { technical: 90, communication: 80 },
        strengths: "Strong in React",
        areasForImprovement: "Needs better system design skills",
        finalAssessment: "Recommended",
        createdAt: new Date().toISOString(),
      },
    };
    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    Interview.findAll.mockResolvedValue(mockInterview);

    const response = await request(app)
      .get("/interview/active")
      .set("Authorization", "Bearer mockValidToken");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockInterview);
  });
  describe("GET /interview/:interviewId", () => {
    beforeEach(() => {
      verify.mockReturnValue({ id: 1, email: "test@example.com" });
      User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
    });

    it("should return 200 and interview details", async () => {
      const mockInterview = {
        id: 1,
        role: "Frontend Developer",
        level: "Mid-level",
        techstack: ["React", "JavaScript"],
        finalized: false,
        createdAt: "2023-03-01T00:00:00.000Z",
        createdAt: new Date().toISOString(),
        Feedback: {
          id: 101,
          totalScore: 85,
          categoryScores: { technical: 90, communication: 80 },
          strengths: "Strong in React",
          areasForImprovement: "Needs better system design skills",
          finalAssessment: "Recommended",
          createdAt: new Date().toISOString(),
        },
      };
      verify.mockReturnValue({ id: 1, email: "test@example.com" });
      Interview.findAll.mockResolvedValue(mockInterview);

      const response = await request(app)
        .get("/interview/active")
        .set("Authorization", "Bearer mockValidToken");

      console.log("Response Body:", response.body);
      console.log("Response Status:", response.status);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockInterview);
    });
    it("should return 404 when interview is not found", async () => {
      Interview.findAll.mockResolvedValue(null);
      const response = await request(app)
        .get("/interview/99999")
        .set("Authorization", "Bearer mockValidToken");

      console.log("Response Body:", response.body);
      console.log("Response Status:", response.status);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Interview not found",
      });
    });
  });
});

// DELETE

describe("DELETE /interview/:interviewId", () => {
  beforeEach(() => {
    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
  });

  it("should return 200 and delete interview successfully", async () => {
    const mockInterview = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(),
    };

    Interview.findByPk.mockResolvedValue(mockInterview);

    const response = await request(app)
      .delete("/interview/1")
      .set("Authorization", "Bearer mockValidToken");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Interview deleted successfully",
    });
    expect(mockInterview.destroy).toHaveBeenCalled();
  });

  it("should return 404 if interview is not found", async () => {
    Interview.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .delete("/interview/1")
      .set("Authorization", "Bearer mockValidToken");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Interview not found" });
  });
});

describe("GET /interview/active", () => {
  beforeEach(() => {
    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a list of active interviews when a valid JWT token is provided", async () => {
    const mockInterviews = [
      {
        id: 1,
        role: "Frontend Developer",
        level: "Mid-level",
        techstack: ["React", "JavaScript"],
        finalized: false,
        createdAt: "2023-03-01T00:00:00.000Z",
      },
    ];

    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    Interview.findAll.mockResolvedValue(mockInterviews);

    const response = await request(app)
      .get("/interview/active")
      .set("Authorization", "Bearer mockValidToken");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockInterviews);
  });

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

  it("should return 200 and completed interviews with feedback", async () => {
    const mockCompletedInterviews = [
      {
        id: 1,
        userId: mockUserId,
        finalized: true,
        companyName: "Tech Corp",
        createdAt: new Date().toISOString(),
        Feedback: {
          id: 101,
          totalScore: 85,
          createdAt: new Date().toISOString(),
        },
      },
      {
        id: 2,
        userId: mockUserId,
        finalized: true,
        companyName: "Innovative Solutions",
        createdAt: new Date().toISOString(),
        Feedback: {
          id: 102,
          totalScore: 90,
          createdAt: new Date().toISOString(),
        },
      },
    ];

    Interview.findAll.mockResolvedValue(mockCompletedInterviews);

    const response = await request(app)
      .get("/interview/completed")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCompletedInterviews);

    expect(Interview.findAll).toHaveBeenCalledWith({
      where: {
        userId: mockUserId,
        finalized: true,
      },
      include: [
        {
          model: Feedback,
          attributes: ["id", "totalScore", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

  it("should return 200 with empty array if no completed interviews exist", async () => {
    // Mock empty interviews list
    Interview.findAll.mockResolvedValue([]);

    // Send request
    const response = await request(app)
      .get("/interview/completed")
      .set("Authorization", `Bearer ${validToken}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    // Verify method calls
    expect(Interview.findAll).toHaveBeenCalledWith({
      where: {
        userId: mockUserId,
        finalized: true,
      },
      include: [
        {
          model: Feedback,
          attributes: ["id", "totalScore", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

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
