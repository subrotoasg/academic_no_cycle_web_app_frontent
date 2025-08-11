"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Film, Bell, BadgeSwissFranc } from "lucide-react";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import { useGetAdminsByCourseIdQuery } from "@/redux/services/adminApi";
import Loading from "../utilities/Loading";
import { useGetAllClassContentsQuery } from "@/redux/services/contentsApi";
import { useGetFeaturesByCourseIdQuery } from "@/redux/services/featuredApi";
import { useGetNoticeRoutinesByCourseIdQuery } from "@/redux/services/noticeRoutineApi";
import DashboardCharts from "./DashboardCharts";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import CourseSelect from "@/components/form/CourseSelect";

function AdminDashboard() {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const user = useSelector(currentUser);
  const name = user?.name || "Admin";
  useEffect(() => {
    if (courses?.data?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses.data[0].id);
    }
  }, [courses, selectedCourseId]);

  const { data: adminData, isLoading: adminLoading } =
    useGetAdminsByCourseIdQuery(
      { courseId: selectedCourseId },
      {
        skip: !selectedCourseId,
      }
    );
  const { data: contentData, isLoading: contentLoading } =
    useGetAllClassContentsQuery(
      { courseId: selectedCourseId },
      {
        skip: !selectedCourseId,
      }
    );
  const { data: featureData, isLoading: featureLoading } =
    useGetFeaturesByCourseIdQuery(
      { courseId: selectedCourseId },
      {
        skip: !selectedCourseId,
      }
    );

  const { data: noticeData, isLoading: noticeLoading } =
    useGetNoticeRoutinesByCourseIdQuery(
      { courseId: selectedCourseId },
      {
        skip: !selectedCourseId,
      }
    );

  const isAnyLoading =
    adminLoading || contentLoading || featureLoading || noticeLoading;

  const admins = adminData?.data?.data.length || 0;
  const videos = contentData?.data?.data.length || 0;
  const features = featureData?.data?.data.length || 0;
  const notices = noticeData?.data?.data.length || 0;

  const staticData = {
    admins: admins,
    videos: videos,
    features: features,
    notices: notices,
  };
  const chartData = [
    // { name: "Students", value: students },
    { name: "Admins", value: admins },
    { name: "Videos", value: videos },
    { name: "Features", value: features },
    { name: "Notices", value: notices },
  ];

  const statsData = [
    {
      title: "Admins",
      value: staticData.admins,
      icon: UserPlus,
      subtitle: `+${staticData.admins} new this month`,
      link: "/admin/create-admin",
    },
    {
      title: "Videos",
      value: staticData.videos,
      icon: Film,
      subtitle: `+${staticData.videos} new this month`,
      link: "/admin/courseClassContent",
    },
    {
      title: "Features",
      value: staticData.features,
      icon: BadgeSwissFranc,
      subtitle: `+${staticData.features} from last month`,
      link: "/admin/featured",
    },
    {
      title: "Notices",
      value: staticData.notices,
      icon: Bell,
      subtitle: `+${staticData.notices} new this month`,
      link: "/admin/notices",
    },
  ];

  return (
    <div className="w-full p-2">
      <div data-aos="fade-down">
        <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
          Welcome {name}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
          Visual representation of the course statistics
        </p>
      </div>
      <div>
        <CourseSelect
          label="Select Course"
          courses={courses?.data}
          selectedCourseId={selectedCourseId}
          onChange={setSelectedCourseId}
        />

        {selectedCourseId ? (
          isAnyLoading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : (
            <DashboardCharts stats={staticData} statsData={statsData} />
          )
        ) : (
          <div className="text-center text-muted-foreground text-sm mt-4">
            Please select a course to view dashboard data.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
