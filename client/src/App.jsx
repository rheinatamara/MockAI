// import Agent from "./pages/Agent";
import Feedback from "./pages/Feedback";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import { Routes, Route } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./components/PrivateLayout";
import PrivateLayout from "./components/PrivateLayout";
import PublicLayout from "./components/PublicLayout";
import Generate from "./pages/Generate";
import Edit from "./pages/Edit";
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/interview/:interviewId" element={<Interview />} />
        <Route path="/:interviewId/feedback" element={<Feedback />} />
      </Route>
    </Routes>
  );
}

export default App;
