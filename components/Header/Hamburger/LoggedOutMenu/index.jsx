import cn from "classnames";
import { signIn } from "next-auth/react";
import { navItems, hamburgerMenu, active } from "../Hamburger.module.scss";

const LoggedOutMenu = ({ menuOpened }) => {
  return (
    <ul
      className={cn(navItems, hamburgerMenu, {
        [active]: menuOpened,
      })}
    >
      <li>
        <button onClick={() => signIn()}>
          Me Connecter
        </button>
      </li>
    </ul>
  )
}

export default LoggedOutMenu