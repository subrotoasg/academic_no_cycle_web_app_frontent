"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminTable from "./AdminTable";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Loading from "../utilities/Loading";
import { useGetAdminsByCourseIdQuery } from "@/redux/services/adminApi";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";

export default function AdminList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const course = useSelector(selectCourse);
  const courseId = course?.id;

  const { data, isLoading, isError, refetch } = useGetAdminsByCourseIdQuery({
    page,
    limit,
    searchTerm: searchQuery,
    courseId,
  });

  const meta = data?.data?.meta;
  const adminData = data?.data?.data;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const sortedData = useMemo(() => {
    return adminData || [];
  }, [adminData]);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load admins.</div>
    );

  return (
    <div className="w-full p-1 lg:p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Admin List {course?.title}
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center">
        Manage and oversee course administrators
      </p>

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search... "
        />
      </div>

      {sortedData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No Admins Found</div>
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
    </div>
  );
}
