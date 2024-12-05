`use client`;

import { createSlice } from "@reduxjs/toolkit";

export interface CurrentLogin {
  value: any;
}

const initialState: CurrentLogin = {
  value: {},
};

export const currentLogin = createSlice({
  name: "currentLogin",
  initialState,
  reducers: {
    storeLoginInfo: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { storeLoginInfo } = currentLogin.actions;
export default currentLogin.reducer;
