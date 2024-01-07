import { createSlice } from "@reduxjs/toolkit";

const initialProfileState = {
  firstName: "",
  lastName: "",
  photoUrl: "",
  displayName: "",
  isProfileCompleted: false,
};

const profileSlice = createSlice({
  name: "Profile",
  initialState: initialProfileState,
  reducers: {
    profileDetails(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.photoUrl = action.payload.photoUrl;
    },
    checkForProfileComplete(state, action) {
      (state.isProfileCompleted = action.payload.isProfileCompleted),
        (state.displayName = action.payload.displayName);
    },
  },
});

export default profileSlice;
