import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect } from "../../scripts/connect";

export const getWallet = createAsyncThunk("user/getWallet", async () => {
  const wallet = await connect();
  return wallet;
});

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    wallet: {
      address: "",
      balance: 0,
      netID: 0
    },
    connection: {
      status: "",
      error: "",
      success: false
    }
  },
  reducers: {
    attemptConnect: (state) => {
      state.connection.status = "request_pending";
    }
  },
  extraReducers: {
    [getWallet.pending]: state => {
      state.connection.status = "request_sent";
    },
    [getWallet.fulfilled]:  (state, action) => {
      state.connection.status = "request_fulfilled";
      state.connection.success = true;
      state.wallet = action.payload;
    },
    [getWallet.rejected]: (state, action) => {
      state.connection.status = "request_fail";
      state.connection.error = action.error.message;
    }
  }
});

export const { attemptConnect } = UserSlice.actions;

export default UserSlice.reducer;
