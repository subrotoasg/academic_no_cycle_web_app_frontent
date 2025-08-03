"use client";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "../store";
import { Toaster } from "sonner";

export default function PersistorProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: "16px 10px",
          },
        }}
        richColors
      />
    </Provider>
  );
}
