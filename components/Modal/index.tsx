import { CrossIcon } from "components/Icons";
import styles from "./Modal.module.scss";

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ setShow, name, children }) => {
  return (
    <>
      <div className={styles.blocker} onClick={() => setShow(false)} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{name}</h2>
          <button className={styles.cross} onClick={() => setShow(false)}>
            <CrossIcon />
          </button>
        </div>
        {children}
      </div>
    </>
  );
};

export default Modal;
