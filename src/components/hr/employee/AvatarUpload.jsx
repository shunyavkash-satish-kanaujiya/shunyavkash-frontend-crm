import React from "react";

export const AvatarUpload = ({
  formData,
  handleChange,
  previewAvatar,
  editingEmployee,
}) => {
  return (
    <div className="relative mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Avatar
      </label>
      <div className="flex items-center space-x-4">
        <label
          htmlFor="avatar"
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Upload Avatar
        </label>
        {formData.avatar && (
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {typeof formData.avatar === "string"
              ? formData.avatar.split("/").pop()
              : formData.avatar?.name}
          </span>
        )}
      </div>
      <input
        id="avatar"
        name="avatar"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {(previewAvatar || (editingEmployee && editingEmployee.avatar?.url)) && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Avatar Preview:</p>
          <img
            src={previewAvatar || editingEmployee.avatar.url}
            alt="Avatar Preview"
            className="h-24 w-24 object-cover rounded-full border"
          />
        </div>
      )}
    </div>
  );
};
