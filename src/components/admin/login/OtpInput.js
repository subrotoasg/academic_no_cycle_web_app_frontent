"use client";
import React, { useState } from "react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OtpInput = ({ onSubmit }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    onSubmit(otp); 
  };

  return (
    <div className="space-y-3">
      <Input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <Button onClick={handleSubmit} className="w-full">Submit</Button>
    </div>
  );
};

export default OtpInput;
