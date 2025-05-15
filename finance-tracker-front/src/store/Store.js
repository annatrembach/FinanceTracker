import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // НЕ додавай thunk — він вже є в getDefaultMiddleware()
});

export default store;