import { Route, Routes } from "react-router-dom";
import AuthenticationForm from "./pages/AuthenticationForm";
import Home from "./pages/Home";
import About from "./pages/About";
import ProfileForm from "./components/Profile/ProfileForm";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPassword from "./pages/ForgotPassword";
import { Navigate } from "react-router-dom";
import VerifyEmail from "./components/Profile/VerifyEmail";
import { useSelector } from "react-redux";

const App = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Routes>
      <Route path="/login" element={<AuthenticationForm />} />
      <Route
        path="/home"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
      />
      <Route path="/about" element={<About />} />

      <Route
        path="/profile"
        element={isLoggedIn ? <ProfileForm /> : <Navigate to="/login" />}
      />
      <Route
        path="/email-verification"
        element={isLoggedIn ? <VerifyEmail /> : <Navigate to="/login" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
