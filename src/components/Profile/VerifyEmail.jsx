import { useContext, useEffect } from "react";
import EmailVerificationModals from "../../modals/EmailVerificationModals";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../store/auth-context";

const VerifyEmail = () => {
  const authCtx = useContext(authContext);
  const navigate = useNavigate();
  const emailIsVerified = authCtx.isVerified;

  // Handler to cancel email verification
  const cancelVerifyEmailHandler = () => {
    navigate("/product");
  };

  // Handler to initiate email verification
  const verifyEmailHandler = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=YOUR_API_KEY"; // Replace with your API key

    try {
      const idToken = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      const requestType = "VERIFY_EMAIL";
      const response = await Axios.post(url, {
        idToken,
        email,
        requestType,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Check if email is verified when the component mounts
  const checkIsEmailVerified = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=YOUR_API_KEY"; // Replace with your API key
    const idToken = localStorage.getItem("token");

    try {
      const response = await Axios.post(url, {
        idToken,
        returnSecureToken: true,
      });

      // Get the email verification status and update the context
      const emailVerified = response.data.emailVerified;
      authCtx.verifyEmail(emailVerified);
    } catch (error) {
      console.log(error);
    }
  };

  // Use useEffect to run the email verification check when the component mounts
  useEffect(() => {
    checkIsEmailVerified();
  }, []);

  return (
    <>
      {!emailIsVerified ? (
        // Display email verification modal for unverified email
        <EmailVerificationModals>
          <p>
            Please verify your email. It will help you in finding your account &
            when you forget your password...
          </p>
          <div className="d-flex gap-4">
            <button className="btn btn-danger" onClick={verifyEmailHandler}>
              Verify Email
            </button>
            <button
              className="btn btn-success"
              onClick={cancelVerifyEmailHandler}
            >
              Not Now
            </button>
          </div>
        </EmailVerificationModals>
      ) : (
        // Display email verification modal for verified email
        <EmailVerificationModals>
          <h2>Verified account</h2>
          <div className="d-flex gap-4">
            <button className="btn btn-success disabled">Verified Email</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/products");
              }}
            >
              Go to dashboard
            </button>
          </div>
        </EmailVerificationModals>
      )}
    </>
  );
};

export default VerifyEmail;
