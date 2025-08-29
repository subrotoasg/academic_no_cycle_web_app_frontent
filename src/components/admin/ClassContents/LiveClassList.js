"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Loading from "../utilities/Loading";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import CourseSelect from "@/components/form/CourseSelect";
import {
  useDeleteLiveClassMutation,
  useGetAllLiveClassQuery,
} from "@/redux/services/liveClassApi";
import LiveClassTable from "./LiveClassTable";
import LiveClassEditDialog from "./LiveClassEditDialog";

const LiveClassList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);

  const [selectedLiveClass, setSelectedLiveClass] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [joinClassUrl, setJoinClassUrl] = useState(null);

  useEffect(() => {
    if (courses?.data?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses.data[0].id);
    }
  }, [courses, selectedCourseId]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch: refetchLiveClasses,
  } = useGetAllLiveClassQuery({
    page,
    limit,
    searchTerm: searchQuery,
  });

  const [deleteLiveClass] = useDeleteLiveClassMutation();
  // console.log(data);
  const meta = data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery("");
    setPage(1);
  }, [selectedCourseId]);

  const combinedClasses = useMemo(() => {
    const live = Array.isArray(data?.data?.liveClasses)
      ? data.data.liveClasses
      : Array.isArray(data?.data)
      ? data.data
      : [];

    const upcoming = Array.isArray(data?.data?.upcomingClasses)
      ? data.data.upcomingClasses
      : [];

    return [...live, ...upcoming];
  }, [data]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return combinedClasses;
    return [...combinedClasses]?.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [combinedClasses, sortConfig]);

  const handleEditModal = (liveClass) => {
    setSelectedLiveClass(liveClass);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (liveClass) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete "${liveClass?.title}" from live classes.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteLiveClass(liveClass.id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `"${liveClass?.title}" was deleted successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        refetchLiveClasses();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Something went wrong while deleting. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full p-2 lg:p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl space-y-4 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white text-center">
        Live Classes
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center">
        View and manage all scheduled live classes
      </p>

      {/* <CourseSelect
        label="Select Course"
        courses={courses?.data}
        selectedCourseId={selectedCourseId}
        onChange={setSelectedCourseId}
      /> */}

      {/* <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by live class title..."
        />
      </div> */}

      {(isLoading || isFetching) && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !(isLoading || isFetching) && (
        <div className="text-center text-red-500 py-4">
          Failed to load live classes.
        </div>
      )}

      {!(isLoading || isFetching) && !isError && (
        <>
          {!selectedCourseId || sortedData?.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Live Classes Found
            </div>
          ) : (
            <>
              <LiveClassTable
                contentData={Array.isArray(sortedData) ? sortedData : []}
                handleDelete={handleDelete}
                handleEditModal={handleEditModal}
                handleSort={handleSort}
              />
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

      <LiveClassEditDialog
        selectedLiveClass={selectedLiveClass}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        refetchLiveClasses={refetchLiveClasses}
      />
    </div>
  );
};

export default LiveClassList;
