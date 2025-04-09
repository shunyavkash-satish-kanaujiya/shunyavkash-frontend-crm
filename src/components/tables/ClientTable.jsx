// src/components/table/ClientTable.jsx
const ClientTable = ({ clients }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {clients.map((client) => (
            <tr
              key={client._id}
              className="hover:bg-indigo-50 transition cursor-pointer"
            >
              <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold uppercase">
                    {client.name.charAt(0)}
                  </div>
                  <span>{client.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
