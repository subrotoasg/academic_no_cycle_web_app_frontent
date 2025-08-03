"use client";
import React, { useEffect, useMemo, useState } from "react";
import FeaturedDetailsDialog from "./FeaturedDetailsDialog";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import { FeaturedTable } from "./FeaturedTable";
import FeaturedInfoEditDialog from "./FeaturedInfoEditDialog";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";
import {
  useDeleteFeaturedMutation,
  useGetFeaturesByCourseIdQuery,
} from "@/redux/services/featuredApi";

export function FeaturedList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureInfoModalOpen, setFeatureInfoModalOpen] = useState(false);
  const [featureEditModalOpen, setFeatureEditModalOpen] = useState(false);

  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const {
    data,
    isLoading,
    isError,
    refetch: refetchFeatures,
  } = useGetFeaturesByCourseIdQuery({
    page,
    limit,
    searchTerm: searchQuery,
    courseId,
  });
  const [deleteFeatured] = useDeleteFeaturedMutation();

  const featuresData = data?.data?.data;
  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const sortedFeatures = useMemo(() => {
    return featuresData;
  }, [featuresData]);

  const handleFeatureEditModal = (feature) => {
    setSelectedFeature(feature);
    setFeatureEditModalOpen(true);
  };

  const handleFeatureInfoModal = (feature) => {
    setSelectedFeature(feature);
    setFeatureInfoModalOpen(true);
  };

  const handleFeatureDelete = async (feature) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete "${feature?.title}". This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteFeatured(feature.id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `"${feature?.title}" was deleted successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        refetchFeatures();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Something went wrong while deleting. Please try again.",
          icon: "error",
        });
      }
    }
  };
  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Failed to load featured listings.
      </div>
    );

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Featured Listings for {course?.title}
      </h2>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        View, edit, or delete featured content, discounts, and offers.
      </p>

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by Title..."
        />
      </div>

      {sortedFeatures.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No Featured Items Found
        </div>
      ) : (
        <>
          <FeaturedTable
            features={sortedFeatures}
            handleDelete={handleFeatureDelete}
            handleFeatureEditModal={handleFeatureEditModal}
            handleFeatureInfoModal={handleFeatureInfoModal}
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

      <FeaturedDetailsDialog
        selectedFeature={selectedFeature}
        isOpen={featureInfoModalOpen}
        onOpenChange={setFeatureInfoModalOpen}
      />

      <FeaturedInfoEditDialog
        featured={selectedFeature}
        isOpen={featureEditModalOpen}
        onOpenChange={setFeatureEditModalOpen}
        refetchFeatures={refetchFeatures}
      />
    </div>
  );
}
