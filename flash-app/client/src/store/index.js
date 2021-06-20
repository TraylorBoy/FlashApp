import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import UserReducer from "../features/user/UserSlice";
import DepositReducer from "../features/deposit/DepositSlice";
import FlashLoanReducer from "../features/flashloan/FlashLoanSlice";

const saga = createSagaMiddleware();
const middleware = [...getDefaultMiddleware({thunk: true}), saga];

const store = configureStore({
  reducer: {
    user: UserReducer,
    deposit: DepositReducer,
    flashloan: FlashLoanReducer
  },
  middleware
});

// TODO - Create saga's for API interaction
//saga.run()

export default store;
