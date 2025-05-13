import { useEffect, useState } from "react";
import { ClientTable } from "../components/tables/ClientTable.jsx";
import { useClientStore } from "../store/clientStore.js";
import { TABS } from "../constants/activeTab.js";
import { ReusableContainer } from "../components/ui/ReusableContainer.jsx";

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
      client.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  return (
    <ReusableContainer
      searchPlaceholder="Search by client name"
      onSearchChange={setSearchTerm}
      filters={[]} // You can add if needed
      addButtonLabel="Add Client"
      onAddClick={() => setActiveTab(TABS.ADD_CLIENT)}
    >
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
    </ReusableContainer>
  );
};
