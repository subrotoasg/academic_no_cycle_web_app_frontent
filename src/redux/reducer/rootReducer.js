import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../services/baseApi";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import authReducer from "../Features/authentication";
import courseReducer from "../Features/courseInfo";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth", "course"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default persistReducer(persistConfig, rootReducer);
