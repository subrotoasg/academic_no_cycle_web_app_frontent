import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrolledCourses: [],
};

export const studentCoursesSlice = createSlice({
  name: "studentCourses",
  initialState,
  reducers: {
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload.courses || [];
    },
    clearEnrolledCourses: (state) => {
      state.enrolledCourses = [];
    },
  },
});

// Selectors
export const selectEnrolledCourses = (state) =>
  state.studentCourses.enrolledCourses;

export const selectHasCourseAccess = (courseId) => (state) =>
  state.studentCourses.enrolledCourses.some(
    (enrollment) => enrollment.courseId === courseId
  );

export const { setEnrolledCourses, clearEnrolledCourses } =
  studentCoursesSlice.actions;

export default studentCoursesSlice.reducer;
