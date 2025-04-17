import { useState, useEffect } from "react";

export const ReusableSearch = ({
  searchPlaceholder = "Search...",
  onSearchChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearchChange && onSearchChange(searchTerm);
  }, [onSearchChange, searchTerm]);

  return (
    <div className="flex gap-4 items-center p-3 bg-white shadow-md rounded-lg">
      <input
        type="text"
        placeholder={searchPlaceholder}
        className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
