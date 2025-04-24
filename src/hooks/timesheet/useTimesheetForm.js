import { useEffect, useState } from "react";
import { useTimesheetStore } from "../../store/timesheetStore";

export const useTimesheetForm = () => {
  const timesheets = useTimesheetStore((state) => state.timesheets);
  const fetchTimesheets = useTimesheetStore((state) => state.fetchTimesheets);
  const filters = useTimesheetStore((state) => state.filters);
  const updateFilters = useTimesheetStore((state) => state.updateFilters);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);

  // Initialize form data state
  const [formData, setFormData] = useState({
    project: "",
    hours: "",
    date: "",
    description: "",
  });

  // Function to reset form data
  const resetForm = (data = {}) => {
    setFormData({
      project: data.project || "",
      hours: data.hours || "",
      date: data.date || "",
      description: data.description || "",
    });
  };

  // Fetch timesheets on component mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchTimesheets();
      setLoading(false);
    };
    load();
  }, [fetchTimesheets]);

  // Filter timesheets based on search, status, project, view, and date
  useEffect(() => {
    let filtered = [...timesheets];

    if (searchTerm) {
      filtered = filtered.filter((ts) =>
        ts.project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status !== "All") {
      filtered = filtered.filter((ts) => ts.status === filters.status);
    }

    if (filters.project) {
      filtered = filtered.filter(
        (ts) => ts.project?._id === filters.project._id
      );
    }

    // Filter by day/week (Daily view for now)
    if (filters.view === "daily") {
      const selected = new Date(filters.date).toDateString();
      filtered = filtered.filter(
        (ts) => new Date(ts.date).toDateString() === selected
      );
    }

    // Update filtered timesheets
    setFilteredTimesheets(filtered);
  }, [timesheets, searchTerm, filters]);

  return {
    formData,
    resetForm,
    filteredTimesheets,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
  };
};
