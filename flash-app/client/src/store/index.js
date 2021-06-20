import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../features/user/UserSlice";
import DepositReducer from "../features/deposit/DepositSlice";

export default configureStore({
  reducer: {
    user: UserReducer,
    deposits: DepositReducer
  }
});
