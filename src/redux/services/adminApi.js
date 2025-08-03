import baseApi from "./baseApi";
import { tagTypesValue } from "../tagTypes";
import {
  pathUrlGenerator,
  quearyUrlGenerator,
} from "../utilities/quearyParamsGenerator";

const adminApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Admin
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/supadmn/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "admin", id: "LIST" }],
    }),

    // Get All Admins (with pagination & query)
    getAdmins: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator("/supadmn", queryParams);
        return {
          url,
          method: "GET",
        };
      },

      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((admin) => ({
                type: "admin",
                id: admin.id,
              })),
              { type: "admin", id: "LIST" },
            ]
          : [{ type: "admin", id: "LIST" }],
    }),

    // Get Admins by Course ID
    getAdminsByCourseId: builder.query({
      query: (queryParams) => {
        const { courseId, ...query } = queryParams;
        const url = pathUrlGenerator(
          `/supadmn/course-admin/${courseId}`,
          query
        );
        return {
          url,
          method: "GET",
        };
      },

      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((admin) => ({
                type: "admin",
                id: admin.id,
              })),
              { type: "admin", id: "LIST" },
            ]
          : [{ type: "admin", id: "LIST" }],
    }),

    // Delete Admin
    deleteAdmin: builder.mutation({
      query: (adminId) => ({
        url: "/supadmn/delete-admin",
        method: "DELETE",
        body: { adminId },
      }),

      invalidatesTags: [{ type: "admin", id: "LIST" }],
    }),

    // Get Admin by Email or Phone
    getAdminByEmailOrPhone: builder.query({
      query: (filter) => ({
        url: `/supadmn/?filter=${filter}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.ADMIN],
    }),

    assignCoursesToAdmins: builder.mutation({
      query: (data) => ({
        url: `/supadmn/assign-admin-course`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useGetAdminsByCourseIdQuery,
  useDeleteAdminMutation,
  useGetAdminByEmailOrPhoneQuery,
  useAssignCoursesToAdminsMutation,
} = adminApiServices;

export default adminApiServices;
