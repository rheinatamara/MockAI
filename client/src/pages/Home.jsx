import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Card from "../components/InterviewCard";
import Swal from "sweetalert2";
import http from "../http";
import InterviewCard from "../components/InterviewCard";
import FeedbackCard from "../components/FeedbackCard";

export default function Home() {
  const [interviewData, setInterviewData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  async function fetchActiveData() {
    try {
      const { data } = await http({
        method: "GET",
        url: "/interview/active",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setInterviewData(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchCompletedData() {
    try {
      const { data } = await http({
        method: "GET",
        url: "/interview/completed",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCompletedData(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchActiveData();
  }, []);
  useEffect(() => {
    fetchCompletedData();
  }, []);

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
            to="/generate"
            className="bg-[#6c47ff] hover:bg-[#5a3dd3] text-white rounded-full px-6 py-4"
          >
            Generate interview questions
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
      <section className="px-4 md:px-8 py-6">
        {/* Show message if both are empty */}
        {interviewData.length === 0 && completedData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You don’t have any interviews yet.
          </p>
        ) : (
          <>
            {/* Completed Interviews Section (Show only if not empty) */}
            {completedData.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">Your Past Interviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {completedData.map((interview) => (
                    <FeedbackCard
                      fetchData={fetchCompletedData}
                      id={interview.id}
                      key={interview.id}
                      title={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      onClick={() => console.log(`Starting ${interview.title}`)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Active Interviews Section (Show only if not empty) */}
            {interviewData.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4 mt-6">
                  Pick Your Interview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {interviewData.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      fetchData={fetchActiveData}
                      id={interview.id}
                      title={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
