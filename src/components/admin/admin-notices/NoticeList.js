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
import { selectCourse } from "@/redux/Features/courseInfo";
import {
  useDeleteNoticeRoutineMutation,
  useGetNoticeRoutinesByCourseIdQuery,
} from "@/redux/services/noticeRoutineApi";

export function NoticeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeInfoModalOpen, setNoticeInfoModalOpen] = useState(false);
  const [noticeEditModalOpen, setNoticeEditModalOpen] = useState(false);

  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const {
    data,
    isLoading,
    isError,
    refetch: refetchNotices,
  } = useGetNoticeRoutinesByCourseIdQuery({
    page,
    limit,
    searchTerm: searchQuery,
    courseId,
  });

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

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Failed to load Notice listings.
      </div>
    );

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Notice & Routine for {course?.title}
      </h2>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Manage the uploaded notices and routines.
      </p>

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by title ..."
        />
      </div>

      {sortedNotices.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No Notice Found</div>
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
