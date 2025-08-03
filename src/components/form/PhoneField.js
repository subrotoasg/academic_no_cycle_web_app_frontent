import React from "react";
import { useFormContext } from "react-hook-form";

const PhoneField = ({
  label = "Contact Number",
  name = "phone",
  placeholder = "+8801XXXXXXXXX",
  required = true,
  maxLength = 14,
  rules = {},
  className = "",
}) => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const handleFocus = () => {
    const currentValue = getValues(name);
    if (!currentValue.startsWith("+880")) {
      setValue(name, "+880");
    }
  };

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
      <input
        id={name}
        {...register(name, {
          required: required ? "Phone number is required." : false,
          pattern: {
            value: /^\+8801[0-9]{9}$/,
            message: "Phone must be a valid Bangladeshi number.",
          },
          maxLength: {
            value: maxLength,
            message: `Phone number must be exactly ${maxLength} characters.`,
          },
          ...rules,
        })}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 ${className}`}
      />
      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default PhoneField;
