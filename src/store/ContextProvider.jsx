import { useEffect, useState } from "react";
import { authContext } from "./auth-context";

export const AuthContextProvider = (props) => {
  const initialEmail = localStorage.getItem("email");
  const initialToken = localStorage.getItem("token");
  const initialEmailVerification = localStorage.getItem("isVerified");
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [isEmailVerified, setEmailVerified] = useState(
    initialEmailVerification
  );
  const [isProfileCompleted, setisProfileCompleted] = useState(false);
  const userLoggedIn = !!initialEmail;

  // create a logoutTimer Variable
  let logoutTimer;
  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      loginHandler;
    }, 100000);
  };

  const loginHandler = (email, token) => {
    setToken(token);
    setEmail(email);

    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    resetLogoutTimer();
  };
  const logoutHandler = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setEmail(null);
    setToken(null);
    clearTimeout(logoutTimer);
  };
  const autologoutHandler = () => {
    resetLogoutTimer();
  };

  const emailVerificationHandler = (verified) => {
    localStorage.setItem("isVerified", verified);
    setEmailVerified(verified);
  };

  const profileCompletedHandler = (isProfileCompleted) => {
    setisProfileCompleted(isProfileCompleted);
  };

  useEffect(() => {
    window.addEventListener("mouseover", autologoutHandler);
    window.addEventListener("keydown", autologoutHandler);
    // Returns a clean up function
    return () => {
      window.removeEventListener("mouseover", autologoutHandler);
      window.removeEventListener("keydown", autologoutHandler);
    };
  }, []);

  const contextValue = {
    email: email,
    token: token,
    isLoggedIn: userLoggedIn,
    isVerified: isEmailVerified,
    isProfileCompleted: isProfileCompleted,
    login: loginHandler,
    logout: logoutHandler,
    autologout: autologoutHandler,
    verifyEmail: emailVerificationHandler,
    profileCompleted: profileCompletedHandler,
  };
  return (
    <authContext.Provider value={contextValue}>
      {props.children}
    </authContext.Provider>
  );
};
