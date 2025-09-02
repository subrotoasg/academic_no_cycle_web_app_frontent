import { tagTypesValue } from "../tagTypes";
import baseApi from "./baseApi";

const studentInfoApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Me
    getMe: builder.query({
      query: () => ({
        url: "/get-me",
        method: "GET",
      }),
      providesTags: [tagTypesValue.USER_INFO],
    }),
    // Update Student Info Services
    updateUserStudent: builder.mutation({
      query: (formData) => ({
        url: `/student/profile/update`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [tagTypesValue.USER_INFO],
    }),
  }),
});

export const { useGetMeQuery, useUpdateUserStudentMutation } =
  studentInfoApiServices;

export default studentInfoApiServices;
