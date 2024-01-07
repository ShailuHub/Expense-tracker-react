import { createSlice } from "@reduxjs/toolkit";

const initialThemeState = {
  isPremiumUser: false,
  enableDarkTheme: false,
};
const themeSlice = createSlice({
  name: "Theme",
  initialState: initialThemeState,
  reducers: {},
});

export default themeSlice;
