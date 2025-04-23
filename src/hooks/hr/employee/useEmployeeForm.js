import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../../store/hr/employeesStore";

export const useEmployeeForm = (setEmployeeTab, TABS) => {
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
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [deletedDocIds, setDeletedDocIds] = useState([]);

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
        ...editingEmployee,
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
    setLoading(true);
    alert(editingEmployee ? "Updating employee..." : "Saving employee...");

    const submissionData = new FormData();
    for (const key in formData) {
      if (key === "documents") {
        formData.documents.forEach((file) =>
          submissionData.append("documents", file)
        );
      } else if (key === "avatar" && formData.avatar instanceof File) {
        submissionData.append("avatar", formData.avatar);
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
      setExistingDocs([]);
      setDeletedDocIds([]);
      setEmployeeTab(TABS.EMPLOYEES);
    } catch (err) {
      console.error(err);
      alert("Failed to save employee.");
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
  };
};
