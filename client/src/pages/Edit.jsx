import React, { useState, useEffect } from "react";
import http from "../http";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
export default function Edit() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data } = await http({
          method: "GET",
          url: "/user",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Failed to fetch user data.",
        });
      }
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await http({
        method: "PUT",
        url: "/update",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: {
          email: email || undefined, // Only send if email is provided
          password: password || undefined, // Only send if password is provided
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully",
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
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1 text-white text-xl font-bold">
            Edit Profile
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-white/70">
              New Email
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
              New Password
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
            Edit Profile
          </button>
        </form>
      </div>
    </div>
  );
}
