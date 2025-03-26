import React from "react";

export default function FeedbackCard({ title, type, techstack, onClick }) {
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
        {" "}
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
            className="rounded-full px-4 bg-[#6c47ff] py-2 flex items-center justify-center text-white text-xs"
          >
            <p>{tech}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
      >
        View Interview
      </button>
    </div>
  );
}
