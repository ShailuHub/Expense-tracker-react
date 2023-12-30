import { Route, Routes } from "react-router-dom";
import AuthenticationForm from "./pages/AuthenticationForm";
import Products from "./pages/Products";
import About from "./pages/About";
import ProfileForm from "./components/Profile/ProfileForm";
import NotFoundPage from "./pages/NotFoundPage";
import { useContext } from "react";
import { authContext } from "./store/auth-context";
import { Navigate } from "react-router-dom";

const App = () => {
  const authCtx = useContext(authContext);
  const userLoggedIn = authCtx.isLoggedIn;
  return (
    <Routes>
      <Route path="/login" element={<AuthenticationForm />} />
      <Route
        path="/products"
        element={userLoggedIn ? <Products /> : <Navigate to="/login" />}
      />
      <Route path="/about" element={<About />} />

      <Route path="/profile" element={<ProfileForm />} />

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
