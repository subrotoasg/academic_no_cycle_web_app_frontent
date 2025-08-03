"use client";

import React, { useMemo, useState } from "react";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import AdminAssignTable from "./AdminAssignTable";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
// import { removeCoursesAdminAccess } from "@/api/admin/CoursesToAdmins/CoursesToAdminsApis";

function AdminAssignList({
  adminAssignedInfo,
  loading,
  fetchAssignedAdminInfo,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const savedInfo = adminAssignedInfo;

  const filteredData = useMemo(() => {
    if (!Array.isArray(savedInfo)) return [];
    return savedInfo.filter(
      (item) =>
        item?.admin?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.course?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [savedInfo, searchQuery]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal =
        getNestedValue(a, sortConfig.key)?.toString().toLowerCase() || "";
      const bVal =
        getNestedValue(b, sortConfig.key)?.toString().toLowerCase() || "";

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async (assignInfo) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to remove admin access from "${assignInfo?.admin?.name}". This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await removeCoursesAdminAccess(
          assignInfo?.course?.id,
          assignInfo?.admin?.id
        );
        Swal.fire({
          title: "Deleted!",
          text: `Successfully Access Removed from ${assignInfo?.admin?.name}.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Something went wrong while removing access of the course. Please try again.",
          icon: "error",
        });
      }
      await fetchAssignedAdminInfo();
    }
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
<h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">        Assigned Admins List
      </h2>

      <p className="text-muted-foreground text-center mt-2">
        Manage the assignment of admins to their respective courses
      </p>

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by Admin or Course..."
        />
      </div>

      {loading ? (
        <Loading />
      ) : paginatedData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No Data Exist.</div>
      ) : (
        <AdminAssignTable
          assignedData={paginatedData}
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        totalItems={sortedData.length}
      />
    </div>
  );
}

export default AdminAssignList;
