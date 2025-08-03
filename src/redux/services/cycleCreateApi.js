import baseApi from "./baseApi";
import { tagTypesValue } from "../tagTypes";

const cycleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Cycle
    createCycle: builder.mutation({
      query: (formData) => ({
        url: "/cycle",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "cycle", id: "LIST" }],
    }),

    // Get Cycles by Course ID
    getCyclesByCourseId: builder.query({
      query: (courseId) => ({
        url: `/cycle/course/${courseId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((cycle) => ({
                type: "cycle",
                id: cycle.id,
              })),
              { type: "cycle", id: "LIST" },
            ]
          : [{ type: "cycle", id: "LIST" }],
    }),

    // Delete Cycle
    deleteCycle: builder.mutation({
      query: (cycleId) => ({
        url: `/cycle/${cycleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "cycle", id: "LIST" }],
    }),

    // Update Cycle
    updateCycle: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/cycle/${id}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "cycle", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCycleMutation,
  useGetCyclesByCourseIdQuery,
  useDeleteCycleMutation,
  useUpdateCycleMutation,
} = cycleApi;

export default cycleApi;
