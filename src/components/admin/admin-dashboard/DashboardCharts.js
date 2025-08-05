"use client";

import Link from "next/link";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "../utilities/StatsCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const DashboardCharts = ({ stats, statsData }) => {
  const Data = [
    // { name: "Students", value: stats.students },
    { name: "Admins", value: stats.admins },
    {
      name: "Contents",
      value: stats.videos,
    },

    {
      name: "Features",
      value: stats.features,
    },
    {
      name: "Announcements",
      value: stats.notices,
    },
  ];

  return (
    <div className="gap-2 md:gap-6 mt-10">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-2 md:p-4 shadow-md"
        data-aos="fade-right"
      >
        <h2 className="text-base md:text-xl font-bold text-center text-gray-800 dark:text-white py-3">
          Course Operational Stats Overview
        </h2>
        <ResponsiveContainer width="95%" height={350}>
          <BarChart data={Data}>
            <CartesianGrid strokeDasharray="3 2" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4773e1" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-3 mt-6"
        data-aos="fade-up"
      >
        {statsData.map((data, index) => (
          <Link key={index} href={data.link}>
            <StatsCard
              key={index}
              title={data.title}
              value={data.value}
              icon={data.icon}
              subtitle={data.subtitle}
            />
          </Link>
        ))}
      </div>
      <div
        className="bg-gray-200 dark:bg-gray-800 rounded-2xl mt-3 p-2 md:p-4 shadow-md"
        data-aos="fade-down"
      >
        <h2 className="text-base md:text-xl font-bold text-center text-gray-800 dark:text-white py-3">
          Platform Insights
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {Data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
