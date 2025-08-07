"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";

const StudentRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useSelector(currentUser);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [user, router]);

  return isAuthorized ? children : <div>Loading...</div>;
};

export default StudentRoute;
