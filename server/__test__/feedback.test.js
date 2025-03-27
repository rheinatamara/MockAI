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
  }, // Add mock for Feedback model
}));

jest.mock("../helpers/jwt", () => ({
  sign: jest.fn((payload) => `mockedToken.${payload.id}`),
  verify: jest.fn((token) => {
    if (token.startsWith("mockedToken")) {
      return { userId: 1 }; // ✅ Updated to match `req.user.userId`
    }
    throw new Error("Invalid Token");
  }),
}));
jest.mock("@google/generative-ai", () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: jest.fn().mockResolvedValue(
        JSON.stringify({
          categoryScores: {
            CommunicationSkills: 80,
            TechnicalKnowledge: 70,
            ProblemSolving: 60,
            CulturalFit: 90,
            ConfidenceClarity: 70,
          },
          strengths: [
            "Strong communication skills",
            "Good problem-solving approach",
          ],
          areasForImprovement: ["Needs deeper technical knowledge"],
          finalAssessment: "Candidate performed well but has areas to improve.",
        })
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
describe("POST /interview/:interviewId/feedback", () => {
  beforeEach(() => {
    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
  });

  it("should return 201 and generate feedback successfully", async () => {
    const mockFeedback = {
      totalScore: 75,
      categoryScores: {
        CommunicationSkills: 80,
        TechnicalKnowledge: 70,
        ProblemSolving: 60,
        CulturalFit: 90,
        ConfidenceClarity: 70,
      },
      strengths: [
        "Strong communication skills",
        "Good problem-solving approach",
      ],
      areasForImprovement: ["Needs deeper technical knowledge"],
      finalAssessment: "Candidate performed well but has areas to improve.",
    };

    global.genAI = {
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockResolvedValue(JSON.stringify(mockFeedback)),
          },
        }),
      }),
    };

    Feedback.create.mockResolvedValue(mockFeedback);
    Interview.update.mockResolvedValue([1]);

    const response = await request(app)
      .post("/interview/1/feedback")
      .send({
        transcript: JSON.stringify([{ role: "Candidate", content: "Hello" }]),
      })
      .set("Authorization", "Bearer mockValidToken")
      .set("Content-Type", "application/json");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockFeedback);
  });
});

describe("GET /interview/:interviewId/feedback", () => {
  beforeEach(() => {
    verify.mockReturnValue({ id: 1, email: "test@example.com" });
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
  });

  it("should return 200 and feedback details", async () => {
    const mockFeedback = [
      {
        id: 9,
        totalScore: 4,
        categoryScores: {
          CulturalFit: 10,
          ProblemSolving: 0,
          ConfidenceClarity: 0,
          TechnicalKnowledge: 0,
          CommunicationSkills: 10,
        },
        strengths: [
          "Demonstrated awareness of personal limitations.",
          "Politeness in requesting to end the interview.",
        ],
        areasForImprovement: [
          "Lack of preparedness for technical questions.",
          "Inability to articulate experiences related to software development.",
          "Needs to develop and showcase technical skills.",
          "Requires significant improvement in interview communication.",
          "Needs to build confidence in discussing projects or experiences.",
          "Must be able to provide examples of past work/projects",
        ],
        finalAssessment:
          "The candidate demonstrated very limited ability to answer basic interview questions regarding technical experience or problem-solving skills. The candidate was unable to provide any examples of past projects or experiences, indicating a significant gap in preparedness and/or relevant experience. Communication was minimal and lacked clarity and confidence. A significant amount of preparation and experience is needed before the candidate would be suitable for a technical role.",
        createdAt: "Mar 27, 2025",
      },
    ];

    Interview.findOne.mockResolvedValue({
      id: 1,
      finalized: true,
      Feedbacks: mockFeedback,
    });

    const response = await request(app)
      .get("/interview/1/feedback")
      .set("Authorization", "Bearer mockValidToken");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockFeedback);
  });

  it("should return 404 if interview is not found or not finalized", async () => {
    Interview.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/interview/1/feedback")
      .set("Authorization", "Bearer mockValidToken");

    console.log("Response Body:", response.body);
    console.log("Response Status:", response.status);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Interview not found or not finalized",
    });
  });
});
