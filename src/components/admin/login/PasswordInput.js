"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="relative space-y-1">
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:bg-transparent"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
