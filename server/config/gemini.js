// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const interviewModel = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

async function generateInterviewQuestion(position, experienceLevel) {
  const prompt = `Generate a professional interview question for a ${position} role at ${experienceLevel} level.`;

  const result = await interviewModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function evaluateAnswer(question, answer) {
  const prompt = `Evaluate this interview answer. Question: ${question}. Answer: ${answer}. Provide constructive feedback.`;

  const result = await interviewModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = { generateInterviewQuestion, evaluateAnswer };
