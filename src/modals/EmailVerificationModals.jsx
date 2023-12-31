import { createPortal } from "react-dom";
import "./EmailVerification.css";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const ModalOverlays = (props) => {
  return (
    <>
      <div className="emailModal-container">{props.children}</div>
    </>
  );
};

const portalElement = document.getElementById("overlays");

const EmailVerificationModals = (props) => {
  return (
    <>
      {createPortal(<Backdrop />, portalElement)};
      {createPortal(
        <ModalOverlays>{props.children}</ModalOverlays>,
        portalElement
      )}
    </>
  );
};

export default EmailVerificationModals;
