const { Interview, Feedback } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class InterviewController {
  static async getActiveInterviews(req, res, next) {
    try {
      const { userId } = req.user;
      const interviews = await Interview.findAll({
        where: {
          userId,
          finalized: false,
        },
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
  static async getCompletedInterviews(req, res, next) {
    try {
      const { userId } = req.user;
      const interviews = await Interview.findAll({
        where: {
          userId,
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
      res.status(200).json(interviews);
    } catch (error) {
      console.error("Error in getInterviews:", error);
      next(error);
    }
  }
  static async getInterviewById(req, res, next) {
    try {
      const { interviewId } = req.params;
      const interview = await Interview.findOne({
        where: { id: interviewId },
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
          message: "Interview not found",
        };
      }
      res.status(200).json(interview);
    } catch (error) {
      console.error("Error in getInterviewById:", error);
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

      if (!interview || interview.length === 0) {
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
      console.log("MASUK CREATE");
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
        finalized: false,
      });
      res.status(201).json(interview);
    } catch (error) {
      console.error("Error in createInterview:", error);
      next(error);
    }
  }
  static async deleteInterview(req, res, next) {
    try {
      const { interviewId } = req.params;
      const interview = await Interview.findByPk(interviewId);

      if (!interview) {
        throw {
          name: "NOTFOUND",
          message: "Interview not found",
        };
      }
      await interview.destroy();
      res.status(200).json({ message: "Interview deleted successfully" });
    } catch (error) {
      console.error("Error in deleteInterview:", error);
      next(error);
    }
  }
  static async generateFeedback(req, res, next) {
    try {
      const { userId } = req.user;
      const { interviewId } = req.params;
      const transcript = JSON.parse(req.body.transcript);
      const formattedTranscript = transcript
        .map((item) => `- ${item.role}: ${item.content}`)
        .join("\n");

      console.log("Formatted Transcript:\n", formattedTranscript);
      const prompt = `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        **Instructions:**  
        Return the response strictly in **valid JSON format** with the following structure:

        \`\`\`json
        {
          "categoryScores": {
            "CommunicationSkills": 0-100,
            "TechnicalKnowledge": 0-100,
            "ProblemSolving": 0-100,
            "CulturalFit": 0-100,
            "ConfidenceClarity": 0-100
          },
          "strengths": [
            "List of candidate strengths"
          ],
          "areasForImprovement": [
            "List of improvement areas"
          ],
          "finalAssessment": "Detailed final evaluation"
        }
        \`\`\`
        Strictly follow this format and do not include additional text.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      let feedbackData;
      try {
        const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
        feedbackData = JSON.parse(cleanedResponse);
      } catch (error) {
        console.error("Error parsing Gemini response:", error);
        return res.status(500).json({ error: "Invalid AI response format" });
      }
      const categoryScores = feedbackData.categoryScores;
      const totalScore =
        Object.values(categoryScores).reduce((a, b) => a + b, 0) /
        Object.keys(categoryScores).length;
      const feedback = await Feedback.create({
        totalScore,
        categoryScores,
        strengths: feedbackData.strengths,
        areasForImprovement: feedbackData.areasForImprovement,
        finalAssessment: feedbackData.finalAssessment,
        userId,
        interviewId,
      });
      await Interview.update(
        { finalized: true },
        { where: { id: interviewId } }
      );
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InterviewController;
