import { createSlice } from "@reduxjs/toolkit";

export const DepositSlice = createSlice({
  name: "deposit",
  initialState: {
    premium: 0.09,
    amount: 0
  },
  reducers: {
    setPremium: (state, action) => {state.premium = action.payload},
    setAmount: (state, action) => {
      if (action.payload > 0) state.amount = action.payload;
    }
  }
});

export const {
  setPremium,
  setAmount
} = DepositSlice.actions;

export default DepositSlice.reducer;
