import React, { useState } from "react";
import http from "../http";

export default function Interview() {
  const [formData, setFormData] = useState({
    role: "Frontend Developer",
    type: "Technical",
    level: "Junior",
    techstack: "React, Node.js",
    amount: 3,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
      role: formData.role,
      type: formData.type,
      level: formData.level,
      techstack: formData.techstack,
      amount: formData.amount,
    };
    try {
      let { data } = await http({
        method: "POST",
        url: `/interview`,
        data: newData,
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQyODkwMDEyfQ.mAZ26kghzatXL7Uy6w5wEzPuGAR8WEcrtzoc8Rs9ZDA`,
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error, "<<<");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Interview</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="role">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="type">
            Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="level">
            Level
          </label>
          <input
            type="text"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="techstack">
            Tech Stack
          </label>
          <input
            type="text"
            id="techstack"
            name="techstack"
            value={formData.techstack}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Comma-separated values (e.g., React, Node.js)"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
