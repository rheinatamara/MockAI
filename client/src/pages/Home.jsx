import React from "react";
import { Link } from "react-router";
import Card from "../components/Card";

export default function Home() {
  const interviews = [
    {
      title: "Full-Stack Dev Interview",
      description:
        "This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive...",
      type: "Technical",
      techstack: ["React", "Node.js"],
    },
    {
      title: "Backend Dev Interview",
      description:
        "This interview focuses on backend development skills, including database optimization and API design.",
      type: "Technical",
      techstack: ["PostgreSQL", "Docker"],
    },
    {
      title: "Product Manager Interview",
      description:
        "This interview evaluates your ability to prioritize features, resolve conflicts, and measure product success.",
      type: "Behavioral",
      techstack: ["JIRA", "Figma"],
    },
  ];
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative py-16 px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h1>
          <p className="text-gray-400 mb-6">
            Practice your job interview skills with AI and receive feedback
          </p>
          <Link
            to="/agent"
            className="bg-[#6c47ff] hover:bg-[#5a3dd3] text-white rounded-full px-6 py-4"
          >
            Start an Interview
          </Link>
        </div>

        {/* Floating message bubbles */}
        <div className="absolute top-10 right-[20%] animate-float-slow">
          <div className="bg-green-200 p-2 rounded-lg w-10 h-10"></div>
        </div>
        <div className="absolute top-16 right-[10%] animate-float">
          <div className="bg-pink-200 p-2 rounded-lg w-8 h-8"></div>
        </div>
        <div className="absolute bottom-10 left-[20%] animate-float-slow">
          <div className="bg-yellow-200 p-2 rounded-lg w-9 h-9"></div>
        </div>
        <div className="absolute bottom-16 left-[10%] animate-float">
          <div className="bg-blue-200 p-2 rounded-lg w-7 h-7"></div>
        </div>
      </section>

      {/* Past Interviews Section */}
      <section className="px-4 md:px-8 py-6">
        <h2 className="text-xl font-bold mb-4">Your Past Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviews.map((interview, index) => (
            <Card
              key={index}
              title={interview.title}
              description={interview.description}
              type={interview.type}
              techstack={interview.techstack}
              onClick={() => console.log(`Starting ${interview.title}`)}
            />
          ))}
        </div>
      </section>

      {/* Pick Your Interview Section */}
      <section className="px-4 md:px-8 py-6">
        <h2 className="text-xl font-bold mb-4">Pick Your Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviews.map((interview, index) => (
            <Card
              key={index}
              title={interview.title}
              description={interview.description}
              type={interview.type}
              techstack={interview.techstack}
              onClick={() => console.log(`Starting ${interview.title}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
