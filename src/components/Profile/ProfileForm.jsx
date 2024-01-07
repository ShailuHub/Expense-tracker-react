import { useEffect, useRef, useState } from "react";
import Axios from "axios";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { profileAction } from "../../store/redux";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const photoUrlInput = useRef();
  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  // Fetch user details when the component mounts
  useEffect(() => {
    getUserDetails();
  }, []);

  // Handle profile form submission
  const profileFormHandler = async (event) => {
    event.preventDefault();
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM";
    const displayName =
      firstNameInput.current.value + " " + lastNameInput.current.value;
    const photoUrl = photoUrlInput.current.value;
    const idToken = JSON.parse(localStorage.getItem("user")).tokenId;

    try {
      const response = await Axios.post(url, {
        idToken,
        displayName,
        photoUrl,
        returnSecureToken: true,
      });

      // Check if the request was successful
      if (response.status === 200) {
        // Set updated state to true and reset after 1000ms
        setUpdated(true);
        setTimeout(() => {
          setUpdated(false);
        }, 1000);
      }
      getUserDetails();
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch user details from the server
  const getUserDetails = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM";
    const idToken = JSON.parse(localStorage.getItem("user")).tokenId;
    try {
      const response = await Axios.post(url, {
        idToken,
      });
      // Destructure user details or set defaults
      const { displayName, photoUrl } = response.data.users[0] || {
        displayName: "",
        photoUrl: "",
      };
      if (displayName !== "") {
        const splitDisplayName = displayName.split(" ");
        const firstName = splitDisplayName[0] || "";
        const lastName = splitDisplayName[1] || "";
        firstNameInput.current.value = splitDisplayName[0] || "";
        lastNameInput.current.value = splitDisplayName[1] || "";
        photoUrlInput.current.value = photoUrl || "";
        dispatch(
          profileAction.profileDetails({ firstName, lastName, photoUrl })
        );
      }

      // Check if all required fields are filled and update context
      if (
        firstNameInput.current.value !== "" &&
        lastNameInput.current.value !== "" &&
        photoUrlInput.current.value !== ""
      ) {
        dispatch(
          profileAction.checkForProfileComplete({
            isProfileCompleted: true,
            displayName: firstNameInput.current.value || "Saver",
          })
        );
      } else {
        dispatch(
          profileAction.checkForProfileComplete({
            isProfileCompleted: false,
            displayName: firstNameInput.current.value || "Saver",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle cancel button click
  const cancelProfileFormHandler = () => {
    navigate("/products");
  };

  return (
    <>
      <Layout>
        {updated && (
          // Display a success alert if the profile is updated
          <div
            className="alert alert-primary container text-center mt-3"
            style={{ width: "30rem" }}
            role="alert"
          >
            Your Profile is updated.
          </div>
        )}
        <div className="container mt-5" style={{ width: "30rem" }}>
          <h3>Contact Details</h3>
          <form action="" onSubmit={profileFormHandler}>
            <div className="form-group mt-3">
              <label htmlFor="firstName">First Name</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">First Name</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  ref={firstNameInput}
                />
              </div>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">Last Name</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  ref={lastNameInput}
                />
              </div>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="photoUrl">Upload Your photo url</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">Url</span>
                </div>
                <input
                  type="url"
                  className="form-control"
                  id="photoUrl"
                  ref={photoUrlInput}
                />
              </div>
            </div>

            <div className="mt-3 d-flex justify-content-between">
              <button type="submit" className="btn btn-success">
                Update
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={cancelProfileFormHandler}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ProfileForm;
