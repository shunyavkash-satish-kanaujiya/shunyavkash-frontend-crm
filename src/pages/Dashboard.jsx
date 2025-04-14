import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layouts/Sidebar.jsx";
import { Clients } from "../pages/Clients.jsx";
import { ClientForm } from "../components/form/ClientForm.jsx";
import { Project } from "../pages/Project.jsx";
import { ProjectForm } from "../components/form/ProjectForm.jsx";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  ChartBarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { LogsIcon } from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: HomeIcon },
  {
    name: "Clients",
    icon: UsersIcon,
  },
  {
    name: "Projects",
    icon: FolderIcon,
  },
  { name: "Timesheet", icon: LogsIcon },
  { name: "Reports", icon: ChartBarIcon },
  {
    name: "Settings",
    icon: CogIcon,
    submenu: [{ name: "Profile Settings" }, { name: "System Settings" }],
  },
];

export const Dashboard = () => {
  const { user, token, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [editingClient, setEditingClient] = useState(null);

  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const { user, token, fetchUser } = useAuthStore.getState();

    if (!token) {
      navigate("/");
    } else if (!user) {
      fetchUser();
    }
  }, [navigate, user, token, fetchUser]);

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

  const renderMainContent = () => {
    // Dashboard Rander
    if (activeTab === "Dashboard") {
      return (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-1 text-wrap wrap-break-word">
            Welcome, {user?.email || "User"}
          </h2>
          <p className="text-sm text-gray-600">
            This is your CRM Admin Panel. You can now manage clients, projects,
            reports, and more.
          </p>
        </div>
      );
    }

    // Client Render
    if (activeTab === "Clients") {
      return (
        <Clients
          setActiveTab={setActiveTab}
          setEditingClient={setEditingClient}
        />
      );
    }

    if (activeTab === "Add New Client") {
      return (
        <ClientForm
          setActiveTab={setActiveTab}
          editingClient={editingClient}
          setEditingClient={setEditingClient}
        />
      );
    }

    // Project Render
    if (activeTab === "Projects") {
      return (
        <Project
          setActiveTab={setActiveTab}
          setEditingProject={setEditingProject}
        />
      );
    }

    if (activeTab === "Create Project") {
      return (
        <ProjectForm
          setActiveTab={setActiveTab}
          editingProject={editingProject}
          setEditingProject={setEditingProject}
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
    <div className="min-h-screen flex bg-background text-textPrimary">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-border shadow-sm gap-3">
          <h1 className="text-2xl font-bold">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {user?.email || "User"}
            </span>

            {/* Logout Button */}
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                navigate("/");
              }}
              className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Area */}
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};
