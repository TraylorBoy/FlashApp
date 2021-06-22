import { createSlice } from "@reduxjs/toolkit";

export const FlashLoanSlice = createSlice({
  name: "flashloan",
  initialState: {
    CONFIG: {
      SENDER: "",
      BALANCE: 0,
      DEPOSIT_AMOUNT: 0,
      LOAN_AMOUNT: 0,
      TOKEN: ""
    }
  },
  reducers: {
    setupLoan: (state, action) => {
      const settings = action.payload;

      state.CONFIG.SENDER = settings.sender;
      state.CONFIG.BALANCE = settings.balance;
      state.CONFIG.DEPOSIT_AMOUNT = settings.depositAmount;
      state.CONFIG.LOAN_AMOUNT = settings.loanAmount;
      state.CONFIG.TOKEN = settings.token;
    }
  }
});

export const {
  setupLoan
} = FlashLoanSlice.actions;

export default FlashLoanSlice.reducer;
