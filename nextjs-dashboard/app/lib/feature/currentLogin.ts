"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface CurrentLogin {
  value: any;
}

const initialState: CurrentLogin = {
  value: {
    id: "",
    type: "",
  }
};

export const currentLogin = createSlice({
  name: "currentLogin",
  initialState,
  reducers: {
    storeLoginInfo: (state, action) => {
      state.value = action.payload;
    },
    reset: () => initialState, // Reset state to initial value
  },
});

export const { storeLoginInfo, reset } = currentLogin.actions;
export default currentLogin.reducer;
