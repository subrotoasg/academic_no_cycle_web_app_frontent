import React from "react";
import { useFormContext } from "react-hook-form";

const Dropdown = ({
  label,
  name,
  options = [],
  defaultValue,
  onChange,
  rules = {},
  required = false,

  className = "",
  ...rest
}) => {
  const methods = useFormContext?.();
  const {
    register,
    formState: { errors },
  } = methods || { register: () => ({}), formState: { errors: {} } };

  const selectProps = register ? register(name, rules) : {};

  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        {...selectProps}
        {...rest}
        className={`w-full border p-2 rounded-md text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 ${className}`}
      >
        <option value=""> Select One</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default Dropdown;
