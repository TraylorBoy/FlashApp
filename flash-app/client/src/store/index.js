import { configureStore } from "@reduxjs/toolkit";
import DepositReducer from "../features/deposit/DepositSlice";

export default configureStore({
  reducer: {
    deposits: DepositReducer
  }
});
