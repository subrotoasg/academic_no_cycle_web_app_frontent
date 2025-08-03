"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useSelector(currentUser);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [user, router]);

  return isAuthorized ? children : null;
};

export default PrivateRoute;
