import React from "react";
import { useFormContext } from "react-hook-form";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  onChange,
  defaultValue,
  rules = {},
  required = false,
  min,
  textarea = false,
  step,
  className = "",
  ...rest
}) => {
  const methods = useFormContext?.();
  const {
    register,
    formState: { errors },
  } = methods || { register: () => ({}), formState: { errors: {} } };

  const inputProps = register ? register(name, rules) : {};

  return (
    <div className="mb-3">
      {type === "checkbox" ? (
        <div className="flex items-center space-x-2">
          <input
            id={name}
            name={name}
            type="checkbox"
            {...inputProps}
            {...rest}
            className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${className}`}
          />
          {label && (
            <label
              htmlFor={name}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {label}
            </label>
          )}
        </div>
      ) : textarea ? (
        <>
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1"
            >
              {label}
            </label>
          )}
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            rows={1}
            {...inputProps}
            {...rest}
            className={`w-full border p-2 rounded-md resize-y dark:bg-gray-800 dark:text-white dark:border-gray-700 ${className}`}
          />
        </>
      ) : (
        <>
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1"
            >
              {label}
            </label>
          )}
          <input
            id={name}
            name={name}
            type={type}
            min={min}
            step={step}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            {...inputProps}
            {...rest}
            className={`w-full border p-2 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 ${className}`}
          />
        </>
      )}
      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default InputField;
