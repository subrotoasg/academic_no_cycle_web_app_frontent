import { persistStore } from "redux-persist";
import baseApi from "./services/baseApi";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REGISTER",
          "persist/REHYDRATE",
        ],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
