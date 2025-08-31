"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import {
  useGetStudentByAccessCodeQuery,
  useGetStudentByEmailOrPhoneQuery,
} from "@/redux/services/studentApi";
import { toast } from "sonner";
import Image from "next/image";

export default function StudentLookup() {
  const methods = useForm({
    defaultValues: { criteria: "accessCode", value: "" },
  });
  const { handleSubmit, watch, reset } = methods;

  const [searchValue, setSearchValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("accessCode");
  const [searched, setSearched] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const {
    data: studentByEmail,
    isFetching: isFetchingEmail,
    error: errorEmail,
    refetch: refetchEmail,
  } = useGetStudentByEmailOrPhoneQuery(searchValue, {
    skip: searchCriteria !== "emailPhone" || !searched,
  });
  //   console.log(studentByEmail);
  const {
    data: studentByCode,
    isFetching: isFetchingCode,
    error: errorCode,
    refetch: refetchCode,
  } = useGetStudentByAccessCodeQuery(searchValue, {
    skip: searchCriteria !== "accessCode" || !searched,
  });
  //   console.log(studentByCode);
  const isFetching = isFetchingEmail || isFetchingCode;
  const student = studentByEmail?.data || studentByCode?.data;
  console.log(student);

  // Handle errors
  useEffect(() => {
    if (errorEmail || errorCode) {
      toast.error("Failed to load student info.");
    }
  }, [errorEmail, errorCode]);

  // Combine the student result and update only when the relevant query resolves
  useEffect(() => {
    if (searched) {
      if (searchCriteria === "accessCode" && studentByCode?.data) {
        setCurrentStudent(studentByCode.data);
      } else if (searchCriteria === "emailPhone" && studentByEmail?.data) {
        setCurrentStudent(studentByEmail.data);
      } else if (studentByCode?.error || studentByEmail?.error) {
        setCurrentStudent(null);
      }
    }
  }, [
    studentByCode?.data,
    studentByEmail?.data,
    studentByCode?.error,
    studentByEmail?.error,
    searchCriteria,
    searched,
  ]);
  useEffect(() => {
    if (student) {
      reset({ criteria: "accessCode", value: "" });
    }
  }, [student, reset]);

  const onSubmit = (formData) => {
    setCurrentStudent(null);
    setSearched(false);
    setSearchCriteria(formData.criteria);
    setSearchValue(formData.value.trim());
    setSearched(true);
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-lg rounded-2xl space-y-2">
      <h1 className="text-xl md:text-3xl font-bold text-center">
        Student Lookup
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Search student records by Access Code or Email/Phone
      </p>

      <div className="pt-6">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 max-w-xl p-4 mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md"
          >
            <Dropdown
              label="Search Criteria"
              name="criteria"
              options={[
                { label: "Access Code", value: "accessCode" },
                { label: "Email / Phone", value: "emailPhone" },
              ]}
              rules={{ required: "Please select a criteria" }}
            />

            <InputField
              label="Enter Value"
              name="value"
              placeholder="Enter code, email, or phone"
              rules={{ required: "This field is required" }}
            />

            <Button
              type="submit"
              className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFetching}
            >
              {isFetching ? "Searching..." : "Search"}
              <Search className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </FormProvider>
        {/* Result Section */}

        {searched && (
          <div className="mt-6 max-w-xl mx-auto">
            {isFetching ? (
              <div className="flex justify-center items-center space-x-2 text-blue-500">
                <Loader2 className="animate-spin h-6 w-6" />
                <span>Loading student info...</span>
              </div>
            ) : currentStudent ? (
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-base md:text-2xl text-center">
                    Student Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {currentStudent.name && (
                    <p>
                      <strong>Name:</strong> {currentStudent.name}
                    </p>
                  )}
                  {currentStudent.email && (
                    <p>
                      <strong>Email:</strong> {currentStudent.email}
                    </p>
                  )}
                  {currentStudent.phone && (
                    <p>
                      <strong>Phone:</strong> {currentStudent.phone}
                    </p>
                  )}
                  {currentStudent.address && (
                    <p>
                      <strong>Address:</strong> {currentStudent.address}
                    </p>
                  )}
                  {currentStudent.status && (
                    <p>
                      <strong>Status:</strong> {currentStudent.status}
                    </p>
                  )}
                  {currentStudent.profilePhoto && (
                    <p>
                      <strong>Profile Photo:</strong>{" "}
                      <Image
                        src={currentStudent.profilePhoto}
                        alt={currentStudent.name}
                        className="w-16 h-16 object-cover rounded-full"
                        height={40}
                        width={40}
                      />
                    </p>
                  )}

                  {/* Courses */}
                  {currentStudent.course &&
                    currentStudent.course.length > 0 && (
                      <div>
                        <strong>Course Lists:</strong>
                        <ol className="ml-4 list-decimal space-y-1">
                          {currentStudent.course.map((c, index) => (
                            <li key={index} className="break-words">
                              <div className="pt-2">
                                {" "}
                                <span>
                                  <strong>Product Name:</strong>{" "}
                                  {c?.course?.productName || "N/A"}
                                </span>
                                <br />
                                <span>
                                  <strong>Access Code:</strong>{" "}
                                  {c?.accessCode || "N/A"}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                  {/* Invoice */}
                  {currentStudent.invoice && (
                    <p>
                      <strong>Invoice:</strong>{" "}
                      <a
                        href={currentStudent.invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Invoice
                      </a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <p className="text-center text-sm text-red-500 mt-4">
                No student found with given criteria.
              </p>
            )}{" "}
          </div>
        )}
      </div>
    </div>
  );
}
