"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { vapi } from "../lib/vapi";
import { interviewer } from "../constants";
import avatar from "../assets/user-avatar.png";
import http from "../http";
const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  title,
}) => {
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      console.log("handleGenerateFeedback");

      const response = await http.post(
        `/interview/${interviewId}/feedback`,
        { transcript: JSON.stringify(messages) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 201 || response.status === 202) {
        navigate(`/${interviewId}/feedback`);
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Something went wrong while generating feedback.");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        navigate("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, navigate, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (type === "generate") {
      try {
        await vapi.start(import.meta.env.VITE_VAPI_WORKFLOW_ID, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });

        setCallStatus(CallStatus.ACTIVE);
      } catch (startError) {
        console.error("Start error:", startError);
        setCallStatus(CallStatus.INACTIVE);
      }
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      // console.log(formattedQuestions, "<<");
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 mt-8">{title}</h2>
      <div className="call-view grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* AI Interviewer Card */}
        <div className="card-interviewer border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center bg-[#1a1a2e] h-96 ">
          <div className="avatar w-24 h-24 bg-[#e0d9ff] rounded-full flex items-center justify-center mb-6 relative">
            {" "}
            <p className="text-4xl">💬</p>
            {/* <div className="w-64">💬</div> */}
            {isSpeaking && (
              <span className="animate-speak absolute w-full h-full rounded-full border-4 border-white animate-ping opacity-75" />
            )}
          </div>
          <h3 className="text-2xl font-semibold">AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border border border-gray-700 rounded-xl overflow-hidden">
          <div className="card-content flex flex-col items-center justify-center bg-[#1a1a2e] h-96">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
              <img src={avatar} alt="profile-image" className="rounded-full" />
            </div>
            <h3 className="text-2xl font-semibold">{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border border border-gray-700 rounded-full mb-8">
          <div className="transcript p-4 text-center text-gray-300">
            <p
              key={lastMessage}
              className="transition-opacity duration-500 animate-fadeIn opacity-100"
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-12 rounded-full relative"
            onClick={handleCall}
          >
            <span
              className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${
                callStatus !== "CONNECTING" && "hidden"
              }`}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button
            className="btn-disconnect bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-12 rounded-full"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
