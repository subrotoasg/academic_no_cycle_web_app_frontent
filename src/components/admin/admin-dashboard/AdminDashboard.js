"use client";

import React from "react";
import { Users, Film, Bell, BadgeSwissFranc, ShieldUser } from "lucide-react";
import StatsCard from "../utilities/StatsCard";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import { useGetAdminsByCourseIdQuery } from "@/redux/services/adminApi";
import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetNoticeRoutinesByCourseIdQuery } from "@/redux/services/noticeRoutineApi";
import Link from "next/link";
import { useGetFeaturesByCourseIdQuery } from "@/redux/services/featuredApi";
import { useGetAllCycleClassContentsQuery } from "@/redux/services/cycleClassContentApi";
import DashboardCharts from "./DashboardCharts";
import Loading from "../utilities/Loading";

function AdminDashboard() {
  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const user = useSelector(currentUser);
  const name = user?.name || "Admin";

  const { data: adminData, isLoading: adminLoading } =
    useGetAdminsByCourseIdQuery({
      courseId,
    });
  const { data: contentData, isLoading: contentLoading } =
    useGetAllCycleClassContentsQuery({
      courseId,
    });

  const { data: featureData, isLoading: featureLoading } =
    useGetFeaturesByCourseIdQuery({
      courseId,
    });
  const { data: noticeData, isLoading: noticeLoading } =
    useGetNoticeRoutinesByCourseIdQuery({
      courseId,
    });

  const isAnyLoading =
    adminLoading || featureLoading || noticeLoading || contentLoading;

  if (isAnyLoading) {
    return <Loading />;
  }

  const admins = adminData?.data?.data.length || 0;
  const videos = contentData?.data?.length || 0;
  const features = featureData?.data?.data.length || 0;
  const notices = noticeData?.data?.data.length || 0;

  const staticData = {
    students: 1234,
    admins: admins,
    videos: videos,
    features: features,
    notices: notices,
  };

  const statsData = [
    {
      title: "Students",
      value: 1234,
      icon: Users,
      subtitle: "+12% from last month",
      link: "/admin/RegisteredStudents",
    },
    {
      title: "Admins",
      value: staticData.admins,
      icon: ShieldUser,
      subtitle: `+${staticData.admins} new this month`,
      link: "/admin/create-admin",
    },
    {
      title: "Videos",
      value: staticData.videos,
      icon: Film,
      subtitle: `+${staticData.videos} new this month`,
      link: "/admin/cycleClassContent",
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
    <div className="w-full p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5  ">
        Welcome {name}
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Easily manage and control your course
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-3 mt-6">
        {statsData.map((data, index) => (
          <Link key={index} href={data.link}>
            <StatsCard
              title={data.title}
              value={data.value}
              icon={data.icon}
              subtitle={data.subtitle}
            />
          </Link>
        ))}
      </div>
      <div>
        <DashboardCharts stats={staticData} />
      </div>
    </div>
  );
}

export default AdminDashboard;
