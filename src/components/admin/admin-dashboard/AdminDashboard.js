"use client";

import React from "react";
import { Users, UserPlus, Film, Bell, BadgeSwissFranc } from "lucide-react";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import { useGetAdminsByCourseIdQuery } from "@/redux/services/adminApi";
// import { selectCourse } from "@/redux/Features/courseInfo";
import Loading from "../utilities/Loading";
import { useGetAllClassContentsQuery } from "@/redux/services/contentsApi";
import { useGetFeaturesByCourseIdQuery } from "@/redux/services/featuredApi";
import { useGetNoticeRoutinesByCourseIdQuery } from "@/redux/services/noticeRoutineApi";

import DashboardCharts from "./DashboardCharts";

function AdminDashboard() {
  // const course = useSelector(selectCourse);
  // const courseId = course?.id;
  const courseId = "a220ea44-dfb4-4d4d-a073-50f6bd7d6669";
  const user = useSelector(currentUser);
  const name = user?.name || "Admin";

  const { data: adminData, isLoading: adminLoading } =
    useGetAdminsByCourseIdQuery({ courseId });
  const { data: contentData, isLoading: contentLoading } =
    useGetAllClassContentsQuery({ courseId });
  const { data: featureData, isLoading: featureLoading } =
    useGetFeaturesByCourseIdQuery({ courseId });
  const { data: noticeData, isLoading: noticeLoading } =
    useGetNoticeRoutinesByCourseIdQuery({ courseId });

  const isAnyLoading =
    adminLoading || contentLoading || featureLoading || noticeLoading;

  if (isAnyLoading) {
    return <Loading />;
  }

  const admins = adminData?.data?.data.length || 0;
  const videos = contentData?.data?.data.length || 0;
  const features = featureData?.data?.data.length || 0;
  const notices = noticeData?.data?.data.length || 0;

  const staticData = {
    students: 1234,
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
      title: "Students",
      value: staticData.students,
      icon: Users,
      subtitle: "+12% from last month",
      link: "/admin/RegisteredStudents",
    },

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
        <DashboardCharts stats={staticData} statsData={statsData} />
      </div>
    </div>
  );
}

export default AdminDashboard;
