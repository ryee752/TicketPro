"use client";
import { configureStore } from "@reduxjs/toolkit";
import currentLoginReducer from "./feature/currentLogin";

export const store = configureStore({
  reducer: {
    currentLogin: currentLoginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
