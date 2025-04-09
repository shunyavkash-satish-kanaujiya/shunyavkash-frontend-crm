import { useState, useEffect } from "react";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  ChartBarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronRightIcon as SubChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Dashboard", icon: HomeIcon },
  {
    name: "Customers",
    icon: UsersIcon,
    submenu: [{ name: "All Customers" }, { name: "Add Customer" }],
  },
  {
    name: "Projects",
    icon: FolderIcon,
    submenu: [{ name: "All Projects" }, { name: "Create Project" }],
  },
  { name: "Reports", icon: ChartBarIcon },
  {
    name: "Settings",
    icon: CogIcon,
    submenu: [{ name: "Profile Settings" }, { name: "System Settings" }],
  },
];

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/");
    }
  }, [user, token, navigate]);

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

  return (
    <div className="min-h-screen flex bg-background text-textPrimary">
      {/* Sidebar */}
      <aside
        className={`$${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-surface border-r border-border p-4 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-6">
          {sidebarOpen && <h2 className="text-xl font-bold">CRM Admin</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 focus:outline-none"
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <ChevronRightIcon className="h-6 w-6 ms-2" />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() =>
                        setOpenSubmenu(
                          openSubmenu === item.name ? null : item.name
                        )
                      }
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-100 text-left text-sm font-medium"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-indigo-600" />
                        {sidebarOpen && <span>{item.name}</span>}
                      </span>
                      {sidebarOpen &&
                        (openSubmenu === item.name ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <SubChevronRightIcon className="h-4 w-4 text-gray-500 ms-1.5" />
                        ))}
                    </button>
                    {openSubmenu === item.name && sidebarOpen && (
                      <ul className="pl-11 space-y-1">
                        {item.submenu.map((sub) => (
                          <li key={sub.name}>
                            <a
                              href="#"
                              className="block px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-indigo-100"
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-indigo-100 text-sm font-medium"
                  >
                    <item.icon className="h-5 w-5 text-indigo-600" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-border shadow-sm">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {user.email}
            </span>
          </div>
        </header>

        {/* Main Area */}
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-1">
              Welcome, {user.email}
            </h2>
            <p className="text-sm text-gray-600">
              This is your CRM Admin Panel. You can now manage customers,
              projects, reports, and more.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
