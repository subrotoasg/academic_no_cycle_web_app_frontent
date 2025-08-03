"use client";

import React, { useMemo, useState } from "react";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Swal from "sweetalert2";
import CycleTable from "./CycleTable";
import CycleInfoEditDialog from "./CycleInfoEditDialog";
import Loading from "../utilities/Loading";
import {
  useGetCyclesByCourseIdQuery,
  useDeleteCycleMutation,
} from "@/redux/services/cycleCreateApi";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";

function CycleList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [cycleEditModalOpen, setCycleEditModalOpen] = useState(false);

  const course = useSelector(selectCourse);
  const courseId = course?.id;

  const { data, isLoading, isError } = useGetCyclesByCourseIdQuery(courseId);
  const [deleteCycle] = useDeleteCycleMutation();

  const cycleData = data?.data || [];

  // Filter cycles based on search query
  const filteredData = useMemo(() => {
    return cycleData.filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cycleData, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Edit cycle information
  const handleCycleInfoEdit = (cycle) => {
    setSelectedCycle(cycle);
    setCycleEditModalOpen(true);
  };

  // Handle cycle deletion
  const handleCycleDelete = async (cycle) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${cycle.title}". This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteCycle(cycle.id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `"${cycle.title}" has been successfully deleted.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete the cycle. Please try again.",
          icon: "error",
        });
      }
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load cycles.</div>
    );

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        {" "}
        Cycle List for {course?.title}
      </h2>

      <p className="text-xs md:text-sm text-muted-foreground text-center mb-4">
        Manage and organize cycles for each course effortlessly
      </p>

      {/* Search Bar */}
      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by Cycle Title..."
        />
      </div>

      {paginatedData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No Cycles Found</div>
      ) : (
        <>
          <CycleTable
            cycles={paginatedData}
            handleCycleDelete={handleCycleDelete}
            handleCycleInfoEdit={handleCycleInfoEdit}
          />
          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
            totalItems={filteredData.length}
          />
        </>
      )}

      {/* Cycle Edit Modal */}
      <CycleInfoEditDialog
        cycle={selectedCycle}
        isOpen={cycleEditModalOpen}
        onOpenChange={setCycleEditModalOpen}
      />
    </div>
  );
}

export default CycleList;
