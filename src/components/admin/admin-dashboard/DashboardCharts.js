"use client";

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

const COLORS = ["#454706", "#0f2b44", "#0c453a", "#401206"];

const DashboardCharts = ({ stats }) => {
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
        data-aos="fade-up"
      >
        <h2 className="text-base md:text-xl font-bold text-gray-950 dark:text-white text-center mb-4">
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
        className="bg-blue-100 dark:bg-white rounded-2xl mt-3 p-2 md:p-4 shadow-md"
        data-aos="fade-down"
      >
        <h2 className="text-base md:text-xl text-black  dark:text-gray-950 font-bold text-center mb-4 py-3">
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
