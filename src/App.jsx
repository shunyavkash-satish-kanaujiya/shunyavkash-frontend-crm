import React from "react";
import "./global.css";
import { Toaster } from "react-hot-toast";
import { Signin } from "./pages/Signin.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Route, Routes } from "react-router-dom";
import { Clients } from "./pages/Client.jsx";
import { Project } from "./pages/Project.jsx";
import { HR } from "./pages/HR.jsx";
import { EmployeeDetails } from "./components/hr/employee/EmployeeDetails.jsx";
import { EmployeeDetailsWrapper } from "./components/hr/employee/EmployeeDetailsWrapper.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import { DashboardIndex } from "./components/dashboard/DashboardIndex.jsx";

function App() {
  console.log(import.meta.env.VITE_BACKEND_URL);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route index element={<DashboardIndex />} />
          {/* Internal Routes */}
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Project />} />
          <Route path="hr" element={<HR />} />
          <Route
            path="employee/profile/:employeeId"
            element={<EmployeeDetailsWrapper />}
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
