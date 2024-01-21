import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));
const isProfileCompleted = localStorage.getItem("isProfileCompleted");
const { displayName, photoUrl } = user ? user : {};
const initialProfileState = {
  firstName: "",
  lastName: "",
  photoUrl: photoUrl,
  displayName: displayName,
  isProfileCompleted: !!isProfileCompleted,
};

const profileSlice = createSlice({
  name: "Profile",
  initialState: initialProfileState,
  reducers: {
    // profileDetails(state, action) {
    //   state.firstName = action.payload.firstName;
    //   state.lastName = action.payload.lastName;
    //   state.photoUrl = action.payload.photoUrl;
    // },
    checkForProfileComplete(state, action) {
      (state.isProfileCompleted = action.payload.isProfileCompleted),
        (state.displayName = action.payload.displayName);
    },
  },
});

export default profileSlice;
