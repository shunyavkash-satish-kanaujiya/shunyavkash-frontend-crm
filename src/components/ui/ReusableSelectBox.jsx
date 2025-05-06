export const ReusableSelectBox = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = "Select an option",
}) => {
  return (
    <div className="relative z-0 w-full group">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full pt-5 pb-2.5 px-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === "object" ? opt.value : opt}>
            {typeof opt === "object" ? opt.label : opt}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0]
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
          peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
};
