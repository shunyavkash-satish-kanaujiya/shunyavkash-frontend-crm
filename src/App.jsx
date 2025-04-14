// App.jsx
import React from "react";
import "./global.css";
import { Signin } from "./pages/Signin.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Route, Routes } from "react-router-dom";
import { Clients } from "./pages/Client.jsx";
import { Project } from "./pages/Project.jsx";
// import DashboardHome from "./pages/DashboardHome.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/dashboard/*" element={<Dashboard />}>
        {/* Internal Routes */}
        {/* <Route index element={<DashboardHome />} /> */}
        <Route path="clients" element={<Clients />} />
        <Route path="projects" element={<Project />} />
      </Route>
    </Routes>
  );
}

export default App;
