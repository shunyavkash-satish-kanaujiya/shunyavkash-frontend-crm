import React from "react";

export const FormButtons = ({ loading, editingEmployee, onCancel }) => {
  return (
    <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
      <button
        type="submit"
        disabled={loading}
        className={`${
          loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
        } text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
            ></path>
          </svg>
        ) : editingEmployee ? (
          "Update Employee"
        ) : (
          "Save Employee"
        )}
      </button>

      <button
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};
