import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  selectedCourseId: null,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.selectedCourseId = null;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourseId = action.payload;
    },
  },
});

export const { setCourses, clearCourses, setSelectedCourse } =
  courseSlice.actions;

export const selectAllCourses = (state) => state.course.courses;
export const selectSelectedCourse = (courseId) => (state) => {
  return state.course.courses.find((c) => c.id === courseId) || null;
};
export default courseSlice.reducer;
