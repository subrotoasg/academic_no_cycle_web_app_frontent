import { createSlice } from "@reduxjs/toolkit";
import studentCourseApi from "../services/studentCourseApi";

const initialState = {
  enrolledCourses: [],
  meta: null,
  isLoading: false,
  error: null
};

export const studentCoursesSlice = createSlice({
  name: "studentCourses",
  initialState,
  reducers: {
    clearEnrolledCourses: (state) => {
      state.enrolledCourses = [];
      state.meta = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      studentCourseApi.endpoints.getMyCourses.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      studentCourseApi.endpoints.getMyCourses.matchFulfilled,
      (state, { payload }) => {
        state.enrolledCourses = payload.data.data;
        state.meta = payload.data.meta;
        state.isLoading = false;
        state.error = null;
      }
    );
    builder.addMatcher(
      studentCourseApi.endpoints.getMyCourses.matchRejected,
      (state, { error }) => {
        state.isLoading = false;
        state.error = error.message;
      }
    );
  }
});

// Selectors
export const selectEnrolledCourses = (state) => state.studentCourses.enrolledCourses;
export const selectEnrolledCourseMeta = (state) => state.studentCourses.meta;
export const selectHasCourseAccess = (courseId) => (state) => 
  state.studentCourses.enrolledCourses.some(
    enrollment => enrollment.courseId === courseId
  );

export const { clearEnrolledCourses } = studentCoursesSlice.actions;
export default studentCoursesSlice.reducer;