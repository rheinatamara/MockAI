import React from "react";

export default function Card({ title, description, type, techstack, onClick }) {
  return (
    <div className="bg-[#121212] rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <img src={""} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
          {type}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>

      {/* Tech Stack */}
      <div className="flex items-center gap-2 mb-4">
        {techstack.map((tech, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"
          >
            <img
              src={`/assets/icons/${tech.toLowerCase()}.svg`}
              alt={tech}
              className="w-4 h-4"
            />
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
      >
        Take interview
      </button>
    </div>
  );
}
