// Clients.jsx
import { useEffect, useState } from "react";
import { ClientTable } from "../components/tables/ClientTable.jsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useClientStore } from "../store/clientStore.js";
import { TABS } from "../constants/activeTab.js";
import { ReusableSearch } from "../components/ui/ReusableSearch.jsx";
import { ReusableFilter } from "../components/ui/ReusableFilter.jsx"; // ✅ Uncomment when filters are needed

export const Clients = ({ setActiveTab, setEditingClient }) => {
  const clients = useClientStore((state) => state.clients);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const loading = useClientStore((state) => state.loading);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  return (
    // Main Container
    <div className="bg-gray-50 min-h-screen text-textPrimary space-y-4">
      {/* Reusable Search & Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <ReusableSearch
          searchPlaceholder="Search by client name"
          onSearchChange={setSearchTerm}
        />

        {/* ✅ Uncomment below when filter functionality is needed */}

        <ReusableFilter
          filters={[
            {
              label: "Designation",
              key: "designation",
              options: ["Admin", "HR", "Developer"],
            },
            {
              label: "Status",
              key: "status",
              options: ["Active", "Inactive", "On Leave", "Terminated"],
            },
          ]}
          // selectedFilters={selectedFilters}
          // onFilterChange={handleFilterChange}
        />

        <button
          onClick={() => setActiveTab(TABS.ADD_CLIENT)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition cursor-pointer mr-0 ml-auto"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Client
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-indigo-600 font-medium">
            Loading clients...
          </div>
        ) : (
          <ClientTable
            clients={filteredClients}
            setActiveTab={setActiveTab}
            setEditingClient={setEditingClient}
          />
        )}
      </div>
    </div>
  );
};
