"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FaPaperPlane } from "react-icons/fa";
import Image from "next/image";

export default function ReportForm() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (event) => {
    if (!event.target.files?.length) return;

    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ fullName: "", email: "", message: "" });
      setFiles([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 shadow-lg rounded-xl p-8 text-center ">
        <div className="mb-6 text-green-500 flex justify-center">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#578EEB] mb-4">
          Report Submitted Successfully!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your feedback. We&apos;ll review your Report and get
          back to you soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-[#578EEB] hover:bg-[#4A7ACB] text-white py-2 px-6 rounded-md font-medium transition-all duration-200"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 shadow-lg rounded-xl p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-[#578EEB] mb-6 text-center">
        Report an Issue
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-gray-700 dark:text-slate-400 font-medium"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="block w-full px-4 py-3 border rounded-md dark:bg-slate-800 dark:text-slate-200 border-gray-300 dark:border-slate-700 focus:border-[#578EEB] focus:ring focus:ring-[#578EEB] focus:ring-opacity-20 transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-slate-400 font-medium"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="block w-full px-4 py-3 border rounded-md dark:bg-slate-800 dark:text-slate-200 border-gray-300 dark:border-slate-700 focus:border-[#578EEB] focus:ring focus:ring-[#578EEB] focus:ring-opacity-20 transition-colors"
            placeholder="Enter your email address"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fileUpload"
            className="block text-gray-700 dark:text-slate-400 font-medium"
          >
            Attach Files (Optional)
          </label>
          <input
            id="fileUpload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-gray-700 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#578EEB] file:text-white hover:file:bg-[#4A7ACB] cursor-pointer"
            aria-describedby="file-description"
          />
          <p
            id="file-description"
            className="text-xs text-gray-500 dark:text-slate-500 mt-1"
          >
            You can upload multiple files. Supported formats: JPG, PNG, PDF, DOC
            (Max 5MB each)
          </p>
        </div>

        {files.length > 0 && (
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
            <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Uploaded Files:
            </h4>
            <ul className="space-y-3">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white dark:bg-slate-700 p-2 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith("image/") ? (
                      <Image
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview of ${file.name}`}
                        height={48}
                        width={48}
                        className="w-12 h-12 object-cover rounded-md border dark:border-slate-600"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-slate-600 rounded-md">
                        <span className="text-xs font-medium">
                          {file.name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-800 dark:text-slate-200 truncate max-w-[180px] md:max-w-xs">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors p-1"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-gray-700 dark:text-slate-400 font-medium"
          >
            Report Details
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="block w-full px-4 py-3 border rounded-md dark:bg-slate-800 dark:text-slate-200 border-gray-300 dark:border-slate-700 focus:border-[#578EEB] focus:ring focus:ring-[#578EEB] focus:ring-opacity-20 min-h-[150px] transition-colors"
            placeholder="Describe your Report in detail..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#578EEB] hover:bg-[#4A7ACB] text-white py-3 rounded-md font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <FaPaperPlane className="mr-2" />
          )}
          Submit Report
        </button>
      </form>
    </div>
  );
}
