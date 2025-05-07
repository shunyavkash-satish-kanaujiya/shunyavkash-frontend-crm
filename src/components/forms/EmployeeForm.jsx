import { employeeFields } from "../../constants/hr/employee/fields";
import { TABS } from "../../constants/activeTab";
import { useEmployeeForm } from "../../hooks/hr/employee/useEmployeeForm";
import { AvatarUpload } from "../hr/employee/AvatarUpload";
import { DocumentsUpload } from "../hr/employee/DocumentsUpload";
import { FormButtons } from "../hr/employee/FormButtons";
import { ReusableSelectBox } from "../ui/ReusableSelectBox";

export const EmployeeForm = ({ setEmployeeTab }) => {
  const {
    formData,
    loading,
    previewAvatar,
    existingDocs,
    editingEmployee,
    handleChange,
    handleRemoveExistingDoc,
    handleRemoveNewDoc,
    handleSubmit,
    isAdminOrHR,
    isEditingOwnProfile,
  } = useEmployeeForm(setEmployeeTab, TABS);

  // Function to determine if field should be read-only
  const shouldBeReadOnly = (fieldName) => {
    // If editing own profile and not admin/HR, restrict certain fields
    if (isEditingOwnProfile && !isAdminOrHR) {
      return ["salary", "dateOfJoining"].includes(fieldName);
    }
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <p className="text-sm text-gray-500">
        ● Fields with<span className="text-red-700 text-lg inline"> * </span>
        must be required.
      </p>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        {editingEmployee ? "Update Employee" : "Add New Employee"}
      </h2>
      {isEditingOwnProfile && !isAdminOrHR && (
        <div className="mb-4 p-3 bg-blue-50 text-sm text-blue-800 rounded-md">
          <p>
            Note: As an employee, you cannot modify your salary or date of
            joining.
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        encType="multipart/form-data"
      >
        {employeeFields.map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            {field.type === "select" ? (
              <ReusableSelectBox
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                options={field.options.map((option) => ({
                  value: option,
                  label: option,
                }))}
                required={field.required}
                isDisabled={shouldBeReadOnly(field.name)}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] ?? ""}
                onChange={handleChange}
                required={field.required}
                autoComplete="off"
                readOnly={shouldBeReadOnly(field.name)}
                className={`peer block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer ${
                  shouldBeReadOnly(field.name)
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
            <label
              htmlFor={field.name}
              className={`absolute text-md transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 px-1 bg-white ${
                  shouldBeReadOnly(field.name)
                    ? "text-gray-400"
                    : "text-gray-500 peer-focus:text-indigo-600"
                }`}
            >
              {field.label}
              {field.required}
            </label>
          </div>
        ))}

        <AvatarUpload
          formData={formData}
          previewAvatar={previewAvatar}
          editingEmployee={editingEmployee}
          handleChange={handleChange}
        />

        <DocumentsUpload
          formData={formData}
          existingDocs={existingDocs}
          handleChange={handleChange}
          handleRemoveExistingDoc={handleRemoveExistingDoc}
          handleRemoveNewDoc={handleRemoveNewDoc}
        />

        <FormButtons
          loading={loading}
          editingEmployee={editingEmployee}
          onCancel={() => setEmployeeTab(TABS.EMPLOYEES)}
        />
      </form>
    </div>
  );
};
