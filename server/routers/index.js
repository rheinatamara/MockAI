const express = require("express");
const router = express.Router();
router.use("/", require("./userRouter"));
router.use("/interview", require("./interviewRouter"));
module.exports = router;
