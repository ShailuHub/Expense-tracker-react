import { useEffect, useRef, useState } from "react";
import Axios from "axios";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";

const ProfileForm = (props) => {
  const photoUrlInput = useRef();
  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState({
    displayName: "",
    photoUrl: "",
  });

  useEffect(() => {
    getUserDetails();
  }, []);

  const profileFormHandler = async (event) => {
    event.preventDefault();
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM";
    const displayName =
      firstNameInput.current.value + " " + lastNameInput.current.value;
    const photoUrl = photoUrlInput.current.value;
    const idToken = localStorage.getItem("token");

    try {
      const response = await Axios.post(url, {
        idToken,
        displayName,
        photoUrl,
        returnSecureToken: true,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM";
    const idToken = localStorage.getItem("token");

    try {
      const response = await Axios.post(url, {
        idToken,
      });
      const { displayName, photoUrl } = response.data.users[0];
      setProfileDetails({ displayName, photoUrl });

      // Set input field values
      if (firstNameInput.current) {
        const splitDisplayName = displayName.split(" ");
        firstNameInput.current.value = splitDisplayName[0] || "";
        lastNameInput.current.value = splitDisplayName[1] || "";
        photoUrlInput.current.value = photoUrl || "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelProfileFormHandler = () => {
    navigate("/products");
  };

  return (
    <>
      <Layout>
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
