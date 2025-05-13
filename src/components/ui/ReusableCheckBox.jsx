import React from "react";

export const ReusableCheckBox = ({
  label,
  name,
  options = [], // [{ value, label }]
  value = [], // array of selected values
  onChange, // synthetic event { target: { name, value } }
  required = false,
  noOptionsMessage,
}) => {
  const handleChange = (optValue) => {
    const updated = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];

    onChange({ target: { name, value: updated } });
  };

  return (
    <div className="relative z-0 w-full group border border-gray-300 rounded-lg px-2.5 pt-4 pb-2.5 bg-white">
      <label
        htmlFor={name}
        className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0]
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
          peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
      >
        {label}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {options.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            {noOptionsMessage || "No options available."}
          </p>
        ) : (
          options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name={name}
                checked={value.includes(opt.value)}
                onChange={() => handleChange(opt.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                required={required && value.length === 0}
              />
              <span className="text-sm text-gray-800">{opt.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};
