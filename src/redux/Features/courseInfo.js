import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  course: null,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    clearCourse: (state) => {
      state.course = null;
    },
  },
});

export const { setCourse, clearCourse } = courseSlice.actions;
export const selectCourse = (state) => state.course.course;

export default courseSlice.reducer;
