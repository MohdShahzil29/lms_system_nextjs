"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  email: string;
  role: string;
  id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  purchases: string[];
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  purchases:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("purchases") || "[]")
      : [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload)
        localStorage.setItem("user", JSON.stringify(action.payload));
      else localStorage.removeItem("user");
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) localStorage.setItem("token", action.payload);
      else localStorage.removeItem("token");
    },
    setPurchases: (state, action: PayloadAction<string[]>) => {
      state.purchases = action.payload;
      localStorage.setItem("purchases", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.purchases = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("purchases");
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
    },
    setPurchaseCourse: (state, action: PayloadAction<string>) => {
      if (!state.purchases.includes(action.payload)) {
        state.purchases.push(action.payload);
        localStorage.setItem("purchases", JSON.stringify(state.purchases));
      }
    },
  },
});

export const { setUser, setToken, setPurchases, logout, setPurchaseCourse } =
  authSlice.actions;
export default authSlice.reducer;
