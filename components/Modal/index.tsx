import { CrossIcon } from "components/Icons";
import { blocker, cross, header, modal } from "./Modal.module.scss";

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ setShow, name, children }) => {
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
