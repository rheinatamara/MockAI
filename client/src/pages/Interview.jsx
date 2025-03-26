import React, { useEffect, useState } from "react";
import Agent from "../components/Agent";
import http from "../http";
import { useParams } from "react-router";

export default function Interview() {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await http({
          method: "GET",
          url: `/interview/${interviewId}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setQuestions(data.questions);
      } catch (error) {
        console.log(error);
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: error.response.data.message,
        // }).then(() => {
        //   localStorage.clear();
        //   navigate("/login");
        // });
      }
    }
    if (interviewId) {
      fetchData();
    }
  }, [interviewId]);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-8">
      <Agent
        userName="rheina"
        userId={1}
        type="interview"
        title="AI Interview"
        interviewId={interviewId}
        questions={questions}
      />
    </div>
  );
}
