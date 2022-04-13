import Link from "next/link";
import Hamburger from "./Hamburger";
import { header, nav, navItems } from "./Header.module.scss";

const Header = () => {
  return (
    <header className={header}>
      <nav className={nav}>
        <ul className={navItems}>
          <li>
            <Link href="/">
              <a>CookPrice</a>
            </Link>
          </li>
          <li>
            <Hamburger />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
