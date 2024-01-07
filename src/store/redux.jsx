import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import expenseSlice from "../features/expenseSlice";
import themeSlice from "../features/themeSlice";
import profileSlice from "../features/profileSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    expense: expenseSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export const authAction = authSlice.actions;
export const expenseAction = expenseSlice.actions;
export const themeAction = themeSlice.actions;
export const profileAction = profileSlice.actions;

export default store;
