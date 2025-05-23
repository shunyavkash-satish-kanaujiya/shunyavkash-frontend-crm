import { useEffect, useState, useCallback } from "react";
import { useTimesheetStore } from "../../store/timesheetStore";
import { formatDate } from "../../utils/formatDate";

export const useTimesheetForm = () => {
  const timesheets = useTimesheetStore((state) => state.timesheets);
  const fetchTimesheets = useTimesheetStore((state) => state.fetchTimesheets);
  const filters = useTimesheetStore((state) => state.filters);
  const updateFilters = useTimesheetStore((state) => state.updateFilters);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);

  // Initialize form data state
  const [formData, setFormData] = useState({
    project: "",
    date: "",
    status: "",
    hours: "",
    description: "",
    employee: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to reset form data
  const resetForm = useCallback((data = {}) => {
    setFormData({
      project: data.project || "",
      date: data.date ? formatDate(new Date(data.date)) : "",
      status: data.status || "",
      hours: data.hoursWorked || "",
      description: data.description || "",
    });
  }, []);

  // Fetch timesheets on component mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchTimesheets();
        setError(null);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
        setError(error.message || "Failed to fetch timesheets");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchTimesheets]);

  // Filter timesheets based on search, status, project, view, and date
  useEffect(() => {
    if (!timesheets || timesheets.length === 0) {
      setFilteredTimesheets([]);
      return;
    }

    let filtered = [...timesheets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((ts) => {
        const projectMatch = ts.project?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        console.log("TS:", ts);

        return projectMatch;
      });
    }

    // Apply status filter
    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter((ts) => ts.status === filters.status);
    }

    // Apply project filter
    if (filters.project) {
      filtered = filtered.filter(
        (ts) => ts.project && ts.project._id === filters.project._id
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTimesheets(filtered);
  }, [timesheets, searchTerm, filters]);

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
    filteredTimesheets,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
  };
};
