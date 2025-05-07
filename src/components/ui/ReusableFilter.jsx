import { useState, useEffect } from "react";

export const ReusableFilter = ({ filters = [], onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    onFilterChange && onFilterChange(filterValues);
  }, [filterValues, onFilterChange]);

  const handleFilterChange = (filterKey, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  return (
    <div className="flex gap-4 items-center p-2 bg-white shadow-md rounded-lg">
      {filters.map(({ label, key, options }) => (
        <select
          key={key}
          className="border border-gray-300 rounded px-2 py-2 text-sm capitalize"
          onChange={(e) => handleFilterChange(key, e.target.value)}
        >
          <option value="" className="capitalize">
            {label}
          </option>
          {(options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};
