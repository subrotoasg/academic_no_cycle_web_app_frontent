import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    // Set token, decode it, and store both decoded user and token
    setUserFromToken: (state, action) => {
      const token = action.payload;
      try {
        const decoded = jwtDecode(token);
        state.token = token;
        state.user = decoded;
      } catch (error) {
        console.error("Invalid token format", error);
        state.token = null;
        state.user = null;
      }
    },

    removeUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export default authSlice.reducer;
export const { setUserFromToken, removeUser } = authSlice.actions;

export const userToken = (state) => state?.auth?.token;
export const currentUser = (state) => state?.auth?.user;
