import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

export const DocumentsUpload = ({
  formData,
  existingDocs,
  handleChange,
  handleRemoveExistingDoc,
  handleRemoveNewDoc,
}) => {
  return (
    <div className="relative mb-6 md:col-span-2">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Documents
      </label>
      <div className="flex items-center space-x-4 mb-2">
        <label
          htmlFor="documents"
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Upload Documents
        </label>
        {(formData.documents.length > 0 || existingDocs.length > 0) && (
          <span className="text-sm text-gray-600">
            {formData.documents.length + existingDocs.length} file(s) total
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

      {/* Existing Docs */}
      {existingDocs.length > 0 && (
        <div className="space-y-1 mt-2">
          {existingDocs.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
            >
              <span className="text-sm truncate max-w-[200px] text-gray-700">
                {doc.name || doc.url.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExistingDoc(index)}
                className="text-red-500 text-sm ml-4"
              >
                <XMarkIcon className="w-5 h-5 inline stroke-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Docs */}
      {formData.documents.length > 0 && (
        <div className="space-y-1 mt-2">
          {formData.documents.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
            >
              <span className="text-sm truncate max-w-[200px] text-gray-700">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveNewDoc(index)}
                className="text-red-500 text-sm ml-4"
              >
                <XMarkIcon className="w-5 h-5 inline stroke-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
