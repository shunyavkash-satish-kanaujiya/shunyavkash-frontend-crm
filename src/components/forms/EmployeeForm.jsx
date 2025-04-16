import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../store/hr/employeesStore";
import { TABS } from "../../constants/activeTab";

export const EmployeeForm = ({ setEmployeeTab }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
    status: "Active",
    address: "",
    avatar: null,
    documents: [],
  });

  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const editingEmployee = useEmployeeStore((state) => state.editingEmployee);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );

  useEffect(() => {
    if (editingEmployee) {
      setFormData((prev) => ({
        ...prev,
        firstName: editingEmployee.firstName || "",
        lastName: editingEmployee.lastName || "",
        email: editingEmployee.email || "",
        phone: editingEmployee.phone || "",
        designation: editingEmployee.designation || "",
        dateOfJoining: editingEmployee.dateOfJoining?.slice(0, 10) || "",
        salary: editingEmployee.salary || "",
        status: editingEmployee.status || "Active",
        address: editingEmployee.address || "",
        avatar: editingEmployee.avatar || null,
        documents: [], // Let the user re-upload if needed
      }));
    }
  }, [editingEmployee]);

  useEffect(() => {
    if (!editingEmployee) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        dateOfJoining: "",
        salary: "",
        status: "Active",
        address: "",
        avatar: null,
        documents: [],
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file") {
      if (name === "documents") {
        setFormData({ ...formData, documents: files });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    for (const key in formData) {
      if (key === "documents") {
        for (let file of formData.documents) {
          submissionData.append("documents", file);
        }
      } else {
        submissionData.append(key, formData[key]);
      }
    }

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id, submissionData);
        alert("Employee updated successfully!");
        setEditingEmployee(null);
      } else {
        await addEmployee(submissionData);
        alert("Employee added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          designation: "",
          dateOfJoining: "",
          salary: "",
          status: "Active",
          address: "",
          avatar: null,
          documents: [],
        });
      }
      setEmployeeTab(TABS.EMPLOYEES);
    } catch (err) {
      console.error(err);
      alert("Failed to save employee.");
    }
  };

  const fields = [
    { label: "First Name", name: "firstName", type: "text", required: true },
    { label: "Last Name", name: "lastName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Designation", name: "designation", type: "text" },
    { label: "Date of Joining", name: "dateOfJoining", type: "date" },
    { label: "Salary", name: "salary", type: "number" },
    { label: "Status", name: "status", type: "text" },
    { label: "Address", name: "address", type: "text" },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        {editingEmployee ? "Update Employee" : "Add New Employee"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        encType="multipart/form-data"
      >
        {fields.map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] ?? ""}
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

        {/* Avatar Upload (Styled) */}
        <div className="relative mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Avatar
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="avatar"
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Upload Avatar
            </label>
            {formData.avatar && (
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {typeof formData.avatar === "string"
                  ? formData.avatar.split("/").pop()
                  : formData.avatar?.name}
              </span>
            )}
          </div>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {/* Documents Upload (Styled) */}
        <div className="relative mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Documents
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="documents"
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Upload Documents
            </label>
            {formData.documents.length > 0 && (
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {formData.documents.length} file(s) selected
              </span>
            )}
          </div>
          <input
            id="documents"
            name="documents"
            type="file"
            multiple
            accept="application/pdf,image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg"
          >
            {editingEmployee ? "Update Employee" : "Save Employee"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
            onClick={() => {
              setEditingEmployee(null);
              setEmployeeTab(TABS.EMPLOYEES);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
