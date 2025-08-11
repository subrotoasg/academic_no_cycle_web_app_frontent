import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";

import { serverUrl } from "../../../config/config";
import { removeUser, setUserFromToken } from "../Features/authentication";
import { getCookie } from "../utilities/cookies";

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

  // Check for token expiration
  if (
    result.error &&
    (result.error.status === 401 ||
      result.error.data?.message === "jwt expired" ||
      result.error.data?.erroSourses?.some((e) => e.message === "jwt expired"))
  ) {
    // Try refreshing token
    const refreshResult = await baseQuery(
      {
        url: "/refresh-token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify({ refreshToken: getCookie("refreshToken") }),
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setUserFromToken(refreshResult.data.data));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(removeUser());
    }
  }

  return result;
};
