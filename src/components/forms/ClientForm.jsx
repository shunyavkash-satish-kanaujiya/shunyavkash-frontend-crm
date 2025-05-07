import { useEffect, useState } from "react";
import { useClientStore } from "../../store/clientStore.js";
import { TABS } from "../../constants/activeTab.js";

export const ClientForm = ({
  setActiveTab,
  editingClient,
  setEditingClient,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
  });

  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);

  useEffect(() => {
    if (editingClient) {
      setFormData(editingClient);
    }
  }, [editingClient]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await updateClient(editingClient._id, formData);
        alert("Client updated successfully!");
        setEditingClient(null);
      } else {
        await addClient(formData);
        alert("Client added successfully!");
        setFormData({
          name: "",
          contactPerson: "",
          email: "",
          phone: "",
          billingAddress: "",
        });
      }
      setActiveTab(TABS.CLIENTS);
    } catch (error) {
      console.error(error);
      alert("Failed to submit client.");
    }
  };

  const fields = [
    { label: "Client Name", name: "name", type: "text", required: true },
    { label: "Contact Person", name: "contactPerson", type: "text" },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone", name: "phone", type: "number", required: true },
    {
      label: "Billing Address",
      name: "billingAddress",
      type: "email",
      required: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        {editingClient ? "Update Client" : "Add New Client"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {fields.map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              autoComplete="off"
              className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            />
            <label
              htmlFor={field.name}
              className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
            >
              {field.label}
            </label>
          </div>
        ))}

        <div className="md:col-span-2 flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg"
          >
            {editingClient ? "Update Client" : "Save Client"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
            onClick={() => {
              setEditingClient(null);
              setActiveTab(TABS.CLIENTS);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
