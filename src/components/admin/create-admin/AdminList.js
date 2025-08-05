"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminTable from "./AdminTable";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Loading from "../utilities/Loading";
import { useGetAdminsByCourseIdQuery } from "@/redux/services/adminApi";
import { useSelector } from "react-redux";
import {
  selectAllCourses,
  selectSelectedCourse,
} from "@/redux/Features/courseInfo";

export default function AdminList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const course = useSelector(
    selectedCourseId ? selectSelectedCourse(selectedCourseId) : () => null
  );

  console.log(course);

  const { data, isLoading, isError, refetch } = useGetAdminsByCourseIdQuery(
    {
      page,
      limit,
      searchTerm: searchQuery,
      courseId: selectedCourseId,
    },
    {
      skip: !selectedCourseId,
    }
  );

  const meta = data?.data?.meta;
  const adminData = data?.data?.data;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const sortedData = useMemo(() => {
    return adminData || [];
  }, [adminData]);

  return (
    <div className="w-full p-1 lg:p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl mt-3">
      <div className="p-2 grid grid-cols-2">
        <label className="text-xs md:text-base w-full font-medium text-gray-700 dark:text-gray-300">
          Select Course
        </label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white text-xs md:text-sm"
        >
          <option value="">-- Select Course --</option>
          {courses?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.productName}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Course Admin List {course?.productName}
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Manage and oversee course administrators
      </p>

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by email"
        />
      </div>

      {isLoading && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-center text-red-500 py-4">
          Failed to load admins.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {sortedData.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Admins Found
            </div>
          ) : (
            <>
              <AdminTable admins={sortedData} refetch={refetch} />
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                pageSize={limit}
                setPageSize={setLimit}
                setCurrentPage={setPage}
                totalItems={meta?.totalCount}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
