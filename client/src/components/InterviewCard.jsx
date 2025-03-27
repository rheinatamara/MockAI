import React from "react";
import { useNavigate } from "react-router";
import http from "../http";
import Swal from "sweetalert2";

export default function InterviewCard({
  id,
  title,
  type,
  techstack,
  fetchData,
}) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/interview/${id}`);
  }
  async function handleDelete() {
    try {
      await http({
        method: "DELETE",
        url: `/interview/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account created successfully",
      });
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bg-[#121212] rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <p className="text-lg">💬</p>
          </div>
          <h3 className="text-white font-semibold text-lg">
            {title} Interview
          </h3>
        </div>
        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
          {type}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        This interview is purely for practice and skill improvement. It does not
        indicate serious interest in a specific job or role. The purpose is to
        help users refine their interview skills, gain confidence, and receive
        constructive feedback in a risk-free environment.
      </p>

      {/* Tech Stack */}
      <div className="flex items-center gap-2 mb-4">
        {techstack.map((tech, index) => (
          <div
            key={index}
            className="rounded-full flex items-center justify-center text-gray-400 text-sm"
          >
            <p># {tech}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex gap-5">
        <button
          onClick={handleClick}
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
        >
          Take interview
        </button>
        <button
          onClick={handleDelete}
          className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
        >
          Delete Interview
        </button>
      </div>
    </div>
  );
}
