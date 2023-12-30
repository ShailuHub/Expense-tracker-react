import { createContext } from "react";
const authContext = createContext({
  email: "",
  token: "",
  isLoggedIn: false,
  login: (token, email) => {},
  logout: () => {},
  autologout: () => {},
});

export { authContext };
