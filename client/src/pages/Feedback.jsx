import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import http from "../http";
http;
export default function Feedback() {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [feedback, setFeedback] = useState({});
  function handleClick() {
    navigate("/");
  }

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const { data } = await http({
          method: "GET",
          url: `/interview/${interviewId}/feedback`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setFeedback(data[0]);
        console.log(data[0]);
        // console.log(feedback, "<<");
      } catch (error) {
        console.log(error);
      }
    }
    fetchFeedback();
  }, [interviewId]);
  return (
    <div className="min-h-screen  flex flex-col">
      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-8">
        {/* Title section */}
        <div className="mt-12 mb-6">
          <h1 className="text-2xl font-semibold mb-6">
            Feedback on the Interview
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">★</span>
              <span>
                Overall Impression:{" "}
                <span className="text-white">{feedback.totalScore}/100</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* <CalendarIcon className="h-4 w-4 text-blue-400" /> */}
              <span>📅 {feedback.createdAt}</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-sm">
              📌 This interview is purely for practice and skill improvement. It
              does not indicate serious interest in a specific job or role. The
              purpose is to help users refine their interview skills, gain
              confidence, and receive constructive feedback in a risk-free
              environment.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Breakdown of Evaluation:
          </h2>

          <div className="space-y-6">
            {/* Section 1 */}
            <h3 className="text-base font-medium mb-2">
              1. Communication Skills (
              {feedback.categoryScores?.CommunicationSkills}/100)
            </h3>

            <h3 className="text-base font-medium mb-2">
              2. Confidence and Clarity (
              {feedback.categoryScores?.ConfidenceClarity}/100)
            </h3>

            <h3 className="text-base font-medium mb-2">
              3. Cultural Fit ({feedback.categoryScores?.CulturalFit}/100)
            </h3>

            <h3 className="text-base font-medium mb-2">
              4. Problem Solving ({feedback.categoryScores?.ProblemSolving}/100)
            </h3>

            <h3 className="text-base font-medium mb-2">
              3. Technical Knowledge (
              {feedback.categoryScores?.TechnicalKnowledge}/100)
            </h3>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Strengths:</h2>
          <ul className="list-disc">
            {feedback.strengths?.map((s, idx) => {
              return (
                <li key={idx} className="ml-4 text-gray-400 text-sm mb-2">
                  {s}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Areas for Improvements:
          </h2>
          <ul className="list-disc">
            {feedback.areasForImprovement?.map((s, idx) => {
              return (
                <li key={idx} className="ml-4 text-gray-400 text-sm mb-2">
                  {s}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Final verdict */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">Final Verdict:</h2>
          </div>

          <p className="text-gray-400 text-sm">{feedback.finalAssessment}</p>
        </div>

        {/* Action buttons */}
        <div className="mt-12 flex gap-4">
          <button
            variant="outline"
            onClick={handleClick}
            className="rounded-full bg-gray-800 py-5 cursor-pointer hover:bg-gray-700 text-white border-none flex-1"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
