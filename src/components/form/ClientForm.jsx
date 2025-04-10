import { useState } from "react";
import { useClientStore } from "../../store/clientStore";

const AddClient = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
  });

  const addClient = useClientStore((state) => state.addClient);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClient(formData);
      alert("Client added successfully!");
      setActiveTab("Clients");
    } catch (err) {
      console.error(err);
      alert("Failed to add new client.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        Add New Client
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { label: "Client Name", name: "name", type: "text", required: true },
          { label: "Contact Person", name: "contactPerson", type: "text" },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Phone", name: "phone", type: "number" },
          { label: "Billing Address", name: "billingAddress", type: "email" },
        ].map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              autoComplete="off"
            />
            <label
              htmlFor={field.name}
              className="rounded-lg absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
            >
              {field.label}
            </label>
          </div>
        ))}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
