import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layouts/Sidebar.jsx";
import { Clients } from "./Client.jsx";
import { ClientForm } from "../components/forms/ClientForm.jsx";
import { Project } from "../pages/Project.jsx";
import { ProjectForm } from "../components/forms/ProjectForm.jsx";
import { Timesheet } from "../pages/Timesheet.jsx";
import { Invoice } from "../pages/Invoices.jsx";

import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { LogsIcon } from "lucide-react";

import { TABS } from "../constants/activeTab";
import { HR } from "./HR.jsx";
import { EmployeeForm } from "../components/forms/EmployeeForm.jsx";
import { Employees } from "../components/hr/Employees.jsx";
import { ArchivedProjects } from "../components/project/ArchivedProjects.jsx";

// Custom hooks
import { useAuth } from "../hooks/dashboard/useAuth";
import { useTab } from "../hooks/dashboard/useTab";
import { useSidebar } from "../hooks/dashboard/useSidebar";
import { useState } from "react";
import { UserDropdown } from "../components/dashboard/UserDropdown.jsx";
import { TimesheetForm } from "../components/forms/TimesheetForm.jsx";

// Sidebar Tabs
const navigation = [
  { name: "Dashboard", icon: HomeIcon },
  { name: "HR", icon: UserGroupIcon },
  { name: "Clients", icon: UsersIcon },
  {
    name: "Projects",
    icon: FolderIcon,
    submenu: [{ name: "Archived Projects" }],
  },
  { name: "Timesheet", icon: LogsIcon },
  { name: "Invoice", icon: ReceiptPercentIcon },
  { name: "Reports", icon: ChartBarIcon },
  {
    name: "Settings",
    icon: CogIcon,
    submenu: [{ name: "Profile Settings" }, { name: "System Settings" }],
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, isAuthLoading } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const { sidebarOpen, setSidebarOpen, openSubmenu, setOpenSubmenu } =
    useSidebar();

  const [editingClient, setEditingClient] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingTimesheet, setEditingTimesheet] = useState(null);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-textPrimary">
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-textPrimary">
        <div className="p-6 bg-white rounded shadow text-center">
          <h1 className="text-xl font-bold mb-2">Unauthorized</h1>
          <p className="mb-4">Please sign in to access the dashboard.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Go to Signin
          </button>
        </div>
      </div>
    );
  }
  // Downloads an invoice PDF (from Cloudinary or backend)
  const handleDownloadPDF = async (invoiceId) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error.message);
      alert("Failed to download invoice PDF.");
    }
  };

  // Regenerates a deleted invoice PDF
  const handleRegeneratePDF = async (invoiceId) => {
    try {
      const response = await fetch(
        `/api/invoices/${invoiceId}/regenerate-pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error regenerating PDF");

      alert("PDF regenerated successfully.");
    } catch (error) {
      console.error("Regenerate error:", error.message);
      alert("Failed to regenerate invoice PDF.");
    }
  };

  // Updates invoice status (e.g., from Pending to Paid)
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error updating status");

      alert("Invoice status updated.");
    } catch (error) {
      console.error("Status update error:", error.message);
      alert("Failed to update invoice status.");
    }
  };

  const renderMainContent = () => {
    // Dashboard
    if (activeTab === TABS.DASHBOARD) {
      return (
        <div className="rounded-lg bg-white p-6 shadow-md">
          {/* Username Capitalize */}
          <h2 className="text-lg font-semibold mb-1">
            Welcome,{" "}
            {user?.email
              ?.split("@")[0]
              .replace(/\./g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()) || "User"}
          </h2>
          <p className="text-sm text-gray-600">
            This is your CRM Admin Panel. You can now manage clients, projects,
            reports, and more.
          </p>
        </div>
      );
    }

    // Clients
    if (activeTab === TABS.CLIENTS) {
      return (
        <Clients
          setActiveTab={setActiveTab}
          setEditingClient={setEditingClient}
        />
      );
    }

    if (activeTab === TABS.ADD_CLIENT) {
      return (
        <ClientForm
          setActiveTab={setActiveTab}
          editingClient={editingClient}
          setEditingClient={setEditingClient}
        />
      );
    }

    // Projects
    if (activeTab === TABS.PROJECTS) {
      return (
        <Project
          setActiveTab={setActiveTab}
          setEditingProject={setEditingProject}
        />
      );
    }

    if (activeTab === TABS.ADD_PROJECT) {
      return (
        <ProjectForm
          setActiveTab={setActiveTab}
          editingProject={editingProject}
          setEditingProject={setEditingProject}
        />
      );
    }

    if (activeTab === TABS.ARCHIVED_PROJECTS) {
      return (
        <ArchivedProjects
          setActiveTab={setActiveTab}
          setEditingProject={setEditingProject}
        />
      );
    }

    // HR
    if (activeTab === TABS.HR) {
      return (
        <HR setActiveTab={setActiveTab} setEditingProject={setEditingProject} />
      );
    }

    // Employees
    if (activeTab === TABS.EMPLOYEES) {
      return (
        <Employees
          setActiveTab={setActiveTab}
          setEditingEmployee={setEditingEmployee}
        />
      );
    }

    if (activeTab === TABS.ADD_EMPLOYEE) {
      return (
        <EmployeeForm
          setActiveTab={setActiveTab}
          editingEmployee={editingEmployee}
          setEditingEmployee={setEditingEmployee}
        />
      );
    }

    // Timesheet
    if (activeTab === TABS.TIMESHEET) {
      return (
        <Timesheet
          setActiveTab={setActiveTab}
          editingTimesheet={editingTimesheet}
          setEditingTimesheet={setEditingTimesheet}
        />
      );
    }

    if (activeTab === TABS.ADD_TIMESHEET) {
      return (
        <TimesheetForm
          setActiveTab={setActiveTab}
          editingTimesheet={editingTimesheet}
          setEditingTimesheet={setEditingTimesheet}
        />
      );
    }
    if (activeTab === TABS.INVOICES) {
      return (
        <Invoice
          setActiveTab={setActiveTab}
          handleDownloadPDF={handleDownloadPDF}
          handleRegeneratePDF={handleRegeneratePDF}
          updateInvoiceStatus={updateInvoiceStatus}
        />
      );
    }

    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-sm text-gray-600">
          This section is under construction.
        </p>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background text-textPrimary">
      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSubmenu={openSubmenu}
        setOpenSubmenu={setOpenSubmenu}
      />

      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header - Fixed */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-border border-gray-300 shadow-sm gap-3">
          <h1 className="text-lg font-bold">{activeTab}</h1>
          <UserDropdown />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};
