import { useState } from "react";
import { Employees } from "../components/hr/Employees";
import { Attendences } from "../components/hr/Attendences";
import { Leaves } from "../components/hr/Leaves";
import { Payrolls } from "../components/hr/Payrolls";
import { Interviews } from "../components/hr/Interviews";

export const HR = () => {
  const [activeTab, setActiveTab] = useState("employees");

  const tabs = [
    { label: "Employees", value: "employees" },
    { label: "Attendances", value: "attendances" },
    { label: "Leaves", value: "leaves" },
    { label: "Payrolls", value: "payrolls" },
    { label: "Interviews", value: "interviews" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Tabs */}
      <div className="flex gap-4 border-b">
        {tabs.map((tab) => (
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
        {/* Employees */}
        {activeTab === "employees" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Employees</h2>
            <Employees />
          </div>
        )}

        {/* Attendances */}
        {activeTab === "attendances" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">
              Attendances
            </h2>
            <Attendences />
          </div>
        )}

        {/* Leaves */}
        {activeTab === "leaves" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Leaves</h2>
            <Leaves />
          </div>
        )}

        {/* Payrolls */}
        {activeTab === "payrolls" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Payrolls</h2>
            <Payrolls />
          </div>
        )}

        {/* Interviews */}
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
