import { createSlice } from "@reduxjs/toolkit";

const archiveAccessSlice = createSlice({
  name: "archiveAccess",
  initialState: { allowedArchiveCourseIds: [] },
  reducers: {
    grantArchiveAccess: (state, action) => {
      const courseId = action.payload;
      if (!state.allowedArchiveCourseIds.includes(courseId)) {
        state.allowedArchiveCourseIds.push(courseId);
      }
    },
    clearArchiveAccess: (state) => {
      state.allowedArchiveCourseIds = [];
    },
  },
});

export const { grantArchiveAccess, clearArchiveAccess } =
  archiveAccessSlice.actions;
export default archiveAccessSlice.reducer;
