import Layout from "../layout/Layout";
import { Container } from "react-bootstrap";
import classes from "./Products.module.css";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../store/auth-context";

const Products = () => {
  const [profileForm, setProfileForm] = useState(true);
  const authCtx = useContext(authContext);

  const profileFormShowHandler = () => {
    setProfileForm((previousState) => !previousState);
  };

  return (
    <Layout>
      {!profileForm ? (
        <Navigate to="/profile" />
      ) : (
        <Container>
          <div
            className={`${classes.updateProfileContainer} container d-flex flex-row justify-content-between mt-5`}
          >
            <p>Welcome to Expense Tracker!!</p>
            {authCtx.isProfileCompleted ? null : (
              <button onClick={profileFormShowHandler}>
                Your profile is incomplete.{" "}
                <span className="text-primary">Complete it now</span>
              </button>
            )}
          </div>
        </Container>
      )}
    </Layout>
  );
};

export default Products;
