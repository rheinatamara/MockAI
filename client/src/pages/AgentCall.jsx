import React from "react";
import Agent from "../components/Agent";

export default function AgentCall() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-8">
      <Agent
        userName="rheina"
        userId={1}
        type="generate"
        title="Interview Generation"
      />
    </div>
  );
}
