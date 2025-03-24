const express = require("express");
const errorHandler = require("../middlewares/errorHandler");
const authentication = require("../middlewares/authentication");
const router = express.Router();
router.use("/", require("./userRouter"));
router.use(authentication);
router.use("/interview", require("./interviewRouter"));
router.use(errorHandler);
module.exports = router;
