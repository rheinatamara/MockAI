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
      <button
        className="cursor-pointer hover:text-gray-300"
        onClick={() => {
          localStorage.removeItem("access_token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </header>
  );
}
