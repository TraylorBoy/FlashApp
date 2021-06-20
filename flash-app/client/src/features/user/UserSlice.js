import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    address: "",
    balance: 0,
    isConnected: false
  },
  reducers: {
    connect = (state, action) => {
      state.isConnected = action.payload.connected;
      state.address = action.payload.address;
      state.balance = action.payload.balance;
    }
  }
});

export default {
  connect
} = UserSlice.actions;
