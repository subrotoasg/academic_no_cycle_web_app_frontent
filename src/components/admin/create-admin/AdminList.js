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
import CourseSelect from "@/components/form/CourseSelect";

export default function AdminList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  // const course = useSelector(
  //   selectedCourseId ? selectSelectedCourse(selectedCourseId) : () => null
  // );

  // console.log(course);
  useEffect(() => {
    if (courses?.data?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses.data[0].id);
    }
  }, [courses, selectedCourseId]);

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
  // console.log(data);
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
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Course Admin List
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Manage and oversee course administrators
      </p>
      <CourseSelect
        label="Select Course"
        courses={courses?.data}
        selectedCourseId={selectedCourseId}
        onChange={setSelectedCourseId}
      />

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
              <div className="p-2">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search by email"
                />
              </div>
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
