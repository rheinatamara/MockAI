import Feedback from "./pages/Feedback";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import { Routes, Route } from "react-router";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="/register" element={<h1>Register</h1>} />
      {/* <Route element={<MainLayout />}> */}
      <Route path="/" element={<Home />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/:interviewId/feedback" element={<Feedback />} />
      {/* </Route> */}
    </Routes>
  );
}

export default App;
