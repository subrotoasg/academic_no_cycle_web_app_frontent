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
    // Update student (PATCH)
    updateStudent: builder.mutation({
      query: ({ id, email, phone }) => {
        const body = new URLSearchParams();
        if (email) body.append("email", email);
        if (phone) body.append("phone", phone);

        return {
          url: `/utils/update/${id}`,
          method: "PATCH",
          body,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
      invalidatesTags: [tagTypesValue.STUDENT],
    }),
  }),
});

export const {
  useGetStudentByEmailOrPhoneQuery,
  useGetStudentByAccessCodeQuery,
  useUpdateStudentMutation,
} = studentApiServices;

export default studentApiServices;
