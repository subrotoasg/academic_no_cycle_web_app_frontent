import baseApi from "./baseApi";
import { tagTypesValue } from "../tagTypes";

const studentApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentByEmailOrPhone: builder.query({
      query: (identifier) => ({
        url: `/utils/get/${identifier}/student`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.STUDENT],
    }),

    // Get student by access code
    getStudentByAccessCode: builder.query({
      query: (accessCode) => ({
        url: `/utils/get/studentInfo/${accessCode}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.STUDENT],
    }),
  }),
});

export const {
  useGetStudentByEmailOrPhoneQuery,
  useGetStudentByAccessCodeQuery,
} = studentApiServices;

export default studentApiServices;
