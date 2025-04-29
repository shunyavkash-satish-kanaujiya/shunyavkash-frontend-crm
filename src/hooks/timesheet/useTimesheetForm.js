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
      } catch (err) {
        console.error("Error fetching timesheets:", err);
        setError(err.message || "Failed to fetch timesheets");
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
        const descMatch = ts.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        return projectMatch || descMatch;
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

    // Apply date filter
    // if (filters.date) {
    //   const filterDate = new Date(filters.date).toDateString();
    //   filtered = filtered.filter((ts) => {
    //     if (!ts.date) return false;
    //     return new Date(ts.date).toDateString() === filterDate;
    //   });
    // }

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
