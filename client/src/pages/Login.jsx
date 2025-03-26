import React, { useState } from "react";
import http from "../http";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await http({
        method: "POST",
        url: "/login",
        data: {
          email: email,
          password: password,
        },
      });

      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 mx-auto bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-[#222222]">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1 text-white text-xl font-medium">
            <span className="text-white/90">💬</span>
            MockAI
          </div>
          <h1 className="mt-4 text-xl text-white font-medium text-center">
            Practice job interviews with AI
          </h1>
        </div>
        {/* Styling */}
        <div className="absolute top-10 right-[20%] animate-float-slow">
          <div className="bg-green-200 p-2 rounded-lg w-10 h-10"></div>
        </div>
        <div className="absolute bottom-50 right-[20%] animate-float-slow">
          <div className="bg-purple-200 p-2 rounded-lg w-10 h-10"></div>
        </div>
        <div className="absolute top-16 right-[10%] animate-float">
          <div className="bg-pink-200 p-2 rounded-lg w-8 h-8"></div>
        </div>
        <div className="absolute bottom-10 left-[20%] animate-float-slow">
          <div className="bg-yellow-200 p-2 rounded-lg w-9 h-9"></div>
        </div>
        <div className="absolute top-80 left-[20%] animate-float-slow">
          <div className="bg-purple-200 p-2 rounded-lg w-9 h-9"></div>
        </div>
        <div className="absolute bottom-16 left-[10%] animate-float">
          <div className="bg-blue-200 p-2 rounded-lg w-7 h-7"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400 "
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm text-white/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer py-3 mt-6 text-center bg-[#b4a7ff] hover:bg-[#a395ff] text-black font-medium rounded-full transition-colors"
          >
            Login
          </button>
          <p className="text-white text-center items-center">
            Don't have an account?{" "}
            <Link to="/register " className="underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
