import { combineReducers } from "@reduxjs/toolkit";
import { UserState, persistedUserAuthReducer as userReducer } from "./userAuth/userAuthSlice";

// Define state types for each slice
export interface RootState {
  userAuth: UserState;
  
}

const rootReducer = combineReducers({
  userAuth: userReducer, 
  
});

export default rootReducer;