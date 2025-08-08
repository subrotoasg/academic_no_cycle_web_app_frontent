import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../services/baseApi";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import authReducer from "../Features/authentication";
import courseReducer from "../Features/courseInfo";
import studentCoursesReducer from "../Features/mycourses";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth", "course", "studentCourses"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  studentCourses: studentCoursesReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default persistReducer(persistConfig, rootReducer);
