import React from "react";
import { Link } from "react-router";
import Agent from "./Agent";

export default function Home() {
  return <Agent userName="rheina" userId={1} type="generate" />;
}
