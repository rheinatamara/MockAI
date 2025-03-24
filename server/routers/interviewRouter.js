const express = require("express");
const InterviewController = require("../controllers/InterviewController");

const interview = express.Router();
interview.post("/create", InterviewController.createInterview);
module.exports = interview;
