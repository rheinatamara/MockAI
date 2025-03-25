const { Interview, Feedback } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class InterviewController {
  static async getInterviews(req, res, next) {
    try {
      const { userId } = req.user;
      const interviews = await Interview.findAll({
        where: { userId },
        include: [
          {
            model: Feedback,
            attributes: ["id", "totalScore", "createdAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(interviews);
    } catch (error) {
      console.error("Error in getInterviews:", error);
      next(error);
    }
  }
  static async getFeedbackByInterviewId(req, res, next) {
    try {
      const { interviewId } = req.params;
      const interview = await Interview.findOne({
        where: { id: interviewId, finalized: true },
        include: [
          {
            model: Feedback,
            attributes: [
              "id",
              "totalScore",
              "categoryScores",
              "strengths",
              "areasForImprovement",
              "finalAssessment",
              "createdAt",
            ],
          },
        ],
      });

      if (!interview) {
        throw {
          name: "NOTFOUND",
          message: "Interview not found or not finalized",
        };
      }

      res.status(200).json(interview.Feedbacks);
    } catch (error) {
      next(error);
    }
  }
  static async createInterview(req, res, next) {
    try {
      const { type, role, level, techstack, amount } = req.body;
      const { userId } = req.user;
      const prompt = `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const questionsText = await result.response.text();
      let questions;
      try {
        questions = JSON.parse(questionsText);
        if (
          !Array.isArray(questions) ||
          !questions.every((q) => typeof q === "string")
        ) {
          throw {
            name: "BADREQUEST",
            message: "Invalid questions format",
          };
        }
      } catch (error) {
        console.error("Error parsing questions:", error);
        throw {
          name: "BADREQUEST",
          message: "Failed to generate valid questions",
        };
      }
      const interview = await Interview.create({
        role,
        type,
        level,
        techstack: techstack.split(","),
        questions,
        userId,
        finalized: true,
      });
      res.status(201).json(interview);
    } catch (error) {
      console.error("Error in createInterview:", error);
      next(error);
    }
  }
}

module.exports = InterviewController;
