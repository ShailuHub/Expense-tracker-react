import { useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [para, setPara] = useState(false);
  const navigate = useNavigate();
  const emailInput = useRef();

  const forgotPasswordHandler = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true at the beginning

    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM";

    try {
      const email = emailInput.current.value;
      const requestType = "PASSWORD_RESET";
      const response = await Axios.post(url, {
        requestType,
        email,
      });

      // If successful response, show the success message
      setPara(true);
    } catch (error) {
      if (error && error.response && error.response.data) {
        alert(error.response.data.error.message);
      }
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Form style={{ width: "300px" }} onSubmit={forgotPasswordHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="text-center">
              {para
                ? "A reset link has been sent to the registered email"
                : "Enter the email with which you have registered"}
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailInput}
            />
          </Form.Group>
          {loading ? (
            <button className="btn btn-primary" type="button" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={para} // Disable the button if the reset link has been sent
            >
              {para ? "Reset Link Sent" : "Send Link"}
            </Button>
          )}

          <Button
            type="button"
            className="w-100 mt-2 text-dark"
            style={{ backgroundColor: "transparent" }}
            onClick={() => navigate("/login")}
          >
            Login with an existing account
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default ForgotPassword;
