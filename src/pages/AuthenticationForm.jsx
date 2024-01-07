import { useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../store/redux";

const AuthenticationForm = () => {
  const toggleForLogin = useSelector((state) => state.auth.toggleLoginToSignUp);
  const dispatch = useDispatch();
  const emailInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const authFormSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    let url;
    if (!toggleForLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM`;
    }

    if (!toggleForLogin) {
      const email = emailInput.current.value;
      const password = passwordInput.current.value;
      const confirmPassword = confirmPasswordInput.current.value;

      if (password === confirmPassword) {
        try {
          const response = await Axios.post(url, {
            email,
            password,
            returnSecureToken: true,
          });
          dispatch(
            authAction.login({
              email: response.data.email,
              tokenId: response.data.idToken,
              uid: response.data.localId,
            })
          );
          navigate("/home");
        } catch (error) {
          if (error && error.response && error.response.data) {
            alert(error.response.data.error.message);
          }
          console.log(error);
          navigate("/login");
        }
      } else {
        alert("Password and confirm password don't match");
        navigate("/login");
      }
    } else if (toggleForLogin) {
      const email = emailInput.current.value;
      const password = passwordInput.current.value;

      try {
        const response = await Axios.post(url, {
          email,
          password,
          returnSecureToken: true,
        });
        dispatch(
          authAction.login({
            email: response.data.email,
            tokenId: response.data.idToken,
            uid: response.data.localId,
          })
        );
        navigate("/products");
      } catch (error) {
        if (error && error.response && error.response.data) {
          alert(error.response.data.error.message);
        }
        console.log(error);
      }
    }

    setLoading(false);
  };

  const authToggleButton = () => {
    dispatch(authAction.toggle());
  };

  return (
    <Layout>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Form style={{ width: "300px" }} onSubmit={authFormSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailInput}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={passwordInput}
            />
          </Form.Group>

          {!toggleForLogin && (
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                ref={confirmPasswordInput}
              />
            </Form.Group>
          )}
          {loading && <p>Sending request...</p>}
          {!toggleForLogin ? (
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              Sign Up
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              Login
            </Button>
          )}
          <Button
            type="button"
            className="w-100 mt-2 text-dark"
            style={{ backgroundColor: "transparent" }}
            onClick={authToggleButton}
          >
            {!toggleForLogin
              ? "Log in with existing email"
              : "Create new Account"}
          </Button>
          <Button
            type="button"
            className="w-100 mt-2 text-dark"
            style={{ backgroundColor: "transparent" }}
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            Forgot Password
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default AuthenticationForm;
