import { useEffect } from "react";
import EmailVerificationModals from "../../modals/EmailVerificationModals";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { authAction } from "../../store/redux";
import { useDispatch, useSelector } from "react-redux";

//
const VerifyEmail = () => {
  const isEmailVerified = useSelector((state) => state.auth.isEmailVerified);
  console.log(isEmailVerified);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailIsVerified = isEmailVerified;

  // Handler to cancel email verification
  const cancelVerifyEmailHandler = () => {
    navigate("/product");
  };

  // Handler to initiate email verification
  const verifyEmailHandler = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM"; // Replace with your API key

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const idToken = user.tokenId;
      const email = user.email;
      const requestType = "VERIFY_EMAIL";
      const response = await Axios.post(url, {
        idToken,
        email,
        requestType,
      });
      dispatch(authAction.emailVerification({ emailVerified: true }));
    } catch (error) {
      console.log(error);
    }
  };

  // Use useEffect to run the email verification check when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const emailVerified = !!user.emailVerified;
    console.log(emailVerified);
    dispatch(authAction.emailVerification({ emailVerified: emailVerified }));
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
                navigate("/home");
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
