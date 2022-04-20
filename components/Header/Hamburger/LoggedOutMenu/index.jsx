import cn from "classnames";
import { signIn } from "next-auth/react";
import { navItems, hamburgerMenu, active } from "../Hamburger.module.scss";

const LoggedOutMenu = ({ menuOpened, setMenuOpened }) => {
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
