import React from "react";

const Switch = ({ checked, onChange, labelOn, labelOff }) => {
  return (
    <button
      type="button"
      onClick={() => onChange({ target: { checked: !checked } })}
      className={`px-4 my-2 py-2 rounded-md transition-all ${
        checked ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
      }`}
    >
      {checked ? labelOff : labelOn}
    </button>
  );
};

export default Switch;
