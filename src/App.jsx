import React from "react";
import "./global.css";
import { Signin } from "./pages/Signin.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
