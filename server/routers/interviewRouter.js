const express = require("express");
const InterviewController = require("../controllers/InterviewController");

const interview = express.Router();
interview.get("/", InterviewController.getInterviews); //get user's interview
interview.get(
  "/:interviewId/feedback",
  InterviewController.getFeedbackByInterviewId
); //get feedbackByInterviewId
interview.post("/create", InterviewController.createInterview);
// Create feedback for an interview
interview.post("'/:interviewId/feedback");
// delete interview
interview.delete("'/:interviewId");

// Jangan lupa endpoint buat make call dan end call untuk VAPI

module.exports = interview;
