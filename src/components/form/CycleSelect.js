"use client";

import React from "react";

function CycleSelect({
  label = "Select Cycle",
  cycles = [],
  selectedCycleId,
  onChange,
}) {
  return (
    <div className="p-2 pt-5 grid grid-cols-2 justify-center items-center">
      <label className="text-xs md:text-base w-full font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={selectedCycleId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white text-xs md:text-sm"
      >
        {cycles?.length === 0 ? (
          <option value="">No cycle available</option>
        ) : (
          <>
            <option value="">-- Select Cycle --</option>
            {cycles?.map((cycle) => (
              <option key={cycle?.id} value={cycle?.id}>
                {cycle?.title} ({cycle?.course?.productName})
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}

export default CycleSelect;
