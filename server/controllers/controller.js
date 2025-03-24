class Controller {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Controller;
