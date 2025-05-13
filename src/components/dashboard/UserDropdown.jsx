// import React from "react";
// import { Fragment } from "react";
// import {
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   Transition,
// } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/24/solid";
// import { useAuthStore } from "../../store/authStore.js";
// import { useNavigate } from "react-router";
// import { useAuth } from "../../hooks/dashboard/useAuth.js";

// export const UserDropdown = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <MenuButton className="flex items-center gap-2 focus:outline-none">
//         <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
//           {user?.email?.charAt(0).toUpperCase() || "U"}
//         </div>
//         <ChevronDownIcon className="w-4 h-4 text-gray-600" />
//       </MenuButton>

//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <MenuItems className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
//           <div className="px-4 py-3 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
//                 {user?.email?.charAt(0).toUpperCase() || "U"}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {/* Username Capitalize */}
//                   {user?.email
//                     ?.split("@")[0]
//                     .replace(/\./g, " ")
//                     .replace(/\b\w/g, (char) => char.toUpperCase()) || "User"}
//                 </p>
//                 <p className="text-xs text-gray-500">{user?.email}</p>
//               </div>
//             </div>
//           </div>

//           <div className="py-1">
//             <MenuItem>
//               {({ active }) => (
//                 <button
//                   onClick={() => {
//                     useAuthStore.getState().logout();
//                     navigate("/");
//                   }}
//                   className={`${
//                     active ? "bg-red-100 text-red-700" : "text-red-600"
//                   } w-full text-left px-4 py-2 text-sm`}
//                 >
//                   Logout
//                 </button>
//               )}
//             </MenuItem>
//           </div>
//         </MenuItems>
//       </Transition>
//     </Menu>
//   );
// };
// ================================================================================
// import React from "react";
// import { Fragment } from "react";
// import {
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   Transition,
// } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/24/solid";
// import { useAuthStore } from "../../store/authStore.js";
// import { useNavigate } from "react-router";
// import { useAuth } from "../../hooks/dashboard/useAuth.js";
// import { useTab } from "../../hooks/dashboard/useTab.js";
// import { TABS } from "../../constants/activeTab.js";

// export const UserDropdown = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { setActiveTab } = useTab();

//   const handleViewProfile = () => {
//     // For employees, navigate to their profile details
//     if (user?.role === "Employee") {
//       setActiveTab(TABS.EMPLOYEE_DETAILS);
//     }
//   };

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <MenuButton className="flex items-center gap-2 focus:outline-none">
//         <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
//           {user?.email?.charAt(0).toUpperCase() || "U"}
//         </div>
//         <ChevronDownIcon className="w-4 h-4 text-gray-600" />
//       </MenuButton>

//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <MenuItems className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 w-56">
//           <div className="px-4 py-3 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
//                 {user?.email?.charAt(0).toUpperCase() || "U"}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {user?.email
//                     ?.split("@")[0]
//                     .replace(/\./g, " ")
//                     .replace(/\b\w/g, (char) => char.toUpperCase()) || "User"}
//                 </p>
//                 <p className="text-xs text-gray-500">{user?.email}</p>
//               </div>
//             </div>
//           </div>

//           <div className="py-1">
//             {/* Conditional Rendering Based on User Role */}
//             {user?.role === "Employee" && (
//               <MenuItem>
//                 {({ active }) => (
//                   <button
//                     onClick={handleViewProfile}
//                     className={`${
//                       active ? "bg-gray-100 text-gray-900" : "text-gray-700"
//                     } w-full text-left px-4 py-2 text-sm`}
//                   >
//                     View Profile
//                   </button>
//                 )}
//               </MenuItem>
//             )}

//             <MenuItem>
//               {({ active }) => (
//                 <button
//                   onClick={() => {
//                     useAuthStore.getState().logout();
//                     navigate("/");
//                   }}
//                   className={`${
//                     active ? "bg-red-100 text-red-700" : "text-red-600"
//                   } w-full text-left px-4 py-2 text-sm`}
//                 >
//                   Logout
//                 </button>
//               )}
//             </MenuItem>
//           </div>
//         </MenuItems>
//       </Transition>
//     </Menu>
//   );
// };
// Add this debugging code to UserDropdown.jsx
import React, { Fragment, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/dashboard/useAuth.js";
import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { useTab } from "../../hooks/dashboard/useTab.js"; // Import useTab hook

export const UserDropdown = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setActiveTab } = useTab(); // Get setActiveTab from useTab hook
  const employeeStore = useEmployeeStore();
  const [employeeId, setEmployeeId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Debug information
  console.log("UserDropdown rendered. Current state:", {
    userRole: user?.role,
    userEmail: user?._id,
    employeeId,
    hasFetched,
  });

  // Fetch and find matching employee when component mounts
  useEffect(() => {
    const findEmployeeId = async () => {
      if (user?._id && !hasFetched) {
        try {
          setHasFetched(true);
          const matchingEmployee = await employeeStore.fetchEmployee(user?._id);
          console.log(
            "API response for employee:",
            matchingEmployee,
            matchingEmployee
          );

          if (matchingEmployee && matchingEmployee._id) {
            console.log("Found matching employee:", matchingEmployee._id);
            setEmployeeId(matchingEmployee._id);
          } else {
            console.warn("No matching employee found for email:", user.email);
          }
        } catch (error) {
          console.error("Error fetching employee by email:", error);
        }
      }
    };

    if (user?.role === "Employee" && !employeeId && !hasFetched) {
      findEmployeeId();
    }
  }, [user, employeeStore, employeeId, hasFetched]);

  const handleViewProfile = () => {
    if (user?.role === "Employee") {
      if (employeeId) {
        const profileUrl = `/dashboard/employee/profile/${employeeId}`;
        console.log("Attempting navigation to:", profileUrl);

        // Clear active tab to prevent conflicts
        if (setActiveTab) {
          setActiveTab(null);
        }

        // Navigate to profile
        navigate(profileUrl);
      } else {
        console.warn("Cannot navigate: No matching employee record found");
        // You could show a toast notification here
      }
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate("/");
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center gap-2 focus:outline-none">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 w-56">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.email
                    ?.split("@")[0]
                    .replace(/\./g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase()) || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            {user?.role === "Employee" && (
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleViewProfile}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } w-full text-left px-4 py-2 text-sm`}
                  >
                    View Profile
                  </button>
                )}
              </MenuItem>
            )}

            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-red-100 text-red-700" : "text-red-600"
                  } w-full text-left px-4 py-2 text-sm`}
                >
                  Logout
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};
