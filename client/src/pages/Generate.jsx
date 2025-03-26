import React, { useState } from "react";
import http from "../http";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";

export default function Generate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    role: "",
    level: "",
    techstack: "",
    amount: "1",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await http({
        method: "POST",
        url: "/interview",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: formData,
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Interview questions generated successfully!",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 mx-auto bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-[#222222]">
        <div className="flex flex-col mb-6">
          <div className="flex gap-1 text-white text-4xl font-medium">
            <span className="text-white/90">💬</span>
            MockAI
          </div>
          <h1 className="mt-4 text-2xl text-white font-medium mb-2">
            Starting your interview
          </h1>
          <p className="text-sm text-[#DEDAFF] font-light">
            Customize your mock interview to suit your needs.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Interview Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="type"
              className="block text-sm text-white/70 font-light"
            >
              What type of interview would you like to practice?
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label
              htmlFor="role"
              className="block text-sm text-white/70 font-light"
            >
              What role are you focusing on?
            </label>
            <input
              id="role"
              name="role"
              type="text"
              placeholder="Select your role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Level */}
          <div className="space-y-1.5">
            <label
              htmlFor="level"
              className="block text-sm text-white/70 font-light"
            >
              What level are you aiming for?
            </label>
            <input
              id="level"
              name="level"
              type="text"
              placeholder="e.g., Junior, Mid, Senior"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label
              htmlFor="techstack"
              className="block text-sm text-white/70 font-light"
            >
              Which tech stack would you like to focus on?
            </label>
            <input
              id="techstack"
              name="techstack"
              type="text"
              placeholder="e.g., React, Node.js, etc."
              value={formData.techstack}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Amount of Questions */}
          <div className="space-y-1.5">
            <label
              htmlFor="amount"
              className="block text-sm text-white/70 font-light"
            >
              How many questions would you like to be prepared?
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer py-3 mt-6 text-center bg-[#b4a7ff] hover:bg-[#a395ff] text-black font-medium rounded-full transition-colors"
          >
            Generate Questions
          </button>
        </form>
      </div>
    </div>
  );
}
