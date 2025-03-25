const { Interview, Feedback } = require("../models");
const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");

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
      const { userId } = req.user;
      const feedback = await Feedback.findOne({
        where: { interviewId, userId },
      });
      if (!feedback) {
        throw {
          name: "NOTFOUND",
          message: "Feedback not found",
        };
      }
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  }
  static async createInterview(req, res, next) {
    try {
      const { type, role, level, techstack, amount } = req.body;
      const { userId } = req.user;
      const techstackArray = Array.isArray(techstack)
        ? techstack
        : techstack.split(",").map((item) => item.trim());

      const { text } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstackArray.join(", ")}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
          `,
      });
      let questions;
      try {
        questions = JSON.parse(text);
        if (
          !Array.isArray(questions) ||
          !questions.every((q) => typeof q === "string")
        ) {
          throw new Error("Invalid questions format");
        }
      } catch (e) {
        console.error("Error parsing JSON, falling back to text splitting:", e);
        questions = text
          .split("\n")
          .filter((q) => q.trim().length > 0)
          .map((q) => q.replace(/^[\d.]+/, "").trim());

        if (
          !Array.isArray(questions) ||
          !questions.every((q) => typeof q === "string")
        ) {
          throw new Error("Failed to parse questions into an array of strings");
        }
      }
      const newInterview = await Interview.create({
        role,
        level,
        techstack: techstackArray,
        type,
        questions,
        userId,
      });
      res.status(201).json(newInterview);
    } catch (error) {
      console.error("Error in createInterview:", error);
      next(error);
    }
  }
}

module.exports = InterviewController;
