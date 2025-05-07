import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../../store/hr/employeesStore";
import { useAuthStore } from "../../../store/authStore";

export const useEmployeeForm = (setEmployeeTab, TABS) => {
  const { user } = useAuthStore();
  const editingEmployee = useEmployeeStore((state) => state.editingEmployee);
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );

  // Then calculate derived values
  const isAdminOrHR = ["Admin", "HR"].includes(user?.role);
  const isEditingOwnProfile = user?.email === editingEmployee?.email;

  // Track original values for comparison
  const [originalValues, setOriginalValues] = useState({});

  // Then declare local state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
    status: "Active",
    address: "",
    avatar: null,
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [deletedDocIds, setDeletedDocIds] = useState([]);

  useEffect(() => {
    if (editingEmployee) {
      // Store original values of restricted fields for comparison
      setOriginalValues({
        salary: editingEmployee.salary || "",
        dateOfJoining: editingEmployee.dateOfJoining?.slice(0, 10) || "",
      });

      setFormData((prev) => ({
        ...prev,
        ...editingEmployee,
        department: editingEmployee.department || [],
        designation: editingEmployee.designation || [],
        dateOfJoining: editingEmployee.dateOfJoining?.slice(0, 10) || "",
        avatar: editingEmployee.avatar || null,
        documents: [],
      }));
      setExistingDocs(editingEmployee.documents || []);
      setDeletedDocIds([]);
    }
  }, [editingEmployee]);

  useEffect(() => {
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (name === "avatar") {
      const file = files[0];
      if (file) {
        setPreviewAvatar(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, avatar: file }));
      }
    } else if (type === "file") {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveExistingDoc = (index) => {
    const doc = existingDocs[index];
    setDeletedDocIds((prev) => [...prev, doc.publicId]);
    setExistingDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation for employees editing their own profile
    if (editingEmployee && isEditingOwnProfile && !isAdminOrHR) {
      const restrictedFields = ["salary", "dateOfJoining"];
      // Compare with original values instead of editingEmployee directly
      const changedFields = restrictedFields.filter(
        (field) => formData[field] !== originalValues[field]
      );

      if (changedFields.length > 0) {
        alert(`You are not authorized to modify: ${changedFields.join(", ")}`);
        return;
      }
    }

    setLoading(true);
    alert(editingEmployee ? "Updating employee..." : "Saving employee...");

    const submissionData = new FormData();

    for (const key in formData) {
      if (key === "documents") {
        formData.documents.forEach((file) => {
          submissionData.append("documents", file);
        });
      } else if (key === "avatar" && formData.avatar instanceof File) {
        submissionData.append("avatar", formData.avatar);
      } else if (key === "designation" && Array.isArray(formData.designation)) {
        formData.designation.forEach((d) =>
          submissionData.append("designation[]", d)
        );
      } else if (key === "department" && Array.isArray(formData.department)) {
        // Replace existing departments
        formData.department.forEach((d) =>
          submissionData.append("department[]", d)
        );
      } else {
        submissionData.append(key, formData[key]);
      }
    }

    submissionData.append("existingDocs", JSON.stringify(existingDocs));
    submissionData.append("documentsToDelete", JSON.stringify(deletedDocIds));

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id, submissionData);
        alert("Employee updated successfully!");
        setEditingEmployee(null);
      } else {
        await addEmployee(submissionData);
        alert("Employee added successfully!");
      }

      // reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        dateOfJoining: "",
        salary: "",
        status: "Active",
        address: "",
        avatar: null,
        documents: [],
      });
      setOriginalValues({});
      setExistingDocs([]);
      setDeletedDocIds([]);
      setEmployeeTab(TABS.EMPLOYEES);
    } catch (error) {
      console.error(error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 409 && data.message) {
          alert("An employee with this email already exists.");
        } else if (data.message) {
          alert(data.message);
        } else {
          alert("Failed to save employee.");
        }
      } else {
        alert("Failed to save employee.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    previewAvatar,
    existingDocs,
    deletedDocIds,
    editingEmployee,
    handleChange,
    handleRemoveExistingDoc,
    handleRemoveNewDoc,
    handleSubmit,
    isAdminOrHR,
    isEditingOwnProfile,
  };
};
