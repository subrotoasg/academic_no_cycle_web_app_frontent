import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesArrays } from "../tagTypes";
import { serverUrl } from "../../../config/config";

//Headers Setup For all Quearies
const baseQuery = fetchBaseQuery({
  baseUrl: serverUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("x-access-token", `${token}`);
    }
    return headers;
  },
});

//Base Api Setup
const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: tagTypesArrays,
});

export default baseApi;
