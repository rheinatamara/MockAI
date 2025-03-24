require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use("/", require("./routers"));
app.listen(port, () => {
  console.log("running on port", port);
});
module.exports = app;
