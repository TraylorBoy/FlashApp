import FlashApp from "../../scripts/api/flashApp";
import { all, take, select, call } from "redux-saga/effects";

function* setup() {
  const action = yield take("flashloan/setupLoan");
  const state = yield select();

  const config = state.flashloan.CONFIG;
  console.log(config)

  const flashApp = new FlashApp(config);
  const tx = yield call(flashApp.run);
  console.log(tx);
}

export default function* rootSaga() {
  yield all([
    setup()
  ])
}
