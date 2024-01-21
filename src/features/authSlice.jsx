import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));
const isEmailVerified = user ? user.emailVerified : "";

const initialAuthState = {
  isAuthenticated: !!user,
  toggleLoginToSignUp: true,
  isEmailVerified: !!isEmailVerified,
};

const authSlice = createSlice({
  name: "Authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      const { email, tokenId, uid } = action.payload;
      const user = { email: email, tokenId: tokenId, uid: uid };
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
    toggle(state) {
      state.toggleLoginToSignUp = !state.toggleLoginToSignUp;
    },
    emailVerification(state, action) {
      state.isEmailVerified = action.emailVerified;
    },
  },
});

export default authSlice;
