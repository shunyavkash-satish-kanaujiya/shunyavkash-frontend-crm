import { useState, useEffect } from "react";
import { Employees } from "../components/hr/Employees";
import { Attendences } from "../components/hr/Attendences";
import { Leaves } from "../components/hr/Leaves";
import { Payrolls } from "../components/hr/Payrolls";
import { Interviews } from "../components/hr/Interviews";

import {
  activeTabHR,
  defaultHRTab,
  localStorageKeyHR,
} from "../constants/hr/activeTabHR";

export const HR = () => {
  const [activeTab, setActiveTab] = useState(defaultHRTab);

  useEffect(() => {
    const savedTab = localStorage.getItem(localStorageKeyHR);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKeyHR, activeTab);
  }, [activeTab]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Tabs */}
      <div className="flex gap-4 border-b">
        {activeTabHR.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.value
                ? "text-indigo-700 border-indigo-700"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="shadow-md bg-white rounded-lg p-4">
        {activeTab === "employees" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Employees</h2>
            <Employees />
          </div>
        )}

        {activeTab === "attendances" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">
              Attendances
            </h2>
            <Attendences />
          </div>
        )}

        {activeTab === "leaves" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Leaves</h2>
            <Leaves />
          </div>
        )}

        {activeTab === "payrolls" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Payrolls</h2>
            <Payrolls />
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">
              Interviews
            </h2>
            <Interviews />
          </div>
        )}
      </div>
    </div>
  );
};
