import { createSlice } from "@reduxjs/toolkit";

export const DepositSlice = createSlice({
  name: "deposit",
  initialState: {
    premium: 0.09,
    owing: 0,
    forAmount: 0,
  },
  reducers: {
    setPremium: (state, action) => {state.premium = action.payload},
    setAmount: (state, action) => {
      state.owing = action.payload._fee;
      state.forAmount = action.payload._loanAmount;
    }
  }
});

export const {
  setPremium,
  setAmount
} = DepositSlice.actions;

export default DepositSlice.reducer;
