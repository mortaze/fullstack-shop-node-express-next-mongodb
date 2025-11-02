import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  accessToken: undefined,
  admin: undefined,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLoggedIn: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.admin = payload.admin;
    },
    adminLoggedOut: (state) => {
      state.accessToken = undefined;
      state.admin = undefined;
      Cookies.remove("adminInfo");
    },
  },
});

export const { adminLoggedIn, adminLoggedOut } = adminSlice.actions;
export default adminSlice.reducer;
