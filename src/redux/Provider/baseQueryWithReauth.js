import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";

import { serverUrl } from "../../../config/config";
import { removeUser, setUserFromToken } from "../Features/authentication";
import { deleteCookie, getCookie } from "../utilities/cookies";
import { clearEnrolledCourses } from "../Features/mycourses";
import { clearArchiveAccess } from "../Features/archiveAccess";

const baseUrl = serverUrl;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("x-access-token", `${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // console.log(result);

  if (
    result.error &&
    (result.error.status === 401 ||
      result.error.data?.message === "jwt expired" ||
      result.error.data?.message === "invalid refresh token" ||
      result.error.data?.message === "Please Login.")
  ) {
    const refreshToken = getCookie("refreshToken");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/refresh-token",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: qs.stringify({ refreshToken }),
        },
        api,
        extraOptions
      );

      if (refreshResult?.data?.data) {
        api.dispatch(setUserFromToken(refreshResult.data.data));

        result = await baseQuery(args, api, extraOptions);
      } else {
        handleForceLogout(api);
      }
    } else {
      handleForceLogout(api);
    }
  }
  return result;
};

function handleForceLogout(api) {
  deleteCookie("refreshToken");
  api.dispatch(removeUser());
  api.dispatch(clearEnrolledCourses());
  api.dispatch(clearArchiveAccess());

  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.location.href = "/login";
    }, 10);
  }
}
