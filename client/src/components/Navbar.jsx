import React from "react";
import { Link, useNavigate } from "react-router";
export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className=" flex justify-between items-center p-4 border-b border-gray-800">
      <div className="flex items-center gap-2">
        {/* <img
          src="/placeholder.svg?height=24&width=24"
          width={24}
          height={24}
          alt="PrepWise logo"
          className="object-contain"
        /> */}
        <Link to="/" className="font-semibold text-white">
          💬 MockAI
        </Link>
      </div>
      <div className="flex gap-4">
        <button
          className="cursor-pointer hover:text-gray-300"
          onClick={() => {
            localStorage.removeItem("access_token");
            navigate("/login");
          }}
        >
          Logout
        </button>
        <button
          onClick={() => navigate("/edit")}
          className=" hover:text-gray-300 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </header>
  );
}
