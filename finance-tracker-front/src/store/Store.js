import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;