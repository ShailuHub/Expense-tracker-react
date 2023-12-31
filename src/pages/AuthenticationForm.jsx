import { useContext, useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Axios from "axios";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { authContext } from "../store/auth-context";
import VerifyEmail from "../components/Profile/VerifyEmail";

const AuthenticationForm = () => {
  const emailInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const [login, setlogIn] = useState(true);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const authCtx = useContext(authContext);

  const authFormSubmitHandler = async (event) => {
    event.preventDefault();
    let url;
    if (!login) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM`;
    }
    if (!login) {
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
          authCtx.login(response.data.email, response.data.idToken);
          navigate("/products");
        } catch (error) {
          if (error && error.response && error.response.data) {
            alert(error.response.data.error.message);
          }
          console.log(error);
          navigate("/login");
        }
      } else {
        alert("Password and confirm password doesn't match");
        navigate("/login");
      }
    } else if (login) {
      const email = emailInput.current.value;
      const password = passwordInput.current.value;
      try {
        const response = await Axios.post(url, {
          email,
          password,
          returnSecureToken: true,
        });
        authCtx.login(response.data.email, response.data.idToken);
        navigate("/products");
      } catch (error) {
        if (error && error.response && error.response.data) {
          alert(error.response.data.error.message);
        }
        console.log(error);
      }
    }
  };

  const authToggleButton = () => {
    setlogIn((previousState) => !previousState);
  };

  return (
    <Layout>
      <Container className="d-flex justify-content-center align-items-center vh-100">
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

          {!login && (
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
          {!login ? (
            <Button variant="primary" type="submit" className="w-100">
              signUp
            </Button>
          ) : (
            <Button variant="primary" type="submit" className="w-100">
              login
            </Button>
          )}
          <Button
            type="button"
            className="w-100 mt-2 text-dark"
            style={{ backgroundColor: "transparent" }}
            onClick={authToggleButton}
          >
            {!login ? "Log in with existing email" : "Create new Account"}
          </Button>
        </Form>
      </Container>
      {/* {!isEmailVerified ? (
        <Container className="d-flex justify-content-center align-items-center vh-100">
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

            {!login && (
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
            {!login ? (
              <Button variant="primary" type="submit" className="w-100">
                signUp
              </Button>
            ) : (
              <Button variant="primary" type="submit" className="w-100">
                login
              </Button>
            )}
            <Button
              type="button"
              className="w-100 mt-2 text-dark"
              style={{ backgroundColor: "transparent" }}
              onClick={authToggleButton}
            >
              {!login ? "Log in with existing email" : "Create new Account"}
            </Button>
          </Form>
        </Container>
      ) : (
        <VerifyEmail onVerificationSuccess={() => setEmailVerified(true)} />
      )} */}
    </Layout>
  );
};

export default AuthenticationForm;
