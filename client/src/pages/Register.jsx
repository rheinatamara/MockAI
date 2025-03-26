import React, { useState } from "react";
import http from "../http";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await http({
        method: "POST",
        url: "/register",
        data: {
          name: name,
          email: email,
          password: password,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account created successfully",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 mx-auto bg-[#121212] rounded-2xl border border-[#222222]">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1 text-white text-xl font-medium">
            <span className="text-white/90">💬</span>
            MockAI
          </div>
          <h1 className="mt-4 text-xl text-white font-medium text-center">
            Practice job interviews with AI
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-sm text-white/70">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm text-white/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer py-3 mt-6 text-center bg-[#b4a7ff] hover:bg-[#a395ff] text-black font-medium rounded-full transition-colors"
          >
            Create an account
          </button>
          <p className="text-white text-center items-center">
            Already have an account?{" "}
            <Link to="/login " className="underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
