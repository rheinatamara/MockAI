import React from "react";
import { Outlet, Navigate } from "react-router";
import Navbar from "./Navbar";

export default function PrivateLayout() {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/register" />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
