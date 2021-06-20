import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect } from "../../scripts/connect";

const NETWORKS = (netID) => {
  switch (netID) {
    case 1: return "MAINNET"
    case 3: return "ROPSTEN"
    case 4: return "RINKEBY"
    case 5: return "GOERLI"
    case 42: return "KOVAN"
    default: return "WRONG NETWORK"
  }
};

export const getWallet = createAsyncThunk("user/getWallet", async () => {
  const wallet = await connect();
  return wallet;
});

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    wallet: {
      address: "",
      balance: 0
    },
    connection: {
      status: "",
      error: "",
      success: false,
      network: ""
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
      state.connection.network = NETWORKS(action.payload.netID);

      state.wallet.address = action.payload.address;
      state.wallet.balance = action.payload.balance;


    },
    [getWallet.rejected]: (state, action) => {
      state.connection.status = "request_fail";
      state.connection.error = action.error.message;
    }
  }
});

export const { attemptConnect } = UserSlice.actions;

export default UserSlice.reducer;
