"use client";
import React, { useEffect, useMemo, useState } from "react";
import { NoticeTable } from "./NoticeTable";
import NoticeInfoEditDialog from "./NoticeInfoEditDialog";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import NoticeDetailsDialog from "./NoticeDetailsDialog";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";
import {
  useDeleteNoticeRoutineMutation,
  useGetNoticeRoutinesByCourseIdQuery,
} from "@/redux/services/noticeRoutineApi";
import { selectAllCourses } from "@/redux/Features/courseInfo";

export function NoticeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeInfoModalOpen, setNoticeInfoModalOpen] = useState(false);
  const [noticeEditModalOpen, setNoticeEditModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch: refetchNotices,
  } = useGetNoticeRoutinesByCourseIdQuery(
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

  const [deleteNoticeRoutine] = useDeleteNoticeRoutineMutation();

  const noticesData = data?.data?.data;
  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const sortedNotices = useMemo(() => {
    return noticesData;
  }, [noticesData]);

  const handleNoticeEditModal = (notice) => {
    setSelectedNotice(notice);
    setNoticeEditModalOpen(true);
  };

  const handleNoticeInfoModal = (notice) => {
    setSelectedNotice(notice);
    setNoticeInfoModalOpen(true);
  };

  const handleNoticeDelete = async (notice) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete the notice titled "${notice?.title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteNoticeRoutine(notice.id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `"${notice?.title}" has been successfully deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        refetchNotices();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the notice. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
        Course Notice & Routines
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Browse, edit, or delete the uploaded notices and routines.
      </p>
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

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by title ..."
        />
      </div>

      {isLoading && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-center text-red-500 py-4">
          Failed to load Notices.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {!selectedCourseId || sortedNotices.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Notice Found
            </div>
          ) : (
            <>
              <NoticeTable
                notices={sortedNotices}
                handleDelete={handleNoticeDelete}
                handleNoticeEditModal={handleNoticeEditModal}
                handleNoticeInfoModal={handleNoticeInfoModal}
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

      <NoticeDetailsDialog
        selectedNotice={selectedNotice}
        isOpen={noticeInfoModalOpen}
        onOpenChange={setNoticeInfoModalOpen}
      />

      <NoticeInfoEditDialog
        notice={selectedNotice}
        isOpen={noticeEditModalOpen}
        onOpenChange={setNoticeEditModalOpen}
        refetchNotices={refetchNotices}
      />
    </div>
  );
}
