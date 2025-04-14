import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layouts/Sidebar.jsx";
import { Clients } from "./Client.jsx";
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
import { TABS } from "../constants/activeTab";

// Custom hooks
import { useAuth } from "../hooks/dashboard/useAuth";
import { useTab } from "../hooks/dashboard/useTab";
import { useSidebar } from "../hooks/dashboard/useSidebar";
import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";

const navigation = [
  { name: "Dashboard", icon: HomeIcon },
  { name: "Clients", icon: UsersIcon },
  { name: "Projects", icon: FolderIcon },
  { name: "Timesheet", icon: LogsIcon },
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

  const renderMainContent = () => {
    if (activeTab === TABS.DASHBOARD) {
      return (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-1">
            Welcome, {user?.email || "User"}
          </h2>
          <p className="text-sm text-gray-600">
            This is your CRM Admin Panel. You can now manage clients, projects,
            reports, and more.
          </p>
        </div>
      );
    }

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
      <Sidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSubmenu={openSubmenu}
        setOpenSubmenu={setOpenSubmenu}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white border-b border-border shadow-sm gap-3">
          <h1 className="text-2xl font-bold">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {user?.email || "User"}
            </span>

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

        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};
