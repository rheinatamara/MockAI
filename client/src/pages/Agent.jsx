"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { vapi } from "../lib/vapi";
import { interviewer } from "../constants";
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
      console.log(messages);
      // CREATE FEEDBACK
      // const { success, feedbackId: id } = await createFeedback({
      //   interviewId: interviewId,
      //   userId: userId,
      //   transcript: messages,
      //   feedbackId,
      // });

      // if (success && id) {
      //   navigate(`/interview/${interviewId}/feedback`);
      // } else {
      //   console.log("Error saving feedback");
      //   navigate("/");
      // }
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
        console.log("masuk kok");
      } catch (error) {
        console.error("Vapi start error:", error);
        console.log("Workflow ID:", import.meta.env.VITE_VAPI_WORKFLOW_ID);
        console.log("Assistant ID:", import.meta.env.VITE_VAPI_ASSISTANT_ID);
      }
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

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
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <img
              src="/ai-avatar.png"
              alt="profile-image"
              className="object-cover"
              width={65}
              height={54}
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <img
              src="/user-avatar.png"
              alt="profile-image"
              className="rounded-full object-cover size-[120px]"
              width={539}
              height={539}
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={
                ("transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100")
              }
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="bg-blue-500 text-white px-20 py-5"
            onClick={handleCall}
          >
            <span
              className={
                ("absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden")
              }
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
