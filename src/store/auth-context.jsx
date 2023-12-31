import { createContext } from "react";
const authContext = createContext({
  email: "",
  token: "",
  isVerified: false,
  isLoggedIn: false,
  isProfileCompleted: false,
  login: (token, email) => {},
  logout: () => {},
  autologout: () => {},
  verifyEmail: (verified) => {},
  profileCompleted: () => {},
});

export { authContext };
