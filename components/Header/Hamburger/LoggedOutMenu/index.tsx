import cn from "classnames";
import { signIn } from "next-auth/react";
import React from "react";
import styles from "../Hamburger.module.scss";

interface Props {
  menuOpened: boolean;
  setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoggedOutMenu: React.FC<Props> = ({ menuOpened, setMenuOpened }) => {
  const { navItems, hamburgerMenu, active } = styles;

  return (
    <ul
      className={cn(navItems, hamburgerMenu, {
        [active]: menuOpened,
      })}
    >
      <li>
        <button
          onClick={() => {
            setMenuOpened(false);
            signIn();
          }}
        >
          Me&nbsp;Connecter
        </button>
      </li>
    </ul>
  );
};

export default LoggedOutMenu;
