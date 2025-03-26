const express = require("express");
const InterviewController = require("../controllers/InterviewController");

const interview = express.Router();
interview.get("/active", InterviewController.getActiveInterviews);
interview.get("/completed", InterviewController.getCompletedInterviews);
interview.get("/:interviewId", InterviewController.getInterviewById);
interview.get(
  "/:interviewId/feedback",
  InterviewController.getFeedbackByInterviewId
);
interview.post("/", InterviewController.createInterview);
interview.post("'/:interviewId/feedback");
interview.delete("'/:interviewId", InterviewController.deleteInterview);

module.exports = interview;
