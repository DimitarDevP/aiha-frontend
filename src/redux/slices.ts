import { combineReducers } from "@reduxjs/toolkit";
import { UserState, persistedUserAuthReducer as userReducer } from "./userAuth/userAuthSlice";
import { persistedCardReducer as cardReducer, CardState } from "./beAware/beAwareSlice"; // Adjust the import path as needed

export interface RootState {
  userAuth: UserState;
  card: CardState;
}

const rootReducer = combineReducers({
  userAuth: userReducer,
  card: cardReducer, // Add the card reducer
});

export default rootReducer;