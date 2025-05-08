import React from "react";
import { Fragment } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/dashboard/useAuth.js";

export const UserDropdown = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
        <MenuItems className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {/* Username Capitalize */}
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
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => {
                    useAuthStore.getState().logout();
                    navigate("/");
                  }}
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
