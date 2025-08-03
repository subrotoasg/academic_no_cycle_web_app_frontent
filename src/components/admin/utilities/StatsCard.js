"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";

const StatsCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <CountUp end={value} duration={1.5} separator="," />
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
