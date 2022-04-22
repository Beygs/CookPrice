import Link from "next/link";
import Hamburger from "./Hamburger";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navItems}>
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
