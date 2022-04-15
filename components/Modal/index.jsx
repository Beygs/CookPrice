import Ingredient from "components/Forms/Ingredient";
import { CrossIcon } from "components/Icons";
import {
  blocker,
  modal,
  header,
  cross,
} from "./Modal.module.scss";

const Modal = ({ setShow, name, children }) => {
  return (
    <>
      <div className={blocker} onClick={() => setShow(false)} />
      <div className={modal}>
        <div className={header}>
          <h2>{name}</h2>
          <button className={cross} onClick={() => setShow(false)}>
            <CrossIcon />
          </button>
        </div>
        {children}
      </div>
    </>
  );
};

export default Modal;
