import { useState } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useClientStore } from "../../store/clientStore";
import { TABS } from "../../constants/activeTab";

export const ClientTable = ({ clients, setActiveTab, setEditingClient }) => {
  const deleteClient = useClientStore((state) => state.deleteClient);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setActiveTab(TABS.ADD_CLIENT);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto space-y-4 shadow-md rounded-md p-2">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search by client name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-64"
        />
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Contact Person
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Contact
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Billing Address
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Connect Date
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredClients.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No clients found.
              </td>
            </tr>
          ) : (
            filteredClients.map((client) => (
              <tr
                key={client._id}
                className="hover:bg-indigo-50 transition cursor-pointer"
              >
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold uppercase">
                      {client.name.charAt(0)}
                    </div>
                    <span className="capitalize">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap capitalize">
                  {client.contactPerson}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {client.email}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {client.phone}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {client.billingAddress}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <XMarkIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
