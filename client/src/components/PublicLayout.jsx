import React from "react";
import { Outlet, Navigate } from "react-router";

export default function PublicLayout() {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
}
